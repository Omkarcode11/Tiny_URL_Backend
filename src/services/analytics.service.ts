import prisma from "../../db/connection";

export interface UrlAnalytics {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdAt: Date;
  lastClicked?: Date;
  performance: 'high' | 'medium' | 'low';
}

export interface UserAnalytics {
  totalUrls: number;
  totalClicks: number;
  averageClicksPerUrl: number;
  topPerformingUrls: UrlAnalytics[];
  recentActivity: {
    date: string;
    clicks: number;
  }[];
  clickTrends: {
    date: string;
    clicks: number;
  }[];
}

export interface VisitDetails {
  id: string;
  urlId: string;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
  url: {
    shortUrl: string;
    originalUrl: string;
  };
}

export class AnalyticsService {
  private static instance: AnalyticsService;

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Get comprehensive analytics for a user
  public async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const urls = await prisma.url.findMany({
      where: { userId: parseInt(userId) },
      include: {
        visit: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + (url.visit?.clickCount || 0), 0);
    const averageClicksPerUrl = totalUrls > 0 ? totalClicks / totalUrls : 0;

    // Get top performing URLs
    const topPerformingUrls = urls
      .map(url => ({
        id: url.id.toString(),
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        clickCount: url.visit?.clickCount || 0,
        createdAt: url.createdAt,
        lastClicked: url.visit?.updatedAt,
        performance: this.getPerformanceLevel(url.visit?.clickCount || 0),
      }))
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 10);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = await this.getClickActivityByDate(userId, thirtyDaysAgo);

    // Get click trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const clickTrends = await this.getClickTrends(userId, sevenDaysAgo);

    return {
      totalUrls,
      totalClicks,
      averageClicksPerUrl: Math.round(averageClicksPerUrl * 100) / 100,
      topPerformingUrls,
      recentActivity,
      clickTrends,
    };
  }

  // Get analytics for a specific URL
  public async getUrlAnalytics(urlId: string, userId: string): Promise<UrlAnalytics | null> {
    const url = await prisma.url.findFirst({
      where: {
        id: parseInt(urlId),
        userId: parseInt(userId),
      },
      include: {
        visit: true,
      },
    });

    if (!url) return null;

    return {
      id: url.id.toString(),
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      clickCount: url.visit?.clickCount || 0,
      createdAt: url.createdAt,
      lastClicked: url.visit?.updatedAt,
      performance: this.getPerformanceLevel(url.visit?.clickCount || 0),
    };
  }

  // Get all URLs with analytics for a user
  public async getUserUrlsWithAnalytics(userId: string): Promise<UrlAnalytics[]> {
    const urls = await prisma.url.findMany({
      where: { userId: parseInt(userId) },
      include: {
        visit: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return urls.map(url => ({
      id: url.id.toString(),
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      clickCount: url.visit?.clickCount || 0,
      createdAt: url.createdAt,
      lastClicked: url.visit?.updatedAt,
      performance: this.getPerformanceLevel(url.visit?.clickCount || 0),
    }));
  }

  // Get click activity by date range
  private async getClickActivityByDate(userId: string, startDate: Date): Promise<{ date: string; clicks: number }[]> {
    const urls = await prisma.url.findMany({
      where: { userId: parseInt(userId) },
      include: { visit: true },
    });

    const activityMap = new Map<string, number>();
    
    // Initialize last 30 days with 0 clicks
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (dateStr) {
        activityMap.set(dateStr, 0);
      }
    }

    // Add actual click data (simplified - in real app you'd track individual clicks)
    urls.forEach(url => {
      if (url.visit && url.visit.clickCount > 0) {
        const dateStr = url.visit.updatedAt.toISOString().split('T')[0];
        if (dateStr) {
          const current = activityMap.get(dateStr) || 0;
          activityMap.set(dateStr, current + url.visit.clickCount);
        }
      }
    });

    return Array.from(activityMap.entries())
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Get click trends for the last 7 days
  private async getClickTrends(userId: string, startDate: Date): Promise<{ date: string; clicks: number }[]> {
    const urls = await prisma.url.findMany({
      where: { userId: parseInt(userId) },
      include: { visit: true },
    });

    const trendsMap = new Map<string, number>();
    
    // Initialize last 7 days with 0 clicks
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (dateStr) {
        trendsMap.set(dateStr, 0);
      }
    }

    // Add actual click data
    urls.forEach(url => {
      if (url.visit && url.visit.clickCount > 0) {
        const dateStr = url.visit.updatedAt.toISOString().split('T')[0];
        if (dateStr) {
          const current = trendsMap.get(dateStr) || 0;
          trendsMap.set(dateStr, current + url.visit.clickCount);
        }
      }
    });

    return Array.from(trendsMap.entries())
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Get performance level based on click count
  private getPerformanceLevel(clickCount: number): 'high' | 'medium' | 'low' {
    if (clickCount >= 100) return 'high';
    if (clickCount >= 10) return 'medium';
    return 'low';
  }

  // Get overall platform statistics (admin only)
  public async getPlatformStats(): Promise<{
    totalUsers: number;
    totalUrls: number;
    totalClicks: number;
    averageClicksPerUrl: number;
  }> {
    const totalUsers = await prisma.user.count();
    const totalUrls = await prisma.url.count();
    const totalClicks = await prisma.visit.aggregate({
      _sum: { clickCount: true },
    });

    const totalClicksValue = totalClicks._sum.clickCount || 0;
    const averageClicksPerUrl = totalUrls > 0 ? totalClicksValue / totalUrls : 0;

    return {
      totalUsers,
      totalUrls,
      totalClicks: totalClicksValue,
      averageClicksPerUrl: Math.round(averageClicksPerUrl * 100) / 100,
    };
  }
}
