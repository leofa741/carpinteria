// api/mercadopago/create-preference/route.ts

import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

// Crear una instancia del cliente de MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!, // usa tu token real aquí o variable de entorno
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validación básica
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron productos.' }, { status: 400 });
    }

    // Crear una nueva preferencia
    const preference = new Preference(client);

    // Crear los datos de la preferencia
    const preferenceData = {
      body: {
        items: body.items, // Los items son un array de productos
        back_urls: {
          success: 'https://tusitio.com/success',
          failure: 'https://tusitio.com/failure',
          pending: 'https://tusitio.com/pending',
        },
        auto_return: 'approved', // Regresar automáticamente al sitio después de la compra
      },
    };

    // Crear la preferencia con los datos de preferencia
    const response = await preference.create(preferenceData);

    // Retornar la respuesta con el ID de la preferencia y el enlace de pago
    return NextResponse.json({ id: response.id, init_point: response.init_point });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    return NextResponse.json({ error: 'Error creando preferencia' }, { status: 500 });
  }
}
