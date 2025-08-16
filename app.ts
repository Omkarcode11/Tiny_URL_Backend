import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.rotues";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', userRouter)

app.get("/", (req, res) => {
  res.send("Server is running");
});

export default app;