import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export function CustomAlert({ open, onClose, title, message, onConfirm }) {
  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <Typography align="center" variant="h6" component="div">
          {title}
        </Typography>
        <Typography align="center" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleConfirm}
            sx={{ mr: 1 }}
            variant="contained"
            color="success"
          >
            Confirmar
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export function CustomAlertNoBtns({ open, onClose, title, message }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <Typography align="center" variant="h6" component="div">
          {title}
        </Typography>
        <Typography align="center" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Modal>
  );
}

export function CustomAlertInput({
  open,
  onClose,
  title,
  message,
  label,
  onConfirm,
}) {
  const [textValue, setTextValue] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(textValue); // Pasar el valor de justificación al componente padre
    handleClose();
  };

  const handleInputChange = (event) => {
    setTextValue(event.target.value);
  };

  const isConfirmButtonDisabled = textValue.trim() === "";

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        <Typography align="center" variant="h6" component="div">
          {title}
        </Typography>
        <Typography align="center" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <TextField
          label={label} // Usar el label pasado como parámetro
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={textValue}
          onChange={handleInputChange}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="success"
            disabled={isConfirmButtonDisabled}
            sx={{ mr: 1 }}
          >
            Confirmar
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export function CustomAlertImage({ open, onClose, photo }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 2,
        }}
      >
        {photo && (
         <div className="flex justify-center">
           <img src={photo} alt="Preview" className="w-[300px] h-[300px]" />
         </div>
        )}
        {!photo && (
          <>
            <Typography align="center" variant="h6" component="div">
              ¡Alerta!
            </Typography>
            <Typography align="center" sx={{ mt: 2 }}>
              Este producto no tiene imagen.
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default CustomAlert;
