import axios from 'axios';

let BASE_URL = '/exchange';

// GET 요청
export const get = async (params) => {
  try {
    const response = await axios.get(BASE_URL, { params });
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.error(`Error - get: ${e}`);
    throw e;
  }
};