import { Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AuthenticatedRequest } from '../types/express.types';
import logger from '../lib/logger';

export class AnalyticsController {
  private static analyticsService = AnalyticsService.getInstance();

  // Get user analytics
  public static async getUserAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn('Unauthorized access attempt to getUserAnalytics');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Fetching analytics for user: ${userId}`);
      const analytics = await AnalyticsController.analyticsService.getUserAnalytics(userId);
      logger.info(`Analytics fetched successfully for user: ${userId}`);
      res.json(analytics);
    } catch (error: any) {
      logger.error('Error getting user analytics:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id 
      });
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  }

  // Get analytics for a specific URL
  public static async getUrlAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { urlId } = req.params;

      if (!userId) {
        logger.warn('Unauthorized access attempt to getUrlAnalytics');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!urlId) {
        logger.warn('Missing URL ID in getUrlAnalytics request');
        res.status(400).json({ error: 'URL ID is required' });
        return;
      }

      logger.info(`Fetching analytics for URL: ${urlId}, user: ${userId}`);
      const analytics = await AnalyticsController.analyticsService.getUrlAnalytics(urlId, userId);
      
      if (!analytics) {
        logger.warn(`URL not found: ${urlId} for user: ${userId}`);
        res.status(404).json({ error: 'URL not found' });
        return;
      }

      logger.info(`URL analytics fetched successfully: ${urlId}`);
      res.json(analytics);
    } catch (error: any) {
      logger.error('Error getting URL analytics:', { 
        error: error.message, 
        stack: error.stack,
        urlId: req.params.urlId,
        userId: req.user?.id 
      });
      res.status(500).json({ error: 'Failed to get URL analytics' });
    }
  }

  // Get all URLs with analytics for a user
  public static async getUserUrlsWithAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn('Unauthorized access attempt to getUserUrlsWithAnalytics');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Fetching URLs with analytics for user: ${userId}`);
      const urls = await AnalyticsController.analyticsService.getUserUrlsWithAnalytics(userId);
      logger.info(`URLs with analytics fetched successfully for user: ${userId}, count: ${urls.length}`);
      res.json(urls);
    } catch (error: any) {
      logger.error('Error getting URLs with analytics:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id 
      });
      res.status(500).json({ error: 'Failed to get URLs with analytics' });
    }
  }

  // Get platform statistics (admin only)
  public static async getPlatformStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn('Unauthorized access attempt to getPlatformStats');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Fetching platform stats by user: ${userId}`);
      const stats = await AnalyticsController.analyticsService.getPlatformStats();
      logger.info('Platform stats fetched successfully');
      res.json(stats);
    } catch (error: any) {
      logger.error('Error getting platform stats:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id 
      });
      res.status(500).json({ error: 'Failed to get platform statistics' });
    }
  }

  // Get click trends for a user
  public static async getClickTrends(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn('Unauthorized access attempt to getClickTrends');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Fetching click trends for user: ${userId}`);
      // Get trends for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const trends = await AnalyticsController.analyticsService['getClickTrends'](userId, sevenDaysAgo);
      logger.info(`Click trends fetched successfully for user: ${userId}`);
      res.json(trends);
    } catch (error: any) {
      logger.error('Error getting click trends:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id 
      });
      res.status(500).json({ error: 'Failed to get click trends' });
    }
  }

  // Get recent activity for a user
  public static async getRecentActivity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn('Unauthorized access attempt to getRecentActivity');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info(`Fetching recent activity for user: ${userId}`);
      // Get activity for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const activity = await AnalyticsController.analyticsService['getClickActivityByDate'](userId, thirtyDaysAgo);
      logger.info(`Recent activity fetched successfully for user: ${userId}`);
      res.json(activity);
    } catch (error: any) {
      logger.error('Error getting recent activity:', { 
        error: error.message, 
        stack: error.stack,
        userId: req.user?.id 
      });
      res.status(500).json({ error: 'Failed to get recent activity' });
    }
  }
}
