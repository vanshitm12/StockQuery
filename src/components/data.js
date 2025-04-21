// api.js
import axios from 'axios';

export const fetchData = async () => {
  try {
    const response = await axios.get('https://run.mocky.io/v3/7134c733-0858-4622-9a30-b973609207da');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
