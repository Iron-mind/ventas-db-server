
import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
import Sale from "./Sale.js";
const Income = sequelize.define("income",{
    value:{
        type:DataTypes.INTEGER
    },
    description:{
        type: DataTypes.TEXT
    }
})



Income.hasOne(Sale);
Sale.belongsTo(Income);

export default Income;