import { PlaylistBusiness } from '../business/PlaylistBusiness';
import { Playlist, PlaylistInputDTO } from '../model/Playlist';
import { Request, Response } from "express";
import { Authenticator } from '../services/Authenticator';
import moment from 'moment';
import { UserDatabase } from '../data/UserDatabase';
import { PlaylistDatabase } from '../data/PlaylistDatabase';
import { MusicDatabase } from '../data/MusicDatabase';
import { MusicBusiness } from '../business/MusicBusiness';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export class PlaylistController {
  async insertPlaylist(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const playlistBusiness = new PlaylistBusiness();

      const input: PlaylistInputDTO = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image || null,
        creator_id: user.id,
      };

      await playlistBusiness.insertPlaylist(input);

      res.status(200).send({
        message: "New playlist added successfully!",
      });
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  }

  async insertSongIntoPlaylist(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const id = req.params.id;
      const playlistId = req.body.id;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user = await userDB.getUserById(authenticationData.id);
      const musicDB = new MusicDatabase();
      const song = await musicDB.getSongById(id);

      const playlistBusiness = new PlaylistBusiness();
      await playlistBusiness.insertSongIntoPlaylist(song, playlistId);

      res.status(200).send({
        message: "New song added successfully in the playlist!",
      });
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  }

  async getAllPlaylistsByUserId(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;

      const playlistBusiness = new PlaylistBusiness();
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const playlists: any[] = await playlistBusiness.getAllPlaylistsByUserId(
        user.id
      );

      const result = {
        playlists,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async getPlaylistSongs(req: Request, res: Response) {
    const playlistBusiness = new PlaylistBusiness();
    const musicBusiness = new MusicBusiness();
    try {
      const playlistId = req.params.id;
      const playlistSongsIds: any[] = await playlistBusiness.getPlaylistSongs(
        playlistId
      );
      const retrievedSongs: any[] = [];
      const songs: any[] = [];

      console.log("IDs que chegaram na controller", playlistSongsIds);
      for (const item of playlistSongsIds) {
        const newSongs: [] = await musicBusiness.getSongById(item);
        songs.push(newSongs);
      }

      console.log("músicas", songs);

      for (const item of songs) {
        const convertedDate = moment(item.date).format("DD-MM-YYYY");
        item.date = convertedDate;

        retrievedSongs.push(item);
      }

      console.log("retrievedSongs", retrievedSongs);

      const result = {
        PlaylistSongs: retrievedSongs,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async deleteSongFromPlaylistById(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const id = req.params.id;

      const playlistBusiness = new PlaylistBusiness();
      const playlistDB = new PlaylistDatabase();
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);

      const userPlaylists = await playlistBusiness.getAllPlaylistsByUserId(
        user.id
      );
      const userPlaylistsIds: any[] = [];
      const songToDelete = await playlistDB.getSongToDeleteById(id); // alterei essa linha as 18h56

      for (let playlist of userPlaylists) {
        userPlaylistsIds.push(playlist.id);
      }

      for (let item of userPlaylistsIds) {
        if (songToDelete.playlist_id === item) {
          await playlistBusiness.deleteSongFromPlaylistById(id);
        } else {
          throw new Error(
            "You can't delete this song, as you're not it's owner."
          );
        }
      }

      res.status(200).send({
        message: "Song deleted successfully!",
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
}