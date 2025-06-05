import mongoose, { Schema, model, models } from 'mongoose';

const TrabajoSchema = new Schema({
  titulo: { type: String, required: false },
  descripcion: { type: String, required: false },
  categoria: { type: String, required: false },
  imagenes: { type: [String], required: false },
}, { timestamps: true });

const Trabajo = models.Trabajo || model('Trabajo', TrabajoSchema);
export default Trabajo;
