import axios from 'axios';

export const loginUserAPI = async (username, password) => {
  try {
    const response = await axios.post('/login', {
      username,
      password,
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};
