import { Router} from 'express';
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import Sale from '../models/Sale.js';
import { decodeToken } from './jwt.js';
const saltRound = 10;
const salt = bcrypt.genSaltSync(saltRound);


let router= Router()
router.get('/', (req, res, next) => {
	User.findAll({include:[Sale]})
		.then((users) => {
			res.send(users);
		})
		.catch((error) => console.log(error));
});

router.post('/', async (req, res,next ) => {
	try {
		let token = req.headers['token'];
		let decoded = decodeToken(token);
		let {payload} =decoded 
		if(!decoded){
			return res.status(401).json({msg:"no hay sesión"});
		}

		if(payload.rol !== "admin"){
			return res.status(401).json({msg:"no tiene permisos"});
		}
		
		const {name, password, username, role} = req.body;
		const hashPassword =  bcrypt.hashSync(password, salt);
		User.create({name , username, password:hashPassword,role})
			.then((createdUser) => {
				res.send(createdUser);
			})
			.catch((error) => { console.log(error);res.json({msg:'error', error})});
		
	} catch (error) {
		console.log(error);
	}

});

router.put('/', async (req, res, next) => {
	try {
		let token = req.headers['token'];
		let decoded = decodeToken(token);
		let {payload} =decoded
		if(!decoded){
			return res.status(401).json({msg:"no hay sesión"});
		}

		if(payload.rol !== "admin"){
			return res.status(401).json({msg:"no tiene permisos"});
		}
		const {id} = req.body;
		let newUser = await User.update(req.body, {where:{id}})
		res.send(newUser);
	} catch (error) {
		console.log(error);
	}
});
//router.put("/password", async (req, res) => {
	//   try {
	//     const { username, password } = req.body;
	//     const user = await User.findAll({
	//       where: {
	//         username: username,
	//       },
	//     });
	//     if (user.length > 0) {
	//       const hashPassword = bcrypt.hashSync(password, salt);
	//       await User.update(
	//         { password: hashPassword },
	//         {
	//           where: {
	//             username: username,
	//           },
	//         }
	//       );
	//       res.status(200).json({ msg: "Password Restore " });
	//     } else {
	//       res.status(404).json({ msg: "User not found" });
	//     }
	//   } catch (err) {
	//     console.log(err);
	//     res.status(404).json({ msg: "error " });
	//   }
	// });
	

export default router;