import { atom } from "recoil";

export const alertState = atom({
  key: "alertState",
  default: { message: "", severity: "error" },
});
