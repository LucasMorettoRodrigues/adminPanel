import axios from "axios";
import { apiURL as BaseApi } from "./apiURL";

export class CategoriesService {
  apiUrl = `${BaseApi}/categories`;

  async getAll() {
    return await axios.get(`${this.apiUrl}.json`);
  }

  async getProduct(id) {
    return await axios.get(`${this.apiUrl}/${id}.json`);
  }

  async put(id, product) {
    return await axios.put(`${this.apiUrl}/${id}.json`, product);
  }

  async delete(id) {
    return await axios.delete(`${this.apiUrl}/${id}.json`);
  }
}
