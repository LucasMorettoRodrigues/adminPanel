import { NotificationsService } from "../../services/NotificationsService";
import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  const body = req.body;

  console.log(body.charges[body.charges.length - 1].status);

  if (body.charges[body.charges.length - 1].status !== "PAID") {
    res.status(200).json({ status: "success" });
    return;
  }

  const notificationsService = new NotificationsService();
  const response = await notificationsService.put(uuid(), body);
  console.log("response: ", response);

  res.status(200).json({ body });

  // res.status(200).json({ status: "success" });
}
