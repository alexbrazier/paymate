import httpStatus from 'http-status';

class APIError extends Error {
  public status: number;
  public isPublic: boolean;
  public isOperational: boolean;
  public constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false
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
