import { MusicController } from '../controller/MusicController';
import express from "express";

export const musicRouter = express.Router();

const musicController = new MusicController();

musicRouter.post("/register", musicController.insertMusic);
musicRouter.post("/get/:id", musicController.getMusicById);
musicRouter.post("/get/", musicController.getMusicByUserId);
