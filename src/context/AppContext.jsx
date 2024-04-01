import { createContext, useState } from 'react';

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [progress, setProgress] = useState(false);
  const value = {
    progress,
    setProgress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
