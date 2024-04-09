import axios from "axios";

const fetchRequest = axios.create({
  baseURL: "https://interview.switcheo.com",
});

export default fetchRequest;
