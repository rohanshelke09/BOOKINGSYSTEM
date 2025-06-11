export const getToken = () => {
  try {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) return null;
    
    const parsed = JSON.parse(tokenData);
    return parsed.token;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};