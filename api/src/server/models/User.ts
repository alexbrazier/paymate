import { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { model } from '../../config/db';

export interface IUser {
  name: string;
  permalink: string;
  email?: string;
  password?: string;
  providers: {
    provider: string;
    permalink?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    permalink: { type: String, lowercase: true, trim: true, unique: true },
    email: {
      type: String,
      select: false,
      lowercase: true,
      trim: true,
      index: {
        unique: true,
        partialFilterExpression: { email: { $exists: true } },
      },
    },
    password: { type: String, select: false },
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

const SALT_WORK_FACTOR = 11;

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user: any = this;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, (this as any).password);
};

const User = model<IUserModel>('User', UserSchema);

export default User;
