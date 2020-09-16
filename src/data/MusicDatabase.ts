import { BaseDatabase } from "./BaseDatabase";
import moment, { Moment } from "moment"
import { Music } from "../model/Music";

export class MusicDatabase extends BaseDatabase {
  private static TABLE_NAME = "MC_Music";

  public async insertMusic(
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

  public async getMusicById(id: string): Promise<any> {
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

  public async getMusicByUserId(added_by: string): Promise<any> {
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

  public async deleteMusicById(id: string): Promise<any> {
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
      .where({ music_id: id})

      return result[0]
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

  public async getAllMusic(): Promise<any> {
    try {
      const result = await this.getConnection()
      .select("*")
      .from(MusicDatabase.TABLE_NAME)

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
}