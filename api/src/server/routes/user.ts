import express from 'express';
import expressJwt from 'express-jwt';
import validate from 'express-validation';
import * as userCtrl from '../controllers/user';
import config from '../../config/env';
import asyncMiddleware from '../middleware/async';
import userValidation from '../validation/user';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    asyncMiddleware(userCtrl.getUser)
  )
  .post(
    expressJwt({ secret: config.jwtSecret }),
    validate(userValidation.setUserDetails),
    asyncMiddleware(userCtrl.setUserDetails)
  );
router
  .route('/available-providers')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    asyncMiddleware(userCtrl.getAvailableProviders)
  );
router
  .route('/provider/:provider')
  .get(
    expressJwt({ secret: config.jwtSecret }),
    asyncMiddleware(userCtrl.getProvider)
  )
  .delete(
    expressJwt({ secret: config.jwtSecret }),
    asyncMiddleware(userCtrl.removeProvider)
  )
  .post(
    expressJwt({ secret: config.jwtSecret }),
    asyncMiddleware(userCtrl.addProvider)
  )
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(userValidation.saveProvider),
    asyncMiddleware(userCtrl.saveProvider)
  );
router
  .route('/provider/:provider/order')
  .put(
    expressJwt({ secret: config.jwtSecret }),
    validate(userValidation.updateOrder),
    asyncMiddleware(userCtrl.updateProviderOrder)
  );
router.route('/:permalink').get(asyncMiddleware(userCtrl.getProviders));

export default router;
