import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, phone, asunto, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son obligatorios.' },
        { status: 400 }
      );
    }

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY,
      },
    });

    // Opciones del correo
    const mailOptions = {
      from: `"Contacto web" <${process.env.MAILER_EMAIL}>`,
      to: process.env.MAILER_EMAIL, // Cambiar si quieres que los correos lleguen a otro email
      subject: `Nuevo mensaje de ${name}`,
      html: `
        <h3>Nuevo mensaje desde el formulario de contacto:</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
         <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Correo enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json(
      { success: false, message: 'Error al enviar el correo. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
// en la seguridad de cuenta de gmail activar dos pasos y crear la contraseña de aplicaciones y crear las variables en .env