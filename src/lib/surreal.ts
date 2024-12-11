import Surreal from "surrealdb";

export const endpoint = "ws://localhost:3001/rpc";

interface DbConfig {
  url: string;
  namespace: string;
  database: string;
}

const DEFAULT_CONFIG: DbConfig = {
  url: "http://127.0.0.1:8000/",
  //url: "http://127.0.0.1:8000/rpc",
  namespace: "dev",
  database: "stickies",
};

export async function getDb(
  config: DbConfig = DEFAULT_CONFIG,
): Promise<Surreal> {
  const db = new Surreal();

  try {
    //await db.connect(config.url);
    await db.connect(config.url, {
      auth: localStorage.getItem("jwtToken") || "",
    });
    await db.use({ namespace: config.namespace, database: config.database });
    await db.authenticate(localStorage.getItem("jwtToken") || "");
    //await db.authenticate(localStorage.getItem("jwtToken") || "");

    //await db.use({ namespace: config.namespace, database: config.database });
    return db;
  } catch (err) {
    console.log("GAAAAAAAAAa");
    console.error(
      "Failed to connect to SurrealDB:",
      err instanceof Error ? err.message : String(err),
    );
    await db.close();
    throw err;
  }
}
