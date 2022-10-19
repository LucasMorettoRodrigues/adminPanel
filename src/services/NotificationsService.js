import axios from "axios";
import { apiURL as BaseApi } from "./apiURL";

export class NotificationsService {
  apiUrl = `${BaseApi}/notifications`;

  async getAll() {
    return await axios.get(`${this.apiUrl}.json`);
  }

  async getProduct(id) {
    return await axios.get(`${this.apiUrl}/${id}.json`);
  }

  async put(id, body) {
    return await axios.put(`${this.apiUrl}/${id}.json`, body);
  }

  async delete(id) {
    return await axios.delete(`${this.apiUrl}/${id}.json`);
  }
}
