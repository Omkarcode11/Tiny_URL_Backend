import app from "./app";
import prisma from "./db/connection";

app.listen(3000, async () => {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected to database");
    console.log("Server is running on port 3000");
  } catch (error) {
    console.error(error);
  }
});