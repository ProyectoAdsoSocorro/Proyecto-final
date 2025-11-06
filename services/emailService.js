import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verificar la conexión del transporter al iniciar el servidor
transporter.verify((error, success) => {
    if (error) {
        console.error("Error al conectar con el servidor de correo:", error);
    } else {
        console.log("Servidor de correo listo para enviar mensajes");
    }
});