import prisma from "../../db/connection";
import { CreateUrlInput, CreateUrlResponse, UpdateUrlInput, UrlResponse } from "./url.types";

export class UrlService {
  private static instance: UrlService;

  public static getInstance(): UrlService {
    if (!UrlService.instance) {
      UrlService.instance = new UrlService();
    }
    return UrlService.instance;
  }

  public async createUrl(url: CreateUrlInput): Promise<CreateUrlResponse> {
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        userId: parseInt(url.userId),
      },
    });

    const visit = await prisma.visit.create({
      data: {
        urlId: newUrl.id,
        clickCount: 0,
      },
    });

    return {
      id: newUrl.id.toString(),
      originalUrl: newUrl.originalUrl,
      shortUrl: newUrl.shortUrl,
      userId: newUrl.userId.toString(),
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
      clickCount: visit.clickCount,
    };
  }

  public async getUrl(shortUrl: string): Promise<UrlResponse> {
    const url = await prisma.url.findUnique({
      where: {
        shortUrl: shortUrl,
      },
    });

    if (!url) {
      throw new Error("Url not found");
    }

    const visit = await prisma.visit.findUnique({
      where: {
        urlId: url.id,
      },
    });

    return {
      id: url.id.toString(),
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      userId: url.userId.toString(),
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      clickCount: visit?.clickCount || 0,
    };
  }

  public async updateUrl(urlRequest: UpdateUrlInput): Promise<UrlResponse> {
    const updatedUrl = await prisma.url.update({
      where: {
        id: parseInt(urlRequest.id),
      },
      data: {
        originalUrl: urlRequest.originalUrl,
        shortUrl: urlRequest.shortUrl,
      },
    });

    const visit = await prisma.visit.update({
      where: {
        urlId: parseInt(urlRequest.id),
      },
      data: {
        clickCount: 0,
      },
    });

    return {
      id: updatedUrl.id.toString(),
      originalUrl: updatedUrl.originalUrl,
      shortUrl: updatedUrl.shortUrl,
      userId: updatedUrl.userId.toString(),
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt,
      clickCount: visit?.clickCount || 0,
    };
  }
}
