
import connectDB from "@/app/lib/mongoose";
import Product from "@/app/models/Product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import User from "@/app/models/User";

// Interfaz para evitar "any"
interface ProductRating {
  userId: string;
  rating: number;
}

export async function PUT(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const body = await req.json();
  const { rating }: { rating: number } = body;

  if (!id || !rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Faltan datos o el rating no es válido" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user || !user._id) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Inicializar ratedBy si no existe
    if (!Array.isArray(product.ratedBy)) {
      product.ratedBy = [];
    }

    // Buscar si el usuario ya calificó
    const existingRatingIndex = product.ratedBy.findIndex(
      (r: ProductRating) => r.userId === user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Actualizar rating existente
      product.ratedBy[existingRatingIndex].rating = rating;
    } else {
      // Agregar nuevo rating
      product.ratedBy.push({
        userId: user._id.toString(),
        rating,
      });
    }

    // Recalcular el rating promedio
    const ratings = product.ratedBy.map((r: ProductRating) => r.rating);
    const average = ratings.reduce((a: any, b: any) => a + b, 0) / ratings.length;
    product.rating = parseFloat(average.toFixed(1)); // Redondear a 1 decimal
    product.reviews = ratings.length;

    await product.save();

    return NextResponse.json(
      { message: "Calificación actualizada", product },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al actualizar el producto:", error);

    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: "Error al actualizar el producto", details: errorMessage },
      { status: 500 }
    );
  }
}
