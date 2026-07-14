import mongoose, { Schema, Document } from 'mongoose';

export interface IMaderaProceso extends Document {
  nombreMadera: string; // Ej: "Ciprés", "Coihue", "Roble"
  tituloProceso: string; // Ej: "Proceso de Secado y Cepillado"
  descripcion: string;
  videoUrl: string; // URL del video en Cloudinary
  thumbnailUrl: string; // Imagen de portada del video
  especificaciones: {
    densidad: string; // Ej: "Media (450 kg/m³)"
    usoRecomendado: string; // Ej: "Interiores, Revestimientos, Mobiliario"
    acabado: string; // Ej: "Aceite natural o Laqueado mate"
  };
  destacado: boolean;
  createdAt: Date;
}

const MaderaProcesoSchema = new Schema<IMaderaProceso>(
  {
    nombreMadera: { type: String, required: true },
    tituloProceso: { type: String, required: true },
    descripcion: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    especificaciones: {
      densidad: { type: String, default: "Consultar" },
      usoRecomendado: { type: String, default: "Consultar" },
      acabado: { type: String, default: "Consultar" },
    },
    destacado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Evita recompilar el modelo si ya existe (común en Next.js dev)
export default mongoose.models.MaderaProceso || mongoose.model<IMaderaProceso>('MaderaProceso', MaderaProcesoSchema);