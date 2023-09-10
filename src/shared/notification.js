import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { client } from "./whatsapp.js";

export async function sendNotification(message, redirect, type) {
  const admin = await User.findOne({
    where: {
      role: "admin",
    },
  });
  const phoneNumber = admin?.phoneNumber;
  if (client.info?.wid.user && phoneNumber) {
    await client.sendMessage(phoneNumber + "@c.us", message);
  }

  await Notification.create({
    message,
    type,
    redirect, //url
  });
}
