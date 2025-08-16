import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.rotues";
import authRouter from "./src/routes/auth.routes";
import urlRouter from "./src/routes/url.routes";
import shortUrlRouter from "./src/routes/shorturl.routes";

const app = express();

app.use(express.json());
app.use(cors());


app.use("/", shortUrlRouter);

app.use("/api/v1/auth", authRouter);
app.use('/api/v1/users', userRouter)
app.use('/api/v1/urls', urlRouter)

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;