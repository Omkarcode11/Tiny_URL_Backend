import { UrlService } from "../services/url.service";

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const LENGTH = 6;

export function generateShortUrl(): string {
    let result = '';
    for (let i = 0; i < LENGTH; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
}

export async function generateUniqueShortUrl(): Promise<string> {
    const urlService = UrlService.getInstance();
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
        const shortUrl = generateShortUrl();
        
            // Check if shortUrl already exists
            const url = await urlService.getUrlByShortUrl(shortUrl);
            if (url) {
                attempts++;
                continue;
            }
        // ir not found then return shortUrlCode
        return shortUrl;
    }
    
    // If we can't find a unique one after max attempts, add timestamp
    return generateShortUrl() + Date.now().toString(36).slice(-2);
}
