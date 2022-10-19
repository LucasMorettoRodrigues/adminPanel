import { NotificationsService } from "../../services/NotificationsService";

import { v4 as uuid } from "uuid";
import { ProductsService } from "../../services/ProductsService";

export default async function handler(req, res) {
  const body = req.body;

  console.log(body.charges[body.charges.length - 1].status);

  if (body.charges[body.charges.length - 1].status !== "PAID") {
    res.status(200).send();
    return;
  }

  // Get Products and Update Stock
  const productsService = new ProductsService();

  const getProductsResponse = await productsService.getAll();
  const products = Object.values(getProductsResponse.data);

  for (let item in body.items) {
    const product = products.find((product) => product.id === item.reference_id);
    await productsService.update(item.reference_id, { quantity: product.stock - item.quantity });
  }

  // Create Notification in Firebase
  const notificationsService = new NotificationsService();
  const notification = await notificationsService.put(uuid(), body);

  console.log("notification: ", notification);

  res.status(200).send();
}
