import Surreal, { RecordId } from "surrealdb";
import { getDb } from "../surreal";

export type Team = {
  id: RecordId;
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

    //make the user the owner of the team

    //create a relation between the team and the user
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
      const team: Team = {
        id: record.id.toString(),
        name: record.name as string,
      };
      return team;
    });
    return teams;
  } catch (err) {
  } finally {
    await db.close();
  }
  return [];
};
