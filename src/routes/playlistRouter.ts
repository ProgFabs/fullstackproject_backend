import { PlaylistController } from "../controller/PlaylistController";
import express from "express";

export const playlistRouter = express.Router();

const playlistController = new PlaylistController();

playlistRouter.put("/register", playlistController.insertPlaylist);
playlistRouter.post("/add/:id", playlistController.insertSongIntoPlaylist);
playlistRouter.get("/:id", playlistController.getPlaylistSongs);
