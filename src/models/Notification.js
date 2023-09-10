import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
const Notification = sequelize.define("notification",{
    message:{
        type:DataTypes.TEXT
    },
    type:{
        type: DataTypes.ENUM("success","warning", 'danger', 'info'),
        defaultValue:"info"
    },
    read:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    redirect:{
        allowNull:true,
        type:DataTypes.STRING
    }

})


export default Notification;