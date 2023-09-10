import { Router } from "express";
import User from "../models/User.js";
import { generateToken, verifyToken } from "./jwt.js";
import bcrypt from "bcryptjs";
const saltRound = 10;
const salt = bcrypt.genSaltSync(saltRound);
let router = Router();

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const allUsers = await User.count();
    if(allUsers === 0){
      const hashPassword = bcrypt.hashSync(password, salt);
      await User.create({
        username: username,
        password: hashPassword,
        name: "admin",
        role: "admin",
      });
    }
    
    let auxMsg = allUsers === 0 ? "Usuario creado - " : "";
    const user = await User.findOne({ where: { username: username } });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          msg: auxMsg + "Iniciaste Sesión",
          token: generateToken({ username: username, rol: user.role }),
          id: user.id,
          username: user.username,
          name: user.name,
          role:user.role
        });
      } else {
        res.status(403).json({ msg: " Incorrect Password" });
      }
    } else {
      res.status(404).json({ msg: " Username not found" });
    }
  } catch (err) {
    console.log(err);
  }
});


router.post("/verifytoken", (req, res) => {
  try {
    let { token } = req.body;
    const verified = verifyToken(token);
    res.status(200).json({ validation: verified });

  } catch (e) {
      console.log(e);
      res.json({msg:'Algo salió mal'})
  }


});
export default router;
