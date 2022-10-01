import { useRef, useState } from "react";
import { Button } from "@mui/material";

export const ImageUploader = ({ handleImage, image }) => {
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    if (fileUploaded === null) return;
    handleImage(fileUploaded);
  };

  return (
    <>
      <Button onClick={handleClick} color="primary" fullWidth variant="text">
        Escolher Imagem
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {image && (
        <div style={{ width: "300px" }}>
          <img style={{ width: "100%" }} src={image} alt="preview image" />
        </div>
      )}
    </>
  );
};
