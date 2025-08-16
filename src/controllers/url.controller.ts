import { UrlService } from "../services/url.service";
import { Request, Response } from "express";
import { createUrlSchema } from "../schemas/url.schema";

interface AuthenticatedRequest extends Request {
    user?: { userId: string };
}

export class UrlController {
    private static instance: UrlController;
    private urlService: UrlService;

    private constructor() {
        this.urlService = UrlService.getInstance();
    }

    public static getInstance(): UrlController {
        if (!UrlController.instance) {
            UrlController.instance = new UrlController();
        }
        return UrlController.instance;
    }

    public async createUrl(req: AuthenticatedRequest, res: Response) {
        try {
            const { originalUrl, shortUrl } = createUrlSchema.parse(req.body);
            const url = await this.urlService.createUrl({
                originalUrl,
                shortUrl,
                userId: req.user!.userId,
            });
            res.status(201).json(url);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public async getUrl(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const url = await this.urlService.getUrl(id);
            res.status(200).json(url);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public async updateUrl(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { originalUrl, shortUrl } = createUrlSchema.parse(req.body);
            const url = await this.urlService.updateUrl({ id, originalUrl, shortUrl });
            res.status(200).json(url);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}   