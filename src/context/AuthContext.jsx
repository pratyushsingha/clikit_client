import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getAccessToken = () => {
      setToken(localStorage.getItem('accessToken'));
    };
    getAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
