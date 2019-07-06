import { Request, Response, NextFunction } from 'express';
interface CustomRequest extends Request {
  user: {
    email: string;
  };
}

export {
  CustomRequest as IRequest,
  Response as IResponse,
  NextFunction as INextFunction,
};
