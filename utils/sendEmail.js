import { emailService } from "../services/emailService.js";

export const sendEmail = async (to, subject, html, from = process.env.EMAIL_USER) => {
  try {
    const emailOptions = {
        from,
        subject,
        html,
        to
    };

    await emailService.sendEmail(emailOptions);
    console.log(`Correo enviado exitoso a: ${to}`);
    
  } catch (error) {
    console.error(`Error al enviar correo a ${to}:`, error);
    throw new Error ('Error al enviar el correo electrónico'); ;
  }
}
    