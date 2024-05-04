import wp from "whatsapp-web.js";
const { Client, LocalAuth } = wp;
import QR from "qr-image";
export const client = new Client({
	puppeteer: {
		args: ["--no-sandbox"],
	},
	authStrategy: new LocalAuth(),
});

export async function getQRHtmlString(res) {
	let svg_string = "";
	client.on("qr", (qr) => {
		// console.log('QR RECEIVED', qr);
		// QR.image(qr, { type: 'png' }).pipe(require('fs').createWriteStream('qr.png'));
		svg_string = QR.imageSync(qr, { type: "svg" });
		res.send(svg_string);
	});
	return svg_string;
}


// client.on('message', message => {
//     console.log(message.body)
//    // console.log(client.getFormattedNumber(message.from) )
//     console.log(client.info.wid.user);

//     //message.reply('pong');
// 	// if(message.body.includes('problema')){
// 	// 	client.sendMessage(message.from, 'tranquilo, soy programador');
// 	// }
// });
try {
	client.on("ready", () => {
		console.log("Client is ready!");
		client.sendMessage(
			client.info.wid.user + "@c.us",
			"Ya tienes whatsapp asociado para enviar notificaciones"
		);
	});

	client.initialize();
} catch (e) {
	console.warn("wp error", e);
}
