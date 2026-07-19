import mongoose, { Schema, Document } from 'mongoose';

export interface IPaso {
  orden: number;
  titulo: string;
  descripcion: string;
  mediaUrl: string;
  tipoMedia: 'video' | 'imagen';
}

export interface IProcesoTrabajo extends Document {
  tituloProyecto: string;
  descripcionGeneral: string;
  clienteOtipo?: string;
  pasos: IPaso[];
  destacado: boolean;
  createdAt: Date;
}

const PasoSchema = new Schema<IPaso>({
  orden: { type: Number, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  tipoMedia: { type: String, enum: ['video', 'imagen'], required: true },
});

const ProcesoTrabajoSchema = new Schema<IProcesoTrabajo>(
  {
    tituloProyecto: { type: String, required: true },
    descripcionGeneral: { type: String, required: true },
    clienteOtipo: { type: String },
    pasos: { type: [PasoSchema], required: true, min: [1, 'Debe tener al menos un paso'] },
    destacado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ProcesoTrabajo || mongoose.model<IProcesoTrabajo>('ProcesoTrabajo', ProcesoTrabajoSchema);