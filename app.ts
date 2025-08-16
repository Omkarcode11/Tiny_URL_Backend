import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.rotues";
import authRouter from "./src/routes/auth.routes";
import urlRouter from "./src/routes/url.routes";
import shortUrlRouter from "./src/routes/shorturl.routes";
import analyticsRouter from "./src/routes/analytics.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log('Root endpoint accessed');
  res.send("Server is running");
});

// Routes
app.use("", shortUrlRouter);
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/urls', urlRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`Error: ${err.message}`, { 
    stack: err.stack, 
    url: req.url, 
    method: req.method 
  });
  res.status(500).json({ error: 'Internal server error' });
});

export default app;