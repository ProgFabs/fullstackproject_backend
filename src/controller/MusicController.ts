import { MusicBusiness } from '../business/MusicBusiness';
import { MusicFeedInputDTO, MusicInputDTO } from '../model/Music';
import { Request, Response } from "express";
import { Authenticator } from '../services/Authenticator';
import moment from 'moment';
import { UserDatabase } from '../data/UserDatabase';
import { MusicDatabase } from '../data/MusicDatabase';

export class MusicController {
  async insertMusic(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user = await userDB.getUserById(authenticationData.id);

      const receivedGenres = req.body.genre.split(", ");
      const receivedDate: Date = new Date(req.body.date);
      const musicBusiness = new MusicBusiness();

      const input: MusicInputDTO = {
        title: req.body.title,
        author: req.body.author,
        date: receivedDate,
        file: req.body.file,
        album: req.body.album,
        added_by: user.getId(),
      };

      await musicBusiness.insertMusic(input, receivedGenres);

      res.status(200).send({
        message: "New music added successfully!",
      });
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  }

  async getSongByUserId(req: Request, res: Response) {
    const musicBusiness: MusicBusiness = new MusicBusiness();
    try {
      const token = req.headers.auth as string;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user = await userDB.getUserById(authenticationData.id);
      const music: any[] = await musicBusiness.getSongByUserId(user.getId());

      const retrievedMusic = [];

      for (const item of music) {
        const musicGenres = await musicBusiness.getMusicGenres(item.id);
        const convertedDate = moment(item.date).format("DD-MM-YYYY");
        item.date = convertedDate;
        item.genre = musicGenres;
        retrievedMusic.push(item);
      }

      const result = {
        retrievedMusic,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async deleteSongById(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const id = req.params.id;

      const musicBusiness = new MusicBusiness();
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user = await userDB.getUserById(authenticationData.id);

      const songToDelete = await musicBusiness.getSongById(id);
      console.log(songToDelete.title);
      console.log(songToDelete.added_by);

      if (songToDelete.added_by === user.getId()) {
        await musicBusiness.deleteSongById(id);
      } else {
        throw new Error(
          "You can't delete this song, as you're not it's owner."
        );
      }

      res.status(200).send({
        message: "Song deleted successfully!",
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async getSongById(req: Request, res: Response) {
    const musicBusiness: MusicBusiness = new MusicBusiness();
    try {
      const id = req.params.id;
      const music = await musicBusiness.getSongById(id);
      const musicGenres = await musicBusiness.getMusicGenres(music.id);
      const convertedDate = moment(music.date).format("DD-MM-YYYY");
      music.date = convertedDate;
      music.genres = musicGenres;

      const result = {
        music,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async getAllSongs(req: Request, res: Response) {
    const musicBusiness = new MusicBusiness();
    try {
      const token = req.headers.auth as string;

      const musicGenre = req.query.musicGenre as string;
      const orderBy = req.query.orderBy as string;
      const orderType = req.query.orderType as string;
      const page = req.query.page as string;

      const feedInput: MusicFeedInputDTO = {
        musicGenre: musicGenre,
        orderBy: orderBy,
        orderType: orderType,
        page: Number(page),
      };

      const music: any[] = await musicBusiness.getAllSongsFiltered(token, feedInput);
      const songs = [];

      for (const item of music) {
        const musicGenres = await musicBusiness.getMusicGenres(item.id);
        const convertedDate = moment(item.date).format("DD-MM-YYYY");
        item.date = convertedDate;
        item.genre = musicGenres;
        songs.push(item);
      }

      const result = {
        songs,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
}