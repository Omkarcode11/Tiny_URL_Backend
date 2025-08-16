import app from "./app";
import prisma from "./db/connection";

app.listen(process.env.PORT, async () => {
  try {
    console.log("Connecting to database...");
    await prisma.$connect();
    console.log("Connected to database");
     
    console.log("Connecting to redis...");
        
    console.log("Connected to redis");

    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.error(error);
  }
});