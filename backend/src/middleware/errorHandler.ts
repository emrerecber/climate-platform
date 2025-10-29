import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.status = statusCode < 500 ? 'fail' : 'error';
  error.isOperational = true;
  return error;
};

const handleCastErrorDB = (error: any): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return createError(message, 400);
};

const handleDuplicateFieldsDB = (error: any): AppError => {
  const value = error.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return createError(message, 400);
};

const handleValidationErrorDB = (error: any): AppError => {
  const errors = Object.values(error.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return createError(message, 400);
};

const handleJWTError = (): AppError =>
  createError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError =>
  createError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      status: err.status,
      message: err.message,
      timestamp: new Date().toISOString()
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    logger.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went very wrong!',
      timestamp: new Date().toISOString()
    });
  }
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Async error handler wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};