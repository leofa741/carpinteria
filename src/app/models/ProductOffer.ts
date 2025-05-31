import mongoose, { Schema, Document } from 'mongoose';

export interface IProductOffer extends Document {
  title: string;
  price: number;
  description: string;
  image: string;  
  createdAt: Date;
  updatedAt: Date;
}

const ProductOfferSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, 
}, {
  timestamps: true,
});

export default mongoose.models.ProductOffer || 
       mongoose.model<IProductOffer>('ProductOffer', ProductOfferSchema);