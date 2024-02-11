import { Router } from "express";
import { Op } from "sequelize";
import sequelize from "../db.js";
import Income from "../models/Income.js";
import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import User from "../models/User.js";
import { sendNotification } from "../shared/notification.js";
import Client from "../models/Client.js";

let { product_sale } = sequelize.models;

let router = Router();
export async function createClient(sale){
  if (sale.contact) {
        
    const client = await Client.findOrCreate({
      where: {
        phoneNumber: sale.contact,
      },
      defaults: {
        name: sale.buyer,
        phoneNumber: sale.contact,
        saleId: sale.id,
      },
    })
  }
}
router.get("/", async (req, res, next) => {
  let { name } = req.query;
  if (name) {
  const numberValue = isNaN(Number(name))?0:Number(name);
    Sale.findAll({
      where: {
        [Op.or]: [
          {
            buyer: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
          total: {
            [Op.between]: numberValue?[numberValue - 1000, numberValue + 1000]:[]//isNaN(Number(name))?[]:[numberValue - 10000, numberValue + 10000],
          }}
        ],
      },
      include: [Product, User],
    })
      .then((sales) => {
        res.send(sales);
      })
      .catch((error) => console.log(error));
  } else {
    Sale.findAll({
      include: [Product, User],
    })
      .then((sales) => {
        res.send(sales);
      })
      .catch((error) => console.log(error));
  }
});

router.get("/:id", async (req, res, next) => {
  let { id } = req.params;
  Sale.findByPk(id, {
    include: [Product, User],
  })
    .then((sale) => {
      res.send(sale);
    })
    .catch((error) => console.log(error));
});

router.post("/", async (req, res, next) => {
  try {
    const saleToSave = req.body;
    let seller = await User.findByPk(saleToSave.seller);
    let sale = await Sale.create(saleToSave);
    await seller.addSale(sale);
    if (saleToSave.products) {
      let promises = saleToSave.products.map((p) => {
        if (!p.id) {
          delete p.id;
          return Product.create({ ...p, status: false }).then((pr) => {
            sale.addProduct(pr, { through: { units: p.units , last_price: pr.price} });
          });
        }
        return Product.findByPk(p.id).then((pr) => {
          sale.addProduct(pr, { through: { units: p.units  , last_price: pr.price } });
        });
      });
      await Promise.all(promises);
    }
    if (saleToSave.state == "done") {
      let productIsNotAvailable = false;
      let soldOutProducts = [];
      let anotherPromises = saleToSave.products.map((p) => {
        if(p.id){
          return Product.findByPk(p.id).then((pr) => {
            productIsNotAvailable = pr.stock - p.units < 3;
            soldOutProducts.push(pr.name);
            pr.update({ stock: pr.stock - p.units });
          });
        }
      });
      await Promise.all(anotherPromises);
      let inc = await Income.create({
        description: sale.description,
        value: sale.paid || null,
      });
      await inc.setSale(sale);

      //notification
      if(productIsNotAvailable){
        const message = 'Producto agotado: ' + soldOutProducts.join(', ');
        await sendNotification(message,'/inventario');
      }
      await createClient(sale);
      
    }
    res.send(sale);
  } catch (error) {
    res.send({ msg: "algo salió mal" });
    console.log(error);
  }
});

router.put("/", async (req, res) => {
  try {
    const saleToUpdate = req.body;
    let sale = await Sale.findByPk(saleToUpdate.id , { include: [Product, User] });

    if (!sale) {
      return res.send({ msg: "Id no reconocido" });
    }
    let restoreStockPromises = sale.products.map((p) => {
      if(p.id){
        return Product.findByPk(p.id).then((pr) => {
          pr.update({ stock: pr.stock + p.product_sale?.units });
        });
      }
    });
    await Promise.all(restoreStockPromises);
    await product_sale.destroy({ where: { saleId: sale.id } });
    let promises = saleToUpdate.products.map((p) => {
        if (!p.id) {
          delete p.id;
          return Product.create({ ...p, status: false }).then((pr) => {
            sale.addProduct(pr, { through: { units: p.units, last_price: pr.price } });
          });
        }
        return Product.findByPk(p.id).then((pr) => {
          sale.addProduct(pr, { through: { units: p.units, last_price: pr.price } });
        });
    });
    await Promise.all(promises);
    let productIsNotAvailable = false;
    let soldOutProducts = [];
    let anotherPromises = saleToUpdate.products.map((p) => {
        if(p.id){
          return Product.findByPk(p.id).then((pr) => {
            productIsNotAvailable = (pr.stock - p.units) < 3;
            if(productIsNotAvailable) soldOutProducts.push(pr.name);
            pr.update({ stock: pr.stock - p.units });
          });
        }
    });
    await Promise.all(anotherPromises);
    await sale.update(saleToUpdate);
    if (saleToUpdate.state == "done") {
      let inc = null;
      if(sale.incomeId){
        inc = await Income.findByPk(sale.incomeId);
        await inc?.update({ description: sale.description, value: sale.paid || 0 });
      }
      inc =
        inc ??
        (await Income.create({
          description: sale.description,
          value: sale.paid || null,
        }));
      await inc.setSale(sale);
      //notification
      if(productIsNotAvailable){
        const message = 'Producto agotado: ' + soldOutProducts.join(' /n');
        await sendNotification(message, '/inventario');
      }
    }
    await createClient(sale);
    res.send({ sale, msg: "Se actualizó correctamente" });
  } catch (error) {
    res.send({ msg: "Algo salió mal" });
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let sale = await Sale.findByPk(id);
  if (!sale) {
    return res.send({ msg: "Id no reconocido" });
  }
  await sale.update({ state: "canceled" });
  res.send({ msg: "Venta eliminada" });
});

export default router;
