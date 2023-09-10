import { Router } from "express";
import { Op } from "sequelize";
import Client from "../models/Client.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      const clients = await Client.findAll({limit: 20});
      return res.send(clients);
    }
    const clients = await Client.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`
            }
        },
        limit: 20
    });
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
