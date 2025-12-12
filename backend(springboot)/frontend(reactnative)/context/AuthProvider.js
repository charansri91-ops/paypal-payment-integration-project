import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

const TOKEN_KEY = "APP_TOKEN";
const USER_KEY = "APP_USER";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored token on app start
  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (savedToken) setToken(savedToken);
      if (savedUser) setUser(JSON.parse(savedUser));

      setLoading(false);
    })();
  }, []);

  // Save auth data
  const login = async (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);

    await AsyncStorage.setItem(TOKEN_KEY, jwtToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  // Logout
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
