import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../server/models/User';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function verify(email, password, cb) {
      const user = await User.findOne({ email }).select('email password');

      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      const passwordMatch = await (user as any).comparePassword(password);

      if (!passwordMatch) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }

      return cb(null, {
        id: user.id,
        email: user.email,
      });
    }
  )
);
