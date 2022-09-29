import axios from "axios";
import { apiURL } from "./apiURL";

export class productsService {
  async getAll() {
    return await axios.get(`${apiURL}/products.json`);
  }

  async getProduct(id) {
    return await axios.get(`${apiURL}/products/${id}.json`);
  }

  async put(id, product) {
    return await axios.put(`${apiURL}/products/${id}.json`, product);
  }

  async delete(id) {
    return await axios.delete(`${apiURL}/products/${id}.json`);
  }
}
