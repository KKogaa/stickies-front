import { createContext, useContext, useEffect, useState } from 'react';
import Surreal from 'surrealdb';

//TODO: move this to infrastructure
interface DbConfig {
  url: string,
  namespace: string,
  database: string
}

const DEFAULT_CONFIG: DbConfig = {
  url: "http://localhost:8000/rpc",
  namespace: "dev",
  database: "stickies"
}

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  test: (email: string, password: string) => void;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => { },
  logout: () => { },
  test: () => { },
  signup: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('test');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const test = (email: string, password: string): void => {
    console.log(`from test email ${email} password ${password}`);
  }

  //TODO: refactor this should be as a part of infrastructure 
  const getDb = async (config: DbConfig = DEFAULT_CONFIG): Promise<Surreal> => {
    const db = new Surreal();

    try {
      await db.connect(config.url);
      await db.use({ namespace: config.namespace, database: config.database });
      return db;
    } catch (err) {
      console.error("Failed to connect to SurrealDB:", err instanceof Error ? err.message : String(err));
      await db.close();
      throw err;
    }
  }

  const login = async (email: string, password: string): Promise<void> => {
    // Implement login logic here, e.g., fetch token from server
    console.log(`from login function Email: ${email} Password: ${password}`);
    localStorage.setItem('jwtToken', 'your_jwt_token');
    const db = await getDb();
    const token = await db.signin({
      namespace: 'dev',
      database: 'stickies',
      username: email,
      password: password
    });
    console.log(token);
    setIsLoggedIn(true);
  };

  const signup = async (email: string, password: string): Promise<void> => {
    // Implement login logic here, e.g., fetch token from server
    console.log(`from login function Email: ${email} Password: ${password}`);
    localStorage.setItem('jwtToken', 'your_jwt_token');
    const db = await getDb();
    const token = await db.signin({
      namespace: 'dev',
      database: 'stickies',
      username: email,
      password: password
    });
    console.log(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, test, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
