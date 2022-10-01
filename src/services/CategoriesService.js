import axios from "axios";
import { apiURL as BaseApi } from "./apiURL";

export class CategoriesService {
  apiUrl = `${BaseApi}/categories`;

  async getAll() {
    return await axios.get(`${this.apiUrl}.json`);
  }

  async getCategory(id) {
    return await axios.get(`${this.apiUrl}/${id}.json`);
  }

  async put(id, category) {
    return await axios.put(`${this.apiUrl}/${id}.json`, category);
  }

  async delete(id) {
    return await axios.delete(`${this.apiUrl}/${id}.json`);
  }
}
