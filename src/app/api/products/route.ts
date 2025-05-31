
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';
import cloudinary from 'cloudinary';
import connectDB from '@/app/lib/mongoose';
import Product from '@/app/models/Product';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// 🔧 Convertir ReadableStream (Web) a IncomingMessage (Node)
async function streamToIncomingMessage(req: NextRequest): Promise<IncomingMessage> {
  const { body, headers } = req;
  const stream = Readable.fromWeb(body as any) as unknown as IncomingMessage;
  stream.headers = Object.fromEntries(headers.entries());
  return stream;
}

// 📥 Parsear formulario
async function parseForm(req: NextRequest): Promise<{ fields: any; files: any }> {
  const form = formidable({ keepExtensions: true });

  const incomingReq = await streamToIncomingMessage(req);

  return new Promise((resolve, reject) => {
    form.parse(incomingReq, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

// 🧠 POST Handler
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { fields, files } = await parseForm(req);

    const name = fields.name?.[0] || fields.name;
    const description = fields.description?.[0] || fields.description;
    const price = parseFloat(fields.price?.[0] || fields.price);
    const stock = parseInt(fields.stock?.[0] || fields.stock);
    const category = fields.category?.[0] || fields.category;
    const imageFile = files.image?.[0] || files.image;

    if (!name || !description || !category || !price || !imageFile || isNaN(stock)) {
      return NextResponse.json({ message: 'Faltan campos obligatorios o imagen' }, { status: 400 });
    }

    // 📤 Subir imagen a Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(imageFile.filepath, {
      folder: 'products',
    });

    // 📝 Crear producto en MongoDB
    const product = await Product.create({
      name,
      description,
      price, // ✅ Se guarda como string, ej: "39.000"
      stock,
      category,
      image: uploadResult.secure_url,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  await connectDB();

  const id = req.nextUrl.searchParams.get('id');
  const limit = req.nextUrl.searchParams.get('limit'); // 👈 agregamos limit

  try {
    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
      }
      return NextResponse.json(product, { status: 200 });
    } else {
      const query = Product.find();

      if (limit) {
        query.limit(parseInt(limit)); // 👈 aplicar límite si viene
      }

      query.sort({ createdAt: -1 }); // 👈 opcional: ordenar por más reciente

      const products = await query.exec();
      return NextResponse.json(products, { status: 200 });
    }
  } catch (err: any) {
    console.error('Error:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    await connectDB();
  
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    if (!id) {
      return NextResponse.json({ error: 'ID de producto no especificado' }, { status: 400 });
    }
  
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Producto eliminado' }, { status: 200 });
    } catch (error: any) {
      console.error('Error en DELETE:', error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID de producto no especificado' }, { status: 400 });
  }

  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const rawPrice = (formData.get('price') as string || '').replace(/[^0-9.]/g, '');
    const price = parseFloat(rawPrice);
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string;

    // ✅ Aquí se obtiene el campo del descuento
    const cashDiscountEnabledRaw = formData.get('cashDiscountEnabled');
    const cashDiscountEnabled = cashDiscountEnabledRaw === 'true' || cashDiscountEnabledRaw === 'on';

    const updateData: any = {
      name,
      description,
      price,
      stock,
      category,
      cashDiscountEnabled, // ✅ lo agregamos al objeto de actualización
    };

    if (!name || !description || !category || isNaN(price) || isNaN(stock)) {
      return NextResponse.json({ message: 'Faltan campos obligatorios o datos inválidos' }, { status: 400 });
    }

    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const imageUrl = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream({ folder: 'products' }, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        });

        const bufferStream = new (require('stream').PassThrough)();
        bufferStream.end(buffer);
        bufferStream.pipe(stream);
      });

      updateData.image = imageUrl;
    }

    await Product.findByIdAndUpdate(id, updateData);

    return NextResponse.json({
      message: imageFile ? 'Producto actualizado con imagen' : 'Producto actualizado sin imagen',
    });
  } catch (error: any) {
    console.error('Error en PUT:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID de producto no especificado' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { cashDiscountEnabled } = body;

    if (typeof cashDiscountEnabled !== 'boolean') {
      return NextResponse.json({ error: 'Valor inválido para cashDiscountEnabled' }, { status: 400 });
    }

    await Product.findByIdAndUpdate(id, { cashDiscountEnabled });

    return NextResponse.json({ message: 'Descuento actualizado correctamente' });
  } catch (error: any) {
    console.error('Error en PATCH:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
