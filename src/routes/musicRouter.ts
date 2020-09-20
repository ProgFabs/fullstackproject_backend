import { MusicController } from '../controller/MusicController';
import express from "express";

export const musicRouter = express.Router();

const musicController = new MusicController();

musicRouter.post("/register", musicController.insertMusic);
musicRouter.get("/get/:id", musicController.getSongById);
musicRouter.get("/get/", musicController.getSongByUserId);
musicRouter.get("/get-all", musicController.getAllSongs)
musicRouter.delete("/delete/:id", musicController.deleteSongById)
