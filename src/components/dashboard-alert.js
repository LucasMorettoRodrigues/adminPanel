import { Alert, Collapse } from "@mui/material";
import { useEffect, useState } from "react";

export const DashBoardAlert = () => {
  const [alert, setAlert] = useState({ message: "", severity: "error" });
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
        <Alert variant="filled" severity={alert.severity}>
          {alert.message}
        </Alert>
      </Collapse>
    </div>
  );
};
