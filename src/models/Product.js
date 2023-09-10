import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
import Sale from "./Sale.js";
const Product = sequelize.define("product",{
    name:{
        type:DataTypes.STRING
    },
    stock:{
        type: DataTypes.INTEGER
    },
    purchasePrice:{
        type:DataTypes.INTEGER
    },
    wholesalePrice:{
        type:DataTypes.INTEGER
    },
    price:{
        type:DataTypes.INTEGER
    },
    description:{
        type:DataTypes.TEXT

    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue:true,  //true = active, false = inactive or deleted, inactive means it is not visible to the cash register
        allowNull:false
    }
})
const ProductSale = sequelize.define("product_sale", {
    units: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
})

Sale.belongsToMany(Product,{
    through:"product_sale"
})
Product.belongsToMany(Sale,{
    through:"product_sale"
})
export default Product;
