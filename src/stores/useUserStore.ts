import { create } from 'zustand';

type UserState = {
  role: string | null;
  profilePic: string | null;
  isLoggedIn: boolean;
  currentTab: number;
};

type UserActions = {
  setRole: (role: string | null) => void;
  setProfilePic: (profilePic: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentTab: (tabIndex: number) => void;
};

export const useUserStore = create<UserState & UserActions>((set) => ({
  role: null,
  profilePic: null,
  isLoggedIn: false,
  currentTab: 0,

  // Actions for updating the store state
  setRole: (role) => set(() => ({ role })),
  setProfilePic: (profilePic) => set(() => ({ profilePic })),
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  setCurrentTab: (tabIndex) => set(() => ({ currentTab: tabIndex })),
}));
