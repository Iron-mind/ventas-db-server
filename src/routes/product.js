import { Router } from "express";
import { Op } from "sequelize";
import Image from "../models/Image.js";
import Product from "../models/Product.js";
import { decodeToken } from "./jwt.js";
import sequelize from "../db.js";

let router = Router();
router.get("/value-inventory", async (req, res) => {
	try {
		let total = await Product.findAll({
			attributes: [[sequelize.literal('SUM(price * stock)'), 'total_value']]
		  })
		  .then(result => {
			return result[0].getDataValue('total_value');
		  })
		
		res.send({ total });
	} catch (error) {
		console.log(error);
		res.send({ msg: "Algo salió mal" });
	}
});
	
router.get("/:id", (req, res) => {
	let { id } = req.params;
	Product.findByPk(id, { include: [Image] })
		.then((prodct) => {
			res.send(prodct);
		})
		.catch((err) => {
			console.log(err);
			res.send({ msg: "Algo salió mal" });
		});
});

router.get("/", async (req, res, next) => {
	let { name } = req.query;
	if (name) {
		Product.findAll({
			where: {
				name: {
					[Op.iLike]: `%${name}%`,
				},
			},
			include: [Image],
			limit: 15,
		})
			.then((products) => {
				res.send(products);
			})
			.catch((error) => console.log(error));
	} else {
		Product.findAll({
			include: [Image],
			limit: 15,
		})
			.then((product) => {
				res.send(product);
			})
			.catch((error) => console.log(error));
	}
});

router.post("/", async (req, res, next) => {
	try {
		let p = req.body;
		// if (p.stockDozens == 0) {
		// 	p = {
		// 		...p,
		// 		stockDozens: p.stock / 12,
		// 		wholesalePrice: p.wholesalePriceDozens / 12,
		// 		purchasePriceDozens: p.purchasePrice * 12,
		// 	};
		// } else if (p.stock == 0) {
		// 	p = {
		// 		...p,
		// 		stock: p.stockDozens * 12,
		// 		wholesalePrice: p.wholesalePriceDozens / 12,
		// 		purchasePrice: Number((p.purchasePriceDozens / 12).toFixed(3)),
		// 	};
		// }
		let product = await Product.create(p);
		if (p.images) {
			let promises = p.images.map((imgUrl) => {
				return Image.create({
					link: imgUrl,
				});
			});
			let pics = await Promise.all(promises);
			await product.addImages(pics);
			return res.send({ product, msg: "Producto creado" });
		}

		res.send({ product, msg: "Producto creado" });
	} catch (error) {
		res.send({ msg: "algo salió mal" });
		console.log(error);
	}
});

router.put("/", async (req, res, next) => {
	try {
		const p = req.body;
		let product = await Product.findByPk(p.id);
		await product.update(p);
		await Image.findAll({
			where: {
				productId: p.id,
			},
		}).then((imgs) => {
			return imgs.map((i) => i.destroy());
		});
		if (p.images) {
			let promises = p.images.map((imgUrl) => {
				return Image.create({
					link: imgUrl,
				});
			});
			let pics = await Promise.all(promises);
			await product.addImages(pics);
			return res.send({ product, msg: "Producto editado" });
		}

		res.send({ product, msg: "Producto editado" });
	} catch (error) {
		res.send({ msg: "Algo salió mal" });
		console.log(error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		let { id } = req.params;
		let p = await Product.findByPk(id);
		let { token } = req.headers;
		const { rol } = decodeToken(token).payload;
		if (rol !== "admin") {
			return res.send({
				msg: "Tienes que ser administrador para borrar este producto",
			});
		}
		let theSalesWithThisProduct = await p.getSales();
		if (theSalesWithThisProduct.length > 0) {
			return res.send({ msg: "No puedes borrar este producto" });
		}
		await p.destroy();
		return res.send({ msg: "Producto borrado" });
	} catch (err) {
		res.send({ msg: "Algo salió mal" });
	}
});

export default router;
