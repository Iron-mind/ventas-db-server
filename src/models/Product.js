import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Sale from "./Sale.js";
const Product = sequelize.define("product", {
	name: {
		type: DataTypes.STRING,
	},
	stock: {
		type: DataTypes.INTEGER,
	},
	purchasePrice: {
		type: DataTypes.FLOAT,
	},
	wholesalePrice: {
		type: DataTypes.FLOAT,
	},
	price: {
		type: DataTypes.FLOAT,
	},
	// stockDozens: {
	// 	type: DataTypes.FLOAT,
	// },
	// wholesalePriceDozens: {
	// 	type: DataTypes.FLOAT,
	// },
	// purchasePriceDozens: {
	// 	type: DataTypes.FLOAT,
	// },
	description: {
		type: DataTypes.TEXT,
	},
	status: {
		type: DataTypes.BOOLEAN,
		defaultValue: true, //true = active, false = inactive or deleted, inactive means it is not visible to the cash register
		allowNull: false,
	},
	barcode: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		defaultValue: () => {
			return String(Math.floor(Math.random() * 900000) + 100000);
		},
	},
});
const ProductSale = sequelize.define("product_sale", {
	units: {
		type: DataTypes.INTEGER,
		defaultValue: 1,
	},
	last_price: {
		type: DataTypes.FLOAT,
	}
});

Sale.belongsToMany(Product, {
	through: "product_sale",
});
Product.belongsToMany(Sale, {
	through: "product_sale",
});
export default Product;
