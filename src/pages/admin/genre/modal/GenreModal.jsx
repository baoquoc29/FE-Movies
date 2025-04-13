import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import '../GenreManagement.scss';

const GenreModal = ({ open, onClose, onSubmit, mode = 'add', genre }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    if (mode === 'edit' && genre) {
      reset({ name: genre.name });
    } else {
      reset({ name: '' });
    }
  }, [open, mode, genre, reset]);

  const onFormSubmit = (data) => {
    const formData = mode === 'edit' ? { ...genre, ...data } : data;
    onSubmit(formData);
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        padding: '8px 16px',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {mode === 'edit' ? 'Chỉnh sửa thể loại' : 'Thêm mới thể loại'}
      </DialogTitle>

      <DialogContent sx={{ padding: '20px 12px' }}>
        <Box
          component="form"
          id="genre-form"
          onSubmit={handleSubmit(onFormSubmit)}
          sx={{ mt: 2 }}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Vui lòng nhập tên thể loại!' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label="Tên thể loại"
                placeholder="Nhập tên thể loại"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1
                  }
                }}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        padding: '8px 12px',
        paddingTop: '16px',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            px: 3
          }}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          form="genre-form"
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: 1,
            px: 3
          }}
        >
          {mode === 'edit' ? 'Lưu' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenreModal;