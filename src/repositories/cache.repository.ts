import { serverConfig } from "../config"
import { redisClient } from "../config/redis.config";

export class CacheRepository {
    async getNextId(): Promise<number> {
        const key = serverConfig.REDIS_COUNTER_KEY;

        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        return await redisClient.incr(key);
    }

    async setUrlMapping(shortUrl: string, originalUrl: string): Promise<void> {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        await redisClient.set(key, originalUrl, { EX: serverConfig.REDIS_URL_TTL_SECONDS });
    }

    async getUrlMapping(shortUrl: string): Promise<string | null> {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        return await redisClient.get(key);
    }

    async deleteUrlMapping(shortUrl: string): Promise<void> {
        const key = `url:${shortUrl}`;
        if(!redisClient.isOpen) {
            await redisClient.connect();
        }

        await redisClient.del(key);
    }
}