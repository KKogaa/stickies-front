import Surreal from "surrealdb";
import { getDb } from "../surreal";
import { Team } from "./teams_repo";

export type Owner = {
  id: string;
  tb: string;
};

export type Sticky = {
  id?: string;
  title: string;
  content: string;
  owner?: Owner;
};

export const fetchStickies = async (): Promise<Sticky[]> => {
  const db = await getDb();
  if (!db) {
    throw new Error("Failed to connect to SurrealDB");
  }

  try {
    const records = await db.select("sticky");
    return records.map((record) => {
      const sticky: Sticky = {
        id: record.id.toString(),
        title: record.title as string,
        content: record.content as string,
        owner: record.owner as Owner,
      };
      console.log(sticky);
      return sticky;
    });
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
  return [];
};

export const fetchStickiesByTeam = async (team: Team): Promise<Sticky[]> => {
  return [];
};

export const addSticky = async (
  title: string,
  content: string,
  team?: Team,
): Promise<void> => {
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
    const record = await db.query(
      "create sticky set title = $title, content = $content",
      {
        title,
        content,
      },
    );

    //add relation from sticky to team
    //await db.relate("team", team.id, );

    console.log(record);
  } catch (err) {
  } finally {
    await db.close();
  }
};
