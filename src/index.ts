import { musicRouter } from './routes/musicRouter';
import dotenv from "dotenv";
import {AddressInfo} from "net";
import express from "express";
import { userRouter } from "./routes/userRouter";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/music", musicRouter);

const server = app.listen(3000, () => {
    if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server up and running on http://localhost:${address.port}`);
    } else {
      console.error(`Failure on running the server.`);
    }
  });