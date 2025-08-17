import { generateUniqueShortUrl } from "../utils/shorturl.utils";

export class ShortUrlService {

    private static instance: ShortUrlService;

    public static getInstance(): ShortUrlService {
        if (!ShortUrlService.instance) {
            ShortUrlService.instance = new ShortUrlService();
        }
        return ShortUrlService.instance;
    }

    public async generateShortUrl(): Promise<string> {
        return await generateUniqueShortUrl();
    }
}