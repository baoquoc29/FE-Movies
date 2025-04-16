import React, { useState, useEffect } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    IconButton,
    Box,
} from '@mui/material';
import { FaEdit, FaPlay, FaPlus, FaTrash } from 'react-icons/fa';
import { episodeService } from '../../../../Service/EpisodeService';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

const EpisodeManagement = ({ movie }) => {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [episodePreview, setEpisodePreview] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [episodeToDelete, setEpisodeToDelete] = useState(null);
    const { 
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            episodeNumber: '',
            videoUrl: ''
        }
    });

    useEffect(() => {
        fetchEpisodes();
    }, []);

    const fetchEpisodes = async () => {
        setLoading(true);
        try {
            const response = await episodeService.episodeDetail(movie.slug);
            if (response.code === 200) {
                setEpisodes(response.data);
            } else {
                console.error('Failed to fetch episodes:', response.message);
            }
        } catch (error) {
            console.error('Failed to fetch episodes');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (episode) => {
        setEpisodePreview(episode);
    };

    const handleAdd = () => {
        setCurrentEpisode(null);
        reset({ episodeNumber: '', videoUrl: '' });
        setIsDialogOpen(true);
    };

    const handleEdit = (episode) => {
        setCurrentEpisode(episode);
        reset({
            episodeNumber: episode.episodeNumber,
            videoUrl: episode.videoUrl
        });
        setIsDialogOpen(true);
    };

    const confirmDelete = (episode) => {
        setEpisodeToDelete(episode);
        setDeleteDialogOpen(true);
    };
    
    const handleDelete = async () => {
        if (!episodeToDelete) return;
        try {
            const response = await episodeService.deleteEpisode(episodeToDelete.id);
            if (response.code === 200) {
                fetchEpisodes();
                toast.success('Xóa tập phim thành công!');
            }else{
                toast.error(response.message);
            }

        } catch (error) {
            console.error('Failed to delete episode');
            toast.error('Xóa tập phim thất bại!');
        } finally {
            setDeleteDialogOpen(false);
            setEpisodeToDelete(null);
        }
    };
    const onSubmit = async (data) => {
        const episodeData = { ...data, movieId: movie.id };
        try {
            if (currentEpisode) {
                const response = await episodeService.updateEpisode(currentEpisode.id, episodeData);
                if (response.code === 200) {
                    fetchEpisodes();
                    toast.success('Cập nhật tập phim thành công!');
                    fetchEpisodes();
                    setIsDialogOpen(false);

                }else {
                    toast.error(response.message);
                }

            } else {
                const response = await episodeService.createEpisode(episodeData);
                if (response.code === 201) {
                    fetchEpisodes();
                    toast.success('Thêm tập phim thành công!');
                    fetchEpisodes();
                    setIsDialogOpen(false);
                }else{
                    toast.error(response.message);
                }
            }
        } catch (error) {
            console.error('Failed to save episode');
        }
    };

    return (
        <div style={{ color: 'black', padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    startIcon={<FaPlus style={{ fontSize: '0.8rem' }} />}
                    sx={{
                        textTransform: 'none',
                        '& .MuiButton-startIcon': {
                            marginRight: '4px'
                        }
                    }}
                >
                    Thêm mới
                </Button>
            </Box>
            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                bgcolor: 'primary.main',
                                '& th': {
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    textAlign: 'center',
                                }
                            }}>
                                <TableCell sx={{ width: '80px' }}>Tập số</TableCell>
                                <TableCell sx={{ width: '500px' }}>Đường dẫn</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell>Ngày cập nhật</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {episodes.map((episode, index) => (
                                <TableRow key={episode.id}>
                                    <TableCell>{episode?.episodeNumber}</TableCell>
                                    <TableCell>{episode?.videoUrl}</TableCell>
                                    <TableCell>{dayjs(episode.createdAt).format('HH:mm:ss DD/MM/YYYY')}</TableCell>
                                    <TableCell>{episode?.updatedAt ? dayjs(movie.updatedAt).format('HH:mm:ss DD/MM/YYYY') : "Đang cập nhật"}</TableCell>
                                    <TableCell>
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <IconButton size='medium' color="secondary" onClick={() => handlePreview(episode)}>
                                                <FaPlay size={16} />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                size="medium"
                                                onClick={() => handleEdit(episode)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'primary.light',
                                                        color: 'primary.contrastText'
                                                    }
                                                }}
                                            >
                                                <FaEdit size={16} />
                                            </IconButton>
                                            
                                            <IconButton
                                                color="error"
                                                size="medium"
                                                onClick={() => confirmDelete(episode)}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'error.light',
                                                        color: 'error.contrastText'
                                                    }
                                                }}
                                            >
                                                <FaTrash size={16} />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            
            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{currentEpisode ? 'Chỉnh sửa tập phim' : 'Thêm tập phim'}</DialogTitle>
                    <DialogContent>
                        <Controller
                            name="episodeNumber"
                            control={control}
                            rules={{ 
                                required: 'Tập số không được để trống',
                                min: { value: 1, message: 'Tập số phải lớn hơn 0' }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    margin="dense"
                                    label="Tập số"
                                    type="number"
                                    error={!!errors.episodeNumber}
                                    helperText={errors.episodeNumber?.message}
                                    sx={{ mb: 2 }}
                                />
                            )}
                        />
                        <Controller
                            name="videoUrl"
                            control={control}
                            rules={{ 
                                required: 'Đường dẫn không được để trống',
                                pattern: {
                                    value: /^(http|https):\/\/[^ "]+$/,
                                    message: 'Đường dẫn không hợp lệ'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    margin="dense"
                                    label="Đường dẫn video"
                                    error={!!errors.videoUrl}
                                    helperText={errors.videoUrl?.message}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setIsDialogOpen(false)}
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
                            variant="contained"
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                px: 3
                            }}
                        >
                            {currentEpisode ? 'Lưu' : 'Thêm mới'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={!!episodePreview?.videoUrl} onClose={() => setEpisodePreview(null)} maxWidth="md" fullWidth>
                <DialogTitle>Xem video</DialogTitle>
                <DialogContent>
                    {episodePreview?.videoUrl ? (
                        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                            <iframe
                                src={episodePreview.videoUrl}
                                title="Video Preview"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Box>
                    ) : (
                        <p>Đường dẫn không tồn tại</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setEpisodePreview(null)}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: 1, px: 3 }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!currentEpisode?.id && currentEpisode?.action === 'delete'} onClose={() => setCurrentEpisode(null)}>
                <DialogTitle>Xác nhận xoá</DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc chắn muốn xoá tập phim này không?</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setCurrentEpisode(null)}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: 1, px: 3 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={async () => {
                            await handleDelete(currentEpisode.id);
                            setCurrentEpisode(null);
                        }}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none', borderRadius: 1, px: 3 }}
                    >
                        Xoá
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc chắn muốn xóa tập phim <strong>{episodeToDelete?.episodeNumber}</strong> không?</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: 1, px: 3 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none', borderRadius: 1, px: 3 }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default EpisodeManagement;