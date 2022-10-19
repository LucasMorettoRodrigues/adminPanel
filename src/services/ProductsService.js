import axios from "axios";
import { apiURL as BaseApi } from "./apiURL";

export class ProductsService {
  apiUrl = `${BaseApi}/products`;

  async getAll() {
    return await axios.get(`${this.apiUrl}.json`);
  }

  async getProduct(id) {
    return await axios.get(`${this.apiUrl}/${id}.json`);
  }

  async put(id, product) {
    return await axios.put(`${this.apiUrl}/${id}.json`, product);
  }

  async update(id, body) {
    return await axios.patch(`${this.apiUrl}/${id}.json`, body);
  }

  async delete(id) {
    return await axios.delete(`${this.apiUrl}/${id}.json`);
  }
}
