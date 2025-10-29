import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;
  
  // Get real IP address
  const realIp = req.ip || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection as any)?.socket?.remoteAddress ||
    'unknown';

  // Log request start
  logger.info('Request started', {
    method,
    url,
    ip: realIp,
    userAgent: headers['user-agent'] || 'Unknown',
    timestamp: new Date().toISOString()
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - start;
    
    // Log response
    logger.info('Request completed', {
      method,
      url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: realIp,
      timestamp: new Date().toISOString()
    });

    // Call original json method
    return originalJson.call(this, body);
  };

  // Override res.end to catch non-JSON responses
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    // Only log if json hasn't been called (to avoid double logging)
    if (!res.headersSent || res.get('content-type')?.includes('application/json')) {
      logger.info('Request completed', {
        method,
        url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: realIp,
        timestamp: new Date().toISOString()
      });
    }

    return originalEnd.call(this, chunk, encoding);
  };

  next();
};