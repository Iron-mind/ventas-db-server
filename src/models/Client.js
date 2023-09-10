
import { DataTypes} from "sequelize";
import sequelize  from "../db.js";
import Sale from "./Sale.js";

const Client = sequelize.define("client",{
    name:{
        type:DataTypes.STRING
    },
    phoneNumber:{
        type: DataTypes.STRING
    },
    countryCode:{
        type: DataTypes.STRING,
        defaultValue: "57"
    },
})

Sale.hasOne(Client);
Client.belongsTo(Sale);

export default Client;