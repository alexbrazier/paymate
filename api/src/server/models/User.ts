import { Schema, Document } from 'mongoose';
import { model } from '../../config/db';

export interface IUser {
  name: string;
  permalink: string;
  email?: string;
  providers: {
    provider: string;
    permalink?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema(
  {
    name: { type: String },
    permalink: { type: String },
    email: {
      type: String,
      select: false,
      index: {
        unique: true,
        partialFilterExpression: { email: { $exists: true } },
      },
    },
    providers: {
      type: [
        {
          provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
          permalink: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

const User = model<IUserModel>('User', UserSchema);

export default User;
