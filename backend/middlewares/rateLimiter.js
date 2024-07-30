import { client } from "../redis/index.js";
export const rateLimiter =
  (route, limit, duration) => async (req, res, next) => {
    try {
      const clientIp =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const key = `ratelimit:${clientIp}_${route}`;
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, duration);
      }
      const remaining = await client.ttl(key);

      if (count > limit) {
        return res.status(429).json({
          message: `Too many requests. Please try again after ${remaining} seconds.`,
        });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.log("Error in rateLimiter: ", err.message);
    }
  };
