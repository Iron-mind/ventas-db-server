import { Router } from "express";
import { Op } from "sequelize";

import Income from "../models/Income.js";
import Sale from "../models/Sale.js";

let router = Router();
router.get("/", async (req, res, next) => {
  let { value } = req.query;
  const numberValue = isNaN(Number(value))?0:Number(value);
  
  if (value) {
    Income.findAll({
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
      include: [Sale],
    })
      .then((incomes) => {
        res.send(incomes);
      })
      .catch((error) => console.log(error));
  } else {
    Income.findAll({
      include: [Sale],
      limit:30,
      order: [['updatedAt', 'DESC']]
    })
      .then((incomes) => {
        res.send(incomes);
      })
      .catch((error) => {
          console.log(error);
          res.send({msg:'Algo salió mal'})
        });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const incomeToSave = req.body;
    let income = await Income.create(incomeToSave);
    res.send({ msg: "Ingreso CREADO", income });
  } catch (error) {
    res.send({ msg: "algo salió mal" });
    console.log(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const updatedData = req.body;
    let income = await Income.findByPk(updatedData.id);
    await income.update(updatedData);

    res.send({ msg: "Ingreso ACTUALIZADO", income });

  } catch (error) {
    res.send({ msg: "Algo salió mal" });
    console.log(error);
  }
});


export default router;
