import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import APIError from '../helpers/APIError';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function verify(email, password, cb) {
      const user = await User.findOne({ email }).select('email password');

      if (!user) {
        return cb(new APIError('Incorrect username or password.', 401, true));
      }

      const passwordMatch = await (user as any).comparePassword(password);

      if (!passwordMatch) {
        return cb(new APIError('Incorrect username or password.', 401, true));
      }

      return cb(null, {
        id: user.id,
        email: user.email,
      });
    }
  )
);
