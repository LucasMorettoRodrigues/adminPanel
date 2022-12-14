import { NotificationsService } from "../../services/NotificationsService";

import { v4 as uuid } from "uuid";
import { ProductsService } from "../../services/ProductsService";

export default async function handler(req, res) {
  const body = req.body;

  if (body.charges[body.charges.length - 1].status !== "PAID") {
    res.status(200).send();
    return;
  }

  // Get Products and Update Stock
  const productsService = new ProductsService();

  const getProductsResponse = await productsService.getAll();
  const products = Object.values(getProductsResponse.data);

  for (let item of body.items) {
    const product = products.find((product) => product.id === item.reference_id);

    console.log("Atualizando Stock do Produto: ", product.name);
    try {
      await productsService.update(item.reference_id, { stock: product.stock - item.quantity });
      console.log(
        "Stock (anterior):",
        product.stock,
        "Stock (atualizado):",
        product.stock - item.quantity
      );
    } catch (error) {
      console.log("Erro: Atualização interrompida.");
    }
  }

  // Create Notification in Firebase
  const notificationsService = new NotificationsService();
  const notification = await notificationsService.put(uuid(), body);

  res.status(200).send();
}
