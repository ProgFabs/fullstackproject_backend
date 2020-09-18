import { BaseDatabase } from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase {
  private static TABLE_NAME = "MC_Playlist";

  public async insertPlaylist(
    id: string,
    title: string,
    subtitle: string,
    image: string,
    creator_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          subtitle,
          image,
          creator_id,
        })
        .into(PlaylistDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async insertSongIntoPlaylist(
    id: string,
    music_id: string,
    playlist_id: string
  ): Promise<any> {
    try {
      await this.getConnection()
        .insert({
          id,
          music_id,
          playlist_id,
        })
        .into("MC_PlaylistSongs");
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllPlaylistsByUserId(creator_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(PlaylistDatabase.TABLE_NAME)
        .where({ creator_id });

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

  public async getPlaylistSongs(playlist_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from("MC_PlaylistSongs")
        .where({ playlist_id });
      let counter = -1;
      let newResult = [];
      for (const item of result) {
        counter++;
        newResult.push(result[counter].music_id);
      }
      return newResult;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteSongFromPlaylistById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete()
        .from("MC_PlaylistSongs")
        .where({ id });

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteSongFromPlaylistByMusicId(music_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete()
        .from("MC_PlaylistSongs")
        .where({ music_id });

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongToDeleteById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from("MC_PlaylistSongs")
        .where({ id });

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongToDeleteByMusicId(music_id: string): Promise<any[]> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from("MC_PlaylistSongs")
        .where({ music_id });

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}