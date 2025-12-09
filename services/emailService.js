//import pkg from 'jsonwebtoken';
//const { verify } = pkg;
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Error al conectar con el servidor de correo:", error);
    } else {
        console.log("Servidor de correo listo para enviar mensajes");
    }
});

const sendEmail = async (emailOptions) => {
    try {
        await transporter.sendMail(emailOptions);
    } catch (error) {
        console.error("Error desde emailService al enviar correo:", error);
        throw error;
    }
};
export const emailService = { sendEmail };
export {transporter};