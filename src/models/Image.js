import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
import Product from "./Product.js";


const Image = sequelize.define("image",{
    link:{
        type:DataTypes.TEXT
    }
    
})

Product.hasMany(Image, {
    foreignKey: "productId",
  });
  
Image.belongsTo(Product)

export default Image;