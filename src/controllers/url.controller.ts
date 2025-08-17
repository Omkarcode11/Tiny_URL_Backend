import { UrlService } from "../services/url.service";
import { Response } from "express";
import { createUrlSchema } from "../schemas/url.schema";
import { generateUniqueShortUrl } from "../utils/shorturl.utils";
import { AuthenticatedRequest } from "../types/express.types";
import logger from "../lib/logger";

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
      const { originalUrl } = createUrlSchema.parse(req.body);
      const shortUrl = await generateUniqueShortUrl();
      const userId = req.user?.id;
      
      if (!userId) {
        logger.warn('Unauthorized access attempt to createUrl');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Creating URL for user: ${userId}, originalUrl: ${originalUrl}`);
      const url = await this.urlService.createUrl({
        originalUrl,
        shortUrl,
        userId,
      });
      
      logger.info(`URL created successfully: ${shortUrl} for user: ${userId}`);
      res.status(201).json(url);
    } catch (error: any) {
      logger.error('Error creating URL:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id,
        originalUrl: req.body.originalUrl 
      });
      res.status(400).json({ error: error.message });
    }
  }

  public async getUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logger.warn('Missing URL ID parameter');
        res.status(400).json({ error: 'URL ID is required' });
        return;
      }
      
      logger.info(`Fetching URL with ID: ${id}`);
      
      const url = await this.urlService.getUrl(id as string);
      logger.info(`URL fetched successfully: ${id}`);
      res.status(200).json(url);
    } catch (error: any) {
      logger.error('Error fetching URL:', { 
        error: error.message, 
        stack: error.stack,
        urlId: req.params.id 
      });
      res.status(400).json({ error: error.message });
    }
  }

  public async updateUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        logger.warn('Missing URL ID parameter');
        res.status(400).json({ error: 'URL ID is required' });
        return;
      }
      
      const { originalUrl } = createUrlSchema.parse(req.body);
      const shortUrl = await generateUniqueShortUrl();
      
      logger.info(`Updating URL: ${id}, new originalUrl: ${originalUrl}`);
      
      const url = await this.urlService.updateUrl({
        id: id as string,
        originalUrl,
        shortUrl,
      });
      
      logger.info(`URL updated successfully: ${id}`);
      res.status(200).json(url);
    } catch (error: any) {
      logger.error('Error updating URL:', { 
        error: error.message, 
        stack: error.stack,
        urlId: req.params.id,
        originalUrl: req.body.originalUrl 
      });
      res.status(400).json({ error: error.message });
    }
  }

  public async redirectToOriginalUrl(req: AuthenticatedRequest, res: Response) {
    try {
      const { shortUrl } = req.params;
      
      if (!shortUrl) {
        logger.warn('Missing short URL parameter');
        res.status(400).json({ error: 'Short URL is required' });
        return;
      }
      
      logger.info(`Redirect request for short URL: ${shortUrl}, IP: ${req.ip}`);
      
      const url = await this.urlService.getUrl(shortUrl as string);
      await this.urlService.incrementClickCount(parseInt(url.id));
      
      logger.info(`Redirect successful: ${shortUrl} -> ${url.originalUrl}, click count incremented`);
      res.redirect(url.originalUrl);
    } catch (error: any) {
      logger.error('Error redirecting URL:', { 
        error: error.message, 
        stack: error.stack,
        shortUrl: req.params.shortUrl,
        ip: req.ip 
      });
      res.status(400).json({ error: error.message });
    }
  }

  public async getAllUrls(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        logger.warn('Unauthorized access attempt to getAllUrls');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Fetching all URLs for user: ${userId}`);
      const urls = await this.urlService.getAllUrls(userId);
      
      if (!urls) {
        logger.warn(`No URLs found for user: ${userId}`);
        res.status(404).json({ error: "No URLs found" });
        return;
      }
      
      logger.info(`URLs fetched successfully for user: ${userId}, count: ${urls.length}`);
      res.status(200).json(urls);
    } catch (error: any) {
      logger.error('Error fetching all URLs:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id 
      });
      res.status(400).json({ error: error.message });
    }
  }
}
