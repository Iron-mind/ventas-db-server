import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
import User from "./User.js";

const Sale = sequelize.define("sale",{
    buyer:{
        type:DataTypes.TEXT
    },
    state:{
        type: DataTypes.ENUM("inprogress","done", 'canceled'),
        defaultValue:"inprogress"
    },
    total:{
        type:DataTypes.INTEGER
    },
    paid:{
        type:DataTypes.INTEGER

    },
    contact:{
        type:DataTypes.TEXT
    },
    description:{
        type:DataTypes.TEXT

    }

})

User.hasMany(Sale, {
    foreignKey: "seller",
  });
Sale.belongsTo(User);

export default Sale;