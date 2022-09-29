import { Alert, Collapse } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { alertState } from "../atoms/alertState";

export const DashBoardAlert = () => {
  const alert = useRecoilValue(alertState);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    alert.message && setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }, [alert]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0px",
        left: "0px",
        zIndex: 10000,
        margin: "30px",
      }}
    >
      <Collapse orientation="horizontal" in={showAlert}>
        <Alert style={{ whiteSpace: "nowrap" }} variant="filled" severity={alert.severity}>
          {alert.message}
        </Alert>
      </Collapse>
    </div>
  );
};
