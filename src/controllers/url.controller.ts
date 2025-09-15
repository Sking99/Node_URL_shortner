import { z } from "zod";
import { CacheRepository } from "../repositories/cache.repository";
import { UrlRepository } from "../repositories/url.repository";
import { publicProcedure } from "../routers/trpc/context";
import { UrlService } from "../services/url.service";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";

const urlService = new UrlService(new UrlRepository(), new CacheRepository());

export const urlController = {
    create: publicProcedure
    .input(
        z.object({
            originalUrl: z.string().url("Invalid URL")
        })
    )
    .mutation(async ({ input }) => {
        try {
            return await urlService.createShortUrl(input.originalUrl);
        } catch (error) {
            logger.error('Error creating short URL', error);
            throw new InternalServerError('Failed to create short URL');
        }
    }),
    
    getOriginalUrl: publicProcedure
    .input(
        z.object({
            shortUrl: z.string().min(1, "Short URL is required")
        })
    )
    .query(async ({ input }) => {
        try {
            return await urlService.getOriginalUrl(input.shortUrl);
        } catch (error) {
            logger.error('Error getting original URL', error);
            throw new InternalServerError('Failed to get original URL');
        }
    }),

    incrementClicks: publicProcedure
    .input(
        z.object({
            shortUrl: z.string().min(1, "Short URL is required")
        })
    )
    .mutation(async ({ input }) => {
        try {
            return await urlService.incrementClicks(input.shortUrl);
        } catch (error) {
            logger.error('Error incrementing clicks', error);
            throw new InternalServerError('Failed to increment clicks');
        }
    }
    )
}