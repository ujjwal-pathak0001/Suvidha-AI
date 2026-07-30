import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUser } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('a2sl_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser(token)
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('a2sl_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const loginSuccess = (data) => {
    localStorage.setItem('a2sl_token', data.token);
    setToken(data.token);
    setUser({ id: data.id, username: data.username });
  };

  const logoutSuccess = () => {
    localStorage.removeItem('a2sl_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginSuccess, logoutSuccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
