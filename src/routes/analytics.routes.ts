import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { verifyToken } from    '../middlewares/jwt';

const router = Router();

// All analytics routes require authentication
router.use(verifyToken);

// Get comprehensive analytics for the authenticated user
router.get('/user', AnalyticsController.getUserAnalytics);

// Get analytics for a specific URL
router.get('/url/:urlId', AnalyticsController.getUrlAnalytics);

// Get all URLs with analytics for the user
router.get('/urls', AnalyticsController.getUserUrlsWithAnalytics);

// Get click trends for the last 7 days
router.get('/trends', AnalyticsController.getClickTrends);

// Get recent activity for the last 30 days
router.get('/activity', AnalyticsController.getRecentActivity);

// Get platform statistics (admin only)
router.get('/platform', AnalyticsController.getPlatformStats);

export default router;
