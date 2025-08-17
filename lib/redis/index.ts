import { createClient, RedisClientType } from "redis";

class RedisService {
  private client: RedisClientType | null = null;
  private memoryStore: Map<string, string> = new Map();
  private useMemory = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL!,
        username: process.env.REDIS_USERNAME!,
        password: process.env.REDIS_PASSWORD!,
        socket: {
          host: process.env.REDIS_HOST!,
          port: Number(process.env.REDIS_PORT!),
        },
      });

      this.client.on("error", (err) => {
        console.error("Redis connection error:", err);
        this.fallbackToMemory();
      });

      await this.client.connect();
      console.log("✅ Connected to Redis");
    } catch (error) {
      console.error("❌ Redis not available, falling back to memory", error);
      this.fallbackToMemory();
    }
  }

  private fallbackToMemory() {
    this.useMemory = true;
    this.client = null;
    console.log("⚡ Using in-memory cache instead of Redis");
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (this.useMemory) {
      this.memoryStore.set(key, value);
      if (ttlSeconds) {
        setTimeout(() => this.memoryStore.delete(key), ttlSeconds * 1000);
      }
    } else if (this.client) {
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useMemory) {
      return this.memoryStore.get(key) || null;
    } else if (this.client) {
      return await this.client.get(key);
    }
    return null;
  }

  async del(key: string) {
    if (this.useMemory) {
      this.memoryStore.delete(key);
    } else if (this.client) {
      await this.client.del(key);
    }
  }
}

export const redisService = new RedisService();
