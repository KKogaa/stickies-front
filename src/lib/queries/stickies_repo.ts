import { getDb } from "../surreal";

export interface Sticky {
  id: string;
  title: string;
  content: string;
  userId: string;
  teamId: string;
}

export const fetchStickies = async (
  userId: string,
  teamId: string,
): Promise<Sticky[]> => {
  const db = await getDb();
  if (!db) {
    throw new Error("Failed to connect to SurrealDB");
  }

  let stickies: Sticky[] = [];
  try {
    //stickies = await db.query("select * from sticky");
    //console.log("AAAAAAAAAAAAAAAaa");
    //console.log(stickies);
    //console.log(JSON.stringify(stickies[0]));
    //console.log(stickies[0][0].title);
    //console.log("AAAAAAAAAAAAAAAaa");
    stickies = await db.select<Sticky>("sticky");
    console.log(stickies);
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }
  return stickies;
};

export const addSticky = async (
  title: string,
  content: string,
): Promise<Sticky> => {
  const db = await getDb();
  if (!db) {
    throw new Error("Failed to connect to SurrealDB");
  }

  try {
    const record = await db.create("sticky", {
      title: title,
      content: content,
    });
    console.log("BBBBBBBBBBBBBBBB");
    console.log(record);
    console.log("BBBBBBBBBBBBBBBB");
  } catch (err) {
    console.error(err);
  } finally {
    await db.close();
  }

  return {
    id: "",
    title: "",
    content: "",
    userId: "",
    teamId: "",
  };
};
