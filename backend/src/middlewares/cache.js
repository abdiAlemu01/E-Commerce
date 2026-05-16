// Cache middleware - Redis removed for simplicity
// Can be re-enabled by installing Redis and uncommenting redis.js

export const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    // Cache disabled - pass through
    next();
  };
};
