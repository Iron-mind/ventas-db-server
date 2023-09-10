import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
const Expense = sequelize.define("expense",{
    value:{
        type:DataTypes.INTEGER
    },
    description:{
        type: DataTypes.TEXT
    }
})


export default Expense;