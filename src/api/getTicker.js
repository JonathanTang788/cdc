const axios = require("axios");

const getTicker = async (name) => {
  const URL = "https://api.crypto.com/v2/public/get-ticker?instrument_name=";
  try {
    const res = await axios.get(URL + name);
    const data = res.data.result.data;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getTicker;
