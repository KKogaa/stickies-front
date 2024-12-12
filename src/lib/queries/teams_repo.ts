import Surreal from "surrealdb";
import { getDb } from "../surreal";

export type Team = {
  id?: string;
  name: string;
  //members: string[];
};

export const createTeam = async (name: string): Promise<void> => {
  const db = await getDb();
  if (!db) {
    throw new Error("Failed to connect to SurrealDB");
  }

  try {
    const record = await db.query("create team set name = $name", {
      name,
    });
    console.log(record);
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  const db = await getDb()
    .catch((err) => {
      console.error(err);
    })
    .then((db: Surreal | void) => {
      if (!db) {
        throw new Error("Failed to connect to SurrealDB");
      }
      return db;
    });

  try {
    const records = await db.select("team");
    const teams = records.map((record: any) => {
      console.log(record);
      const team: Team = {
        id: record.id.toString(),
        name: record.name as string,
        //members: record.members as string[],
      };
      return team;
    });
    console.log(teams);
    return teams;
  } catch (err) {
  } finally {
    await db.close();
  }
  return [];
};
