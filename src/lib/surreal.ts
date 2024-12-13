import Surreal from "surrealdb";

interface DbConfig {
  url: string;
  wsUrl: string;
  namespace: string;
  database: string;
}

const DEFAULT_CONFIG: DbConfig = {
  url: "http://127.0.0.1:8000/rpc",
  wsUrl: "ws://127.0.0.1:8000/ws",

  //url: "http://127.0.0.1:8000/rpc",
  namespace: "dev",
  database: "stickies",
};

export async function getWsDb(
  config: DbConfig = DEFAULT_CONFIG,
): Promise<Surreal> {
  const db = new Surreal();
  try {
    await db.connect(config.wsUrl, {
      auth: localStorage.getItem("jwtToken") || "",
    });
    await db.use({ namespace: config.namespace, database: config.database });
    await db.authenticate(localStorage.getItem("jwtToken") || "");
    return db;
  } catch (err) {
    console.error(
      "Failed to connect to SurrealDB:",
      err instanceof Error ? err.message : String(err),
    );
    await db.close();
    throw err;
  }
}

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
    console.error(
      "Failed to connect to SurrealDB:",
      err instanceof Error ? err.message : String(err),
    );
    await db.close();
    throw err;
  }
}
