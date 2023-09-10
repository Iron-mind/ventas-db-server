import {Sequelize} from 'sequelize';
import config from '../lib/config.js';
console.log(config.dbUri)
//coneccion local
const sslConfig = process.env.CONNECTION=="local"?"":"?sslmode=no-verify"
const sequelize = new Sequelize(`${config.dbUri}${sslConfig}`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  dialectOptions : process.env.CONNECTION=="local"|| {
      ssl : {
        require: !(process.env.CONNECTION=="local"),
        rejectUnauthorized: false // <<<<<<< YOU NEED THIS
      }
    }
})
export default sequelize;