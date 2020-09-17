import { MusicDatabase } from '../data/MusicDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { MusicFeedInputDTO, MusicInputDTO } from '../model/Music';

export class MusicBusiness {
  async insertMusic(music: MusicInputDTO, genres: string[]) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const musicDatabase = new MusicDatabase();
    const AllSongs = await this.getAllSongs();

    let songExistAlready = false;
    for (const song of AllSongs) {
      if (
        song.title === music.title &&
        song.author === music.author &&
        song.album === music.album
      ) {
        console.log(songExistAlready);
        songExistAlready = true;
        throw new Error("Esta música já está registrada no banco!");
      }
    }

    if (!songExistAlready) {
      await musicDatabase.insertSong(
        id,
        music.title,
        music.author,
        music.date,
        music.file,
        music.album,
        music.added_by
      );
    }

    for (const genre of genres) {
      const musicGenreId = idGenerator.generate();
      await musicDatabase.insertMusicGenre(musicGenreId, id, genre);
    }
  }

  async getSongById(id: any) {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getSongById(id);

    return musicFromDB;
  }

  async getSongByUserId(id: any) {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getSongByUserId(id);

    return musicFromDB;
  }

  async getMusicGenres(music_id: string) {
    const musicDatabase = new MusicDatabase();
    const musicGenreFromDB = await musicDatabase.getMusicGenres(music_id);

    return musicGenreFromDB;
  }

  async deleteSongById(id: string) {
    const musicDatabase = new MusicDatabase();
    const songToDelete = await musicDatabase.deleteSongById(id);
    const musicGenresToDelete = await musicDatabase.deleteMusicGenresById(id);

    return songToDelete;
  }

  async getAllSongs() {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getAllSongs();

    return musicFromDB;
  }

  async getAllSongsFiltered(
    token: string,
    feedInput: MusicFeedInputDTO
  ): Promise<MusicFeedInputDTO[]> {
    if (!feedInput.page || feedInput.page < 1 || Number.isNaN(feedInput.page)) {
      feedInput.page = 1;
    }

    const songsPerPage = 20;

    const offset = songsPerPage * (feedInput.page - 1);

    if (!feedInput.musicGenre) {
      feedInput.musicGenre = "";
      //throw new Error("Envie um nome de usuário válido");
    }

    if (feedInput.orderBy !== "title" && feedInput.orderBy !== "createdAt") {
      // throw new Error("Passe um parâmetro de ordenação válido")
      feedInput.orderBy = "title";
    }

    if (feedInput.orderType !== "ASC" && feedInput.orderType !== "DESC") {
      feedInput.orderType = "ASC";
    }

    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getAllSongsFiltered(
      feedInput,
      songsPerPage,
      offset
    );

    return musicFromDB;
  }
}

