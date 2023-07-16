import { Schema, Document } from 'mongoose';
import { model } from '../config/db';
export interface IProvider {
  name: string;
  icon: string;
  url: string;
  urlAmount: string;
  public: boolean;
}

export interface IProviderModel extends IProvider, Document {}

const ProviderSchema = new Schema<IProvider>(
  {
    name: { type: String },
    icon: { type: String },
    url: { type: String },
    urlAmount: { type: String },
    public: { type: Boolean },
  },
  { timestamps: false }
);

const Provider = model<IProviderModel>('Provider', ProviderSchema);

export default Provider;
