import BaseDatabase from "./BaseDatabase";
import {User} from "../models/User";


export default class UserDatabase extends BaseDatabase {

    private static TABLE_NAME = "MC_Users"

    public async createUser(
        id: string,
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<void> {
        try { 
            await this.getConnection()
            .insert({
                id,
                name,
                email,
                password,
                role
            })
            .into(UserDatabase.TABLE_NAME);
        } catch(error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
    public async getUserByEmail(email: string): Promise<User> {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ email });

    return User.toUserModel(result[0]);
  }
}
