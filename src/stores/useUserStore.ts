import { create } from 'zustand';

type UserState = {
  role: string | null;
  profilePic: string | null;
  isLoggedIn: boolean;
};

type UserActions = {
  setRole: (role: string | null) => void;
  setProfilePic: (profilePic: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

// Zustand store definition
export const useUserStore = create<UserState & UserActions>((set) => ({
  role: null,
  profilePic: null,
  isLoggedIn: false,

  // Actions for updating the store state
  setRole: (role) => set(() => ({ role })),
  setProfilePic: (profilePic) => set(() => ({ profilePic })),
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
}));
