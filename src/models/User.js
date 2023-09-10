import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
const User = sequelize.define("user",{
    name:{
        type:DataTypes.STRING
    },
    username:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type: DataTypes.TEXT
    },
    role:{
        type: DataTypes.ENUM('seller',"admin"),
        defaultValue:"seller"
    },
    phoneNumber:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:true
    },
})

export default User;