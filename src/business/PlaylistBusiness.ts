import { PlaylistDatabase } from '../data/PlaylistDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { PlaylistInputDTO } from '../model/Playlist';

export class PlaylistBusiness {
  async insertPlaylist(playlist: PlaylistInputDTO) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const playlistDatabase = new PlaylistDatabase();
    // const AllPlaylists = await this.getAllMusic();

    // let playlistExistAlready = false;
    // for(const song of AllSongs) {
    //   if (
    //     song.title === music.title &&
    //     song.author === music.author &&
    //     song.album === music.album
    //   ) {
    //     console.log(songExistAlready);
    //     songExistAlready = true;
    //     throw new Error("Esta música já está registrada no banco!");
    //   }
    // }

    // if (!songExistAlready) {
    // }

    await playlistDatabase.insertPlaylist(
      id,
      playlist.title,
      playlist.subtitle,
      playlist.image,
      playlist.creator_id
    );
  }

  async insertSongIntoPlaylist(song: any, playlistId: any) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();
    const playlistDB = new PlaylistDatabase();
    await playlistDB.insertSongIntoPlaylist(id, song.id, playlistId);
  }

  async getAllPlaylists() {
    const playlistDatabase = new PlaylistDatabase();
    const playlists = await playlistDatabase.getAllPlaylists();

    return playlists;
  }

  async getPlaylistSongs(playlistId: string) {
    const playlistDatabase = new PlaylistDatabase();
    const playlistSongsFromDB = await playlistDatabase.getPlaylistSongs(
      playlistId
    );

    return playlistSongsFromDB;
  }
}