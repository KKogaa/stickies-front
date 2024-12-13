import Surreal, { RecordId } from "surrealdb";
import { getDb } from "../surreal";
import { Team } from "./teams_repo";

export type Owner = {
  id: RecordId;
  email: string;
};

export type Sticky = {
  id?: RecordId;
  title?: string;
  content?: string;
  owner?: Owner;
};

//TODO: live queries don't work probably because of rpc connection
//export const fetchLiveStickies = async (): Promise<Sticky[]> => {
//  const db = await getWsDb();
//  if (!db) {
//    throw new Error("Failed to connect to SurrealDB");
//  }
//
//  console.log("fetchLiveStickies: fetching live stickies from SurrealDB...");
//  const queryUuid = await db.live("sticky", () => {
//    console.log("fetchLiveStickies: live query callback");
//  });
//  console.log(queryUuid);
//
//  return [];
//};
//

//export const fetchStickies = async (): Promise<Sticky[]> => {
//  const db = await getDb();
//  if (!db) {
//    throw new Error("Failed to connect to SurrealDB");
//  }
//
//  try {
//    const records = await db.select("sticky");
//    return records.map((record) => {
//      const sticky: Sticky = {
//        id: record.id as RecordId,
//        title: record.title as string,
//        content: record.content as string,
//        owner: record.owner as RecordId,
//      };
//      return sticky;
//    });
//  } catch (err) {
//    console.error(err);
//  } finally {
//    await db.close();
//  }
//  return [];
//};
//

export const fetchStickies = async (): Promise<Sticky[]> => {
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
    const records = await db.query<Sticky[][]>(
      `select *, owner.id, owner.email from sticky`,
    );

    return records[0];
  } catch (err) {
  } finally {
    await db.close();
  }
  return [];
};

export const fetchStickiesByTeam = async (team: Team): Promise<Sticky[]> => {
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
  console.log(team.id)

  try {
    const records = await db.query<Sticky[][]>(
      `select *, owner.id, owner.email from sticky where ${team.id} in <-sticky_team<-team.id`,
    );

    return records[0];
  } catch (err) {
  } finally {
    await db.close();
  }
  return [];
};

export const addSticky = async (
  title: string,
  content: string,
  team: Team,
): Promise<Sticky> => {
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
    let [values] = await db.query<Sticky[][]>(
      "create sticky set title = $title, content = $content",
      {
        title,
        content,
      },
    );

    const createdSticky = values[0] as Sticky;

    if (!createdSticky.id) {
      throw new Error("sticky has no id");
    }
    const stickyId = `${createdSticky.id.tb}:${createdSticky.id.id}`;

    //TODO: skill issue team id is not being passed as a record id
    //TODO: also change the name of this relation to stickyTeam
    await db.query(`relate ${team.id} -> sticky_team -> ${stickyId}`);

    return createdSticky;
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }

  return {};
};
