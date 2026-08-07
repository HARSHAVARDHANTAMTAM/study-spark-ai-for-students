import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type MockUser = {
  name: string;
  email: string;
  avatar?: string;
  college: string;
  branch: string;
  semester: string;
};

const STORAGE_KEY = "studyspark.user";

const DEFAULT_USER: MockUser = {
  name: "Aarav Sharma",
  email: "aarav@studyspark.ai",
  college: "Indian Institute of Technology, Delhi",
  branch: "Computer Science & Engineering",
  semester: "Semester 5",
};

type AuthContextValue = {
  user: MockUser | null;
  ready: boolean;
  signIn: (email: string, name?: string) => MockUser;
  signOut: () => void;
  updateUser: (patch: Partial<MockUser>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as MockUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: MockUser | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const signIn = useCallback(
    (email: string, name?: string) => {
      const next: MockUser = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: name?.trim() || DEFAULT_USER.name,
      };
      persist(next);
      return next;
    },
    [persist],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signIn,
      signOut: () => persist(null),
      updateUser: (patch) => persist({ ...(user ?? DEFAULT_USER), ...patch }),
    }),
    [user, ready, signIn, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}