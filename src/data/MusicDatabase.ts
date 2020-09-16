import { BaseDatabase } from "./BaseDatabase";
import moment, { Moment } from "moment"
import { Music, MusicFeedInputDTO } from "../model/Music";

export class MusicDatabase extends BaseDatabase {
  private static TABLE_NAME = "MC_Music";

  public async insertSong(
    id: string,
    title: string,
    author: string,
    date: Date,
    file: string,
    album: string,
    added_by: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          author,
          date,
          file,
          album,
          added_by,
        })
        .into(MusicDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async insertMusicGenre(
    id: string,
    music_id: string,
    genre: string
  ): Promise<any> {
    try {
      await this.getConnection()
        .insert({
          id,
          music_id,
          genre,
        })
        .into("MC_MusicGenres");
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(MusicDatabase.TABLE_NAME)
        .where({ id });
      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongByUserId(added_by: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(MusicDatabase.TABLE_NAME)
        .where({ added_by });

      let counter = -1;
      let newResult = [];
      for (const item of result) {
        counter++;
        newResult.push(result[counter]);
      }

      return newResult;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteSongById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete("*")
        .from(MusicDatabase.TABLE_NAME)
        .where({ id });

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteMusicGenresById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete("")
        .from("MC_MusicGenres")
        .where({ music_id: id });

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getMusicGenres(music_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("genre")
        .from("MC_MusicGenres")
        .where({ music_id });
      let counter = -1;
      let newResult = [];
      for (const item of result) {
        counter++;
        newResult.push(result[counter].genre);
      }

      return newResult;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllSongs(): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(MusicDatabase.TABLE_NAME);

      let counter = -1;
      let newResult = [];
      for (const item of result) {
        counter++;
        newResult.push(result[counter]);
      }

      return newResult;
    } catch (error) {
      throw new Error(
        error.sqlMessage + " (getAllSongsFiltered)" ||
          error.message + " (getAllSongsFiltered)"
      );
    }
  }

  public async getAllSongsFiltered(
    feedInput: MusicFeedInputDTO,
    musicPerPage: number,
    offset: number
  ): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
        SELECT m.*, g.genre from MC_Music m 
        JOIN MC_MusicGenres g 
        ON m.id = g.music_id
        WHERE g.genre LIKE "%${feedInput.musicGenre}%"
        ORDER BY ${feedInput.orderBy}
        LIMIT ${musicPerPage}
        OFFSET ${offset};
      `);

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage + " (getAllSongsFiltered)" || error.message + " (getAllSongsFiltered)");
    }
  }
}