import { Router } from "express";
import { Op } from "sequelize";

import Expense from "../models/Expense.js";


let router = Router();
//router.use(jwtMiddleware)
router.get("/", async (req, res, next) => {
  let { value } = req.query;
  const numberValue = isNaN(Number(value))?0:Number(value);
  
  if (value) {
    Expense.findAll({
      where: {
        [Op.or]: [
          {
            value: {
              [Op.between]: isNaN(Number(value))?[]:[numberValue - 10000, numberValue + 10000],

            }
          },
          { description: { [Op.like]: `%${String(value)}%` } },
        ],
      },
    })
      .then((expeses) => {
        res.send(expeses);
      })
      .catch((error) => console.log(error));
  } else {
    Expense.findAll({ limit: 30, order: [["updatedAt", "DESC"]] })
      .then((expeses) => {
        res.send(expeses);
      })
      .catch((error) => {
        console.log(error);
        res.send({ msg: "Algo salió mal" });
      });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const expeseToSave = req.body;
    let expese = await Expense.create(expeseToSave);

    res.send({ msg: "Se creó el gasto correctamente" });
  } catch (error) {
    res.send({ msg: "algo salió mal" });
    console.log(error);
  }
});

router.put("/", async (req, res) => {
  try {
    const updatedData = req.body;
    let expese = await Expense.findByPk(updatedData.id);
    await expese.update(updatedData);

    res.send({ msg: "Se actualizó el gasto correctamente" });
  } catch (error) {
    res.send({ msg: "Algo salió mal" });
    console.log(error);
  }
});

export default router;
