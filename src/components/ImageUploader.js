import { useRef } from "react";
import { Button, Grid } from "@mui/material";

export const ImageUploader = ({ handleImage, localImages, storageImages, deleteImage }) => {
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
        Adicionar Imagem
      </Button>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          {storageImages &&
            storageImages.length > 0 &&
            storageImages.map((image, index) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  border: "1px solid lightgray",
                  borderRadius: "10px",
                  margin: "15px",
                }}
              >
                <div
                  style={{ width: "140px", height: "140px", display: "flex", alignItems: "center" }}
                >
                  <img
                    style={{ width: "100%", objectFit: "contain" }}
                    src={image}
                    alt="preview image"
                  />
                </div>
                <Grid
                  item
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={(e) => deleteImage(e, "storage", image)}
                    sx={{ p: 0, color: "#D14343;" }}
                  >
                    Remover
                  </Button>
                </Grid>
              </div>
            ))}
        </div>
        <div style={{ display: "flex" }}>
          {localImages.length > 0 &&
            localImages.map((image, index) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  border: "1px solid lightgray",
                  borderRadius: "10px",
                  margin: "15px",
                }}
              >
                <div
                  style={{ width: "140px", height: "140px", display: "flex", alignItems: "center" }}
                >
                  <img
                    style={{ width: "100%", objectFit: "contain" }}
                    src={image.url}
                    alt="preview image"
                  />
                </div>
                <Grid
                  item
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={(e) => deleteImage(e, "local", image.url)}
                    sx={{ p: 0, color: "#D14343;" }}
                  >
                    Remover
                  </Button>
                </Grid>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
