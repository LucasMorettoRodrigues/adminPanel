import { NotificationsService } from "../../services/NotificationsService";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  const body = req.body;

  const notificationsService = new NotificationsService();

  notificationsService.put(uuid(), body);

  res.status(200).json({ body });

  // if (body.charges[body.charges.length - 1].status !== "PAID") {
  //   res.status(200).json({ status: "success" });
  //   return;
  // }

  // res.status(200).json({ status: "success" });
}
