import { MusicDatabase } from '../data/MusicDatabase';
import { IdGenerator } from '../services/IdGenerator';
import { MusicInputDTO } from '../model/Music';

export class MusicBusiness {
  async insertMusic(music: MusicInputDTO, genres: string[]) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const musicDatabase = new MusicDatabase();
    await musicDatabase.insertMusic(
      id,
      music.title,
      music.author,
      music.date,
      music.file,
      music.album,
      music.added_by
    );

    for (const genre of genres) {
      const musicGenreId = idGenerator.generate();
      await musicDatabase.insertMusicGenre(musicGenreId, id, genre);
    }
  }

  async getMusicById(id: any) {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getMusicById(id);

    return musicFromDB;
  }

  async getMusicByUserId(id: any) {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getMusicByUserId(id);

    return musicFromDB;
  }

  async getMusicGenres(music_id: string) {
    const musicDatabase = new MusicDatabase();
    const musicGenreFromDB = await musicDatabase.getMusicGenres(music_id);

    return musicGenreFromDB;
  }
}

