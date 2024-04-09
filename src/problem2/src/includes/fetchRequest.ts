import axios from "axios";

const PRICES_URL = process.env.REACT_APP_PRICES_URL;
const fetchRequest = axios.create({
  baseURL: PRICES_URL,
});

export default fetchRequest;
