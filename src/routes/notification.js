import { Router } from "express";
import Notification from "../models/Notification.js";
import { sendNotification } from "../shared/notification.js";
import { client, getQRHtmlString } from "../shared/whatsapp.js";

let router = Router();

router.get("/", async (req, res, next) => {
  try {
    let notifications = await Notification.findAll({
      where: {
        read: false,
      },
    });
    res.send(notifications);
  } catch (error) {
    console.log(error);
    res.send({ msg: "Algo salió mal" });
  }
});

router.put("/", async (req, res, next) => {
  try {
    const { id } = req.body;
    const { all } = req.query;

    if (all) {
      await Notification.update(
        {
          read: true,
        },
        {
          where: {
            read: false,
          },
        }
      );
      return res.send('ok');
    }
    let notification = await Notification.findByPk(id);
    await notification.update({
      read: true,
    });
    res.status(202).send("ok");
  } catch (error) {
    console.log(error);
    res.send({ msg: "Algo salió mal" });
  }
});
router.get("/wp-session", async (req, res, next) => {
  try {

    let phoneNumber = client.info?.wid.user

    if (phoneNumber) {
      //el mensaje tiene que ser enviado así
      return res.send(
        "Ya tienes un numero asociado para enviar notificaciones: " +
        phoneNumber
      );
    }
    getQRHtmlString(res);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Algo salió mal" });
  }
});

router.post("/logout-wp", async (req, res, next) => {
  try {
    // const logoutPromise = new Promise((resolve, reject) => {
    //     client.logout().then(() => {
    //         resolve();
    //     }).catch((error) => {
    //         reject(error);
    //     });
    // });
    await client.logout();
    // Esperar a que el evento "disconnected" se active antes de enviar la respuesta
    // client.on('disconnected', (reason) => {
    //     conso
    // });
    client.info.wid.user = "";
    res.send("ok");
    // Esperar a que la promesa de cierre de sesión se resuelva o se rechace
    //await logoutPromise;
  } catch (error) {
    console.log(error);
    res.send({ msg: "Algo salió mal" });
  }
});

router.post("/wp-message", async (req, res, next) => {
  try {
    const { message, phoneNumber } = req.body;
    if (client.info.wid.user) {
      await client.sendMessage(phoneNumber + "@c.us", message);
      return res.status(201).send("ok");
    }
    res.send({ msg: "No hay sesión de whatsapp" });
  } catch (error) {
    console.log(error);
    res.send({ msg: "Algo salió mal" });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { message, type } = req.body;
    await sendNotification(message, null, type);
    return res.status(201).send("ok");
  } catch (error) {
    console.log(error);
    res.send({ msg: "Algo salió mal" });
  }
});

export default router;
