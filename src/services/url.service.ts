import { serverConfig } from "../config";
import { CacheRepository } from "../repositories/cache.repository";
import { UrlRepository } from "../repositories/url.repository";
import { encodeBase62 } from "../utils/base62";
import { NotFoundError } from "../utils/errors/app.error";


export class UrlService {
    constructor(
        private readonly urlRepository: UrlRepository,
        private readonly cacheRepository: CacheRepository
    ) {}

    async createShortUrl(originalUrl: string) {
        const nextId = await this.cacheRepository.getNextId();
        const shortUrl = encodeBase62(nextId);

        const url = await this.urlRepository.create({ originalUrl, shortUrl });

        // caching the url mapping in redis
        await this.cacheRepository.setUrlMapping(shortUrl, originalUrl);

        const baseUrl = serverConfig.BASE_URL;
        const fullUrl =  `${baseUrl}/${shortUrl}`;

        return {
            id: url.id.toString(),
            originalUrl,
            shortUrl,
            fullUrl,
            clicks: url.clicks,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt
        };
    }

    async getOriginalUrl(shortUrl: string) {
        console.log("Short URL:", shortUrl);
        let originalUrl = await this.cacheRepository.getUrlMapping(shortUrl);
        console.log("Original URL from cache:", originalUrl);
        if (originalUrl) {
            await this.urlRepository.incrementClicks(shortUrl);

            return {
                originalUrl,
                shortUrl
            }
        }

        let url = await this.urlRepository.findByShortUrl(shortUrl);
        console.log("Original URL from DB:", url?.originalUrl);

        if (!url) {
            throw new NotFoundError('URL not found');
        }

        await this.urlRepository.incrementClicks(shortUrl);

        // caching the url mapping in redis
        await this.cacheRepository.setUrlMapping(shortUrl, url.originalUrl);

        return {
            originalUrl: url.originalUrl,
            shortUrl
        }
    }

    async incrementClicks(shortUrl: string) {
        await this.urlRepository.incrementClicks(shortUrl);
    }
}