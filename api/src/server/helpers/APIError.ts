import httpStatus from 'http-status';

class APIError extends Error {
  status: number;
  isPublic: boolean;
  isOperational: boolean;
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
  }
}

export default APIError;
