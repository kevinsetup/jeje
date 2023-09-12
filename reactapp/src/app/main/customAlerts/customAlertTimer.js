import { Modal, Box, Typography, Button } from '@mui/material';
import { useState, useEffect } from "react";

export function CustomAlertTimer({ open, onClose, title, message, onConfirm, autoCloseTime }) {
    const [timerActive, setTimerActive] = useState(true);

    const handleClose = () => {
      onClose();
    };
  

    useEffect(() => {
      let timeoutId;
      
      if (open && autoCloseTime > 0) {
        setTimerActive(true);
        timeoutId = setTimeout(() => {
          handleClose();
        }, autoCloseTime * 1000); // Convert autoCloseTime from seconds to milliseconds
  
        return () => {
          clearTimeout(timeoutId);
        };
      }
  
      return undefined;
    }, [open, autoCloseTime]);
  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 2,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography sx={{ mt: 2 }}>{message}</Typography>
        
      </Box>
    </Modal>
  );
}

export default CustomAlertTimer;