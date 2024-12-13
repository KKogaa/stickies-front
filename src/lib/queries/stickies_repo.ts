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

export const fetchStickies = async (): Promise<Sticky[]> => {
  const db: Surreal = await getDb();

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
  const db: Surreal = await getDb();

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

export const deleteSticky = async (id: string): Promise<void> => {
  const db: Surreal = await getDb();

  try {
    await db.query(`delete sticky where id = $id`, { id });
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
};

export const generateEmbedding = async (data: string): Promise<number[]> => {
  const response = await fetch("http://localhost:5000/embedding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  }).then(async (res) => await res.json());

  return response;
};

export const searchStickies = async (query: string): Promise<Sticky[]> => {
  const db: Surreal = await getDb();

  try {
    const embedding = await generateEmbedding(query);

    const records = await db.query<Sticky[][]>(
      `SELECT *, owner.id, owner.email, vector::similarity::cosine(embedding, $embedding) AS dist FROM sticky WHERE embedding <|2|> $embedding`,
      { embedding: embedding },
    );

    return records[0];
  } catch (err) {
    console.error(err);
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
  const db: Surreal = await getDb();

  try {
    const embedding = await generateEmbedding(`${title} ${content}`);

    let [values] = await db.query<Sticky[][]>(
      "create sticky set title = $title, content = $content, embedding = $embedding",
      {
        title,
        content,
        embedding,
      },
    );

    const createdSticky = values[0] as Sticky;

    if (!createdSticky.id) {
      throw new Error("sticky has no id");
    }
    const stickyId = `${createdSticky.id.tb}:${createdSticky.id.id}`;

    //TODO: skill issue team id is not being passed as a record id
    await db.query(`relate ${team.id} -> sticky_team -> ${stickyId}`);

    return createdSticky;
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }

  return {};
};
