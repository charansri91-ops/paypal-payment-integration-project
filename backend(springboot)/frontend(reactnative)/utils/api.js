import { AuthContext } from '../../context/AuthProvider';
import { useContext } from 'react';

export const useApi = () => {
  const { token } = useContext(AuthContext);
  const base = 'https://your-backend-domain.com';

  const get = async (path) => {
    const res = await fetch(base + path, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      }
    });
    return res;
  };

  const post = async (path, body) => {
    const res = await fetch(base + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body)
    });
    return res;
  };

  return { get, post };
};
