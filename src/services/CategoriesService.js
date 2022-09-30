import axios from "axios";
import { apiURL as BaseApi } from "./apiURL";

export class CategoriesService {
  apiUrl = `${BaseApi}/categories`;

  async getAll() {
    return await axios.get(`${apiURL}.json`);
  }

  async getProduct(id) {
    return await axios.get(`${apiURL}/${id}.json`);
  }

  async put(id, product) {
    return await axios.put(`${apiURL}/${id}.json`, product);
  }

  async delete(id) {
    return await axios.delete(`${apiURL}/${id}.json`);
  }
}
