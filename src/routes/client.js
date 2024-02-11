import { Router } from "express";
import { Op } from "sequelize";
import Client from "../models/Client.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { name , phoneNumber} = req.query;
    
    let clients = [];
    if (name) {
      clients = await Client.findAll({
        where: {
          name: {
            			[Op.iLike]: `%${name}%`,
            		}
        },
        limit: 20,
      });
      return res.send(clients);
    }
    else if (phoneNumber) {
      clients = await Client.findAll({
        where: {
          phoneNumber: {
            			[Op.iLike]: `%${phoneNumber}%`,
            		}
        },
        limit: 20,
      });
      return res.send(clients);
    }
    clients = await Client.findAll({limit: 20});
      
    res.send(clients);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Algo salió mal" });
  }
});

router.post("/", async (req, res) => {
    try {
        const clientToSave = req.body;
        let client = await Client.create(clientToSave);
        res.json({ msg: "Se creó el cliente correctamente", client });
    } catch (error) {
        res.json({ msg: "algo salió mal" });
        console.log(error);
    }
});

export default router;
