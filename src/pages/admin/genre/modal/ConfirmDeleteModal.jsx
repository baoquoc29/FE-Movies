import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';

const ConfirmDeleteModal = ({ open, onConfirm, onCancel, itemName = 'mục này' }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.25rem',
        fontWeight: 600,
        paddingTop: '5px',
        paddingBottom: '10px',
        paddingLeft: 0,
        paddingRight: 0,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        Xác nhận xoá
      </DialogTitle>

      <DialogContent sx={{ 
        padding: '15px 0px', // 15px trên dưới, 0px trái phải
        }}>
            <DialogContentText sx={{
                marginTop: '15px',         // Bỏ margin mặc định
            }}>
                Bạn có chắc chắn muốn xoá <Typography component="span" fontWeight="600">{itemName}</Typography> không?
            </DialogContentText>
        </DialogContent>

      <DialogActions sx={{
        padding: '0px 0px 12px 0px',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button 
          onClick={onCancel}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            px: 3,
            mt: 3
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            px: 3,
            mt: 3,
            '&:hover': {
              backgroundColor: 'error.dark'
            }
          }}
        >
          Xoá
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;