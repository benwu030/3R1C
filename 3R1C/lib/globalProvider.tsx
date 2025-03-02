import React, { createContext, useContext, ReactNode } from "react";

import { getUser } from "./AppWrite";
import { useAppwrite } from "./useAppWrite";
import { useState } from "react";
interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (isOfflineMode: boolean) => void;
}

interface User {
  $id: string;
  name: string;
  email: string;
  avatar?: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const {
    data: user,
    loading,
    refetch,
  } = useAppwrite({
    fn: getUser,
  });
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const isLoggedIn = !!user;
  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetch,
        isOfflineMode,
        setIsOfflineMode,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
