import { ISession } from "@/types";
import { create } from "zustand";

interface SessionStore {
  session: ISession | null;
  setSession: (session: ISession | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null, // Initialize with null or a default session object
  setSession: (session) => set({ session }), // Function to update session state
}));