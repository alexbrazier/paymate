import { Schema, Document } from 'mongoose';
import { model } from '../config/db';
export interface IProvider {
  name: string;
  icon: string;
  url: string;
  urlAmount: string;
}

export interface IProviderModel extends IProvider, Document {}

const ProviderSchema = new Schema(
  {
    name: { type: String },
    icon: { type: String },
    url: { type: String },
    urlAmount: { type: String },
  },
  { timestamps: false }
);

const Provider = model<IProviderModel>('Provider', ProviderSchema);

export default Provider;
