import dotenv from "dotenv";
import {AddressInfo} from "net";
import express from "express";
import { userRouter } from "./routes/UserRouter"

dotenv.config();
const app = express();

app.use(express.json());

app.use("/user", userRouter);

const server = app.listen(3000, () => {
    if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server up and running on http://localhost:${address.port}`);
    } else {
      console.error(`Failure! Server couldn't start.`);
    }
  });