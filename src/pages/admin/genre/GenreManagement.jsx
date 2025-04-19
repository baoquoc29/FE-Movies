import React, { useEffect, useState } from 'react';
import './GenreManagement.scss';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { FiSearch } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  TablePagination,
  Box,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import GenreModal from "./modal/GenreModal";
import { genreService } from "../../../Service/GenreService";
import ConfirmDeleteModal from './modal/ConfirmDeleteModal';
import { toast } from 'react-toastify';

const GenreManagement = () => {
    const [genres, setGenres] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const openAddModal = () => {
        setModalMode('add');
        setSelectedGenre(null);
        setModalOpen(true);
    };

    const openEditModal = (genre) => {
        setModalMode('edit');
        setSelectedGenre(genre);
        setModalOpen(true);
    };

    const addGenre = async (genre) => {
        try {
            setActionLoading(true);
            const res = await genreService.createGenre(genre);
            if(res.code === 201){
                toast.success('Thêm thể loại thành công');
                fetchGenres();
            } else if (res.code === 401){
                toast.error('Vui lòng đăng nhập');
            } else if (res.code === 400) {
                toast.error(res.message);
            }
        } catch (e) {
            toast.error('Lỗi mạng');
        } finally {
            setActionLoading(false);
            setModalOpen(false);
        }
    };

    const updateGenre = async (genre) => {
        try {
            setActionLoading(true);
            const res = await genreService.updateGenre(genre);
            if(res.code === 200){
                toast.success('Cập nhật thể loại thành công');
                fetchGenres();
            } else if (res.code === 401){
                toast.error('Vui lòng đăng nhập');
            } else if (res.code === 400) {
                toast.error(res.message);
            }
        } catch (e) {
            toast.error('Lỗi khi cập nhật thể loại');
        } finally {
            setActionLoading(false);
            setModalOpen(false);
        }
    };

    const handleSubmit = (genre) => {
        if (modalMode === 'add') {
            addGenre(genre);
        } else {
            updateGenre(genre);
        }
    };

    const showDeleteConfirm = (genre) => {
        setDeleteTarget(genre);
        setDeleteModalOpen(true);
    };
    
    const confirmDelete = async () => {
        try {
            setActionLoading(true);
            const res = await genreService.deleteGenre(deleteTarget.id);
            if(res.code === 200){
                toast.success('Đã xoá thể loại thành công');
                fetchGenres();
            } else if (res.code === 401){
                toast.error('Bạn không có quyền');
            } else if (res.code === 400) {
                toast.error(res.message);
            }
        } catch (e) {
            toast.error('Lỗi khi xoá thể loại');
        } finally {
            setActionLoading(false);
            setDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    useEffect(() => {
        fetchGenres();
    }, [currentPage, pageSize, keyword]);

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const res = await genreService.getAllGenres(keyword, currentPage + 1, pageSize);
            setGenres(res.data.content || []);
            setTotalElements(res.data.totalElements || 0);
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách thể loại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="genre-container-admin">
            <div className="genre-header-admin">
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span style={{fontWeight: 'bold'}}>Dashboard</span> 
                    <span style={{marginRight: '10px', marginLeft: '10px'}}> / </span>
                    <span style={{fontWeight: 'bold', color: '#3b82f6'}}>Danh sách thể loại</span>
                </div>
            </div>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={actionLoading ? <CircularProgress size={14} color="inherit" /> : <FaPlus style={{ fontSize: '0.8rem' }} />}
                    onClick={openAddModal}
                    disabled={actionLoading}
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

            <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
                backgroundColor: 'background.paper'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    gap: 1
                }}>
                    <TextField
                        variant="outlined"
                        placeholder="Nhập tên thể loại..."
                        size="small"
                        fullWidth
                        onChange={(e) => setKeyword(e.target.value)}
                        sx={{ 
                            maxWidth: 400,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: 'background.default'
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiSearch style={{ color: 'action.active' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <TableContainer 
                    component={Paper}
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 'none',
                        position: 'relative',
                    }}
                >
                    {loading && (
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            zIndex: 1
                        }}>
                            <CircularProgress />
                        </Box>
                    )}

                    <Table>
                        <TableHead>
                            <TableRow sx={{ 
                                bgcolor: 'primary.main',
                                '& th': {
                                    py: 1.5,
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }
                            }}>
                                <TableCell sx={{ 
                                    width: 80,
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    STT
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Tên thể loại
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    textAlign: 'center',
                                    width: 120
                                }}>
                                    Hành động
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loading && genres.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                        <Alert severity="info">
                                            Không có dữ liệu thể loại nào
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                genres.map((genre, index) => (
                                    <TableRow 
                                        key={genre.id}
                                        hover
                                        sx={{ 
                                            '&:last-child td': { borderBottom: 0 },
                                            '&:nth-of-type(even)': { 
                                                backgroundColor: 'action.hover' 
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ 
                                            width: 80,
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider',
                                            textAlign: 'center'
                                        }}>
                                            {(currentPage * pageSize) + index + 1}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {genre.name}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                gap: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => openEditModal(genre)}
                                                    size="small"
                                                    disabled={actionLoading}
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
                                                    onClick={() => showDeleteConfirm(genre)}
                                                    size="small"
                                                    disabled={actionLoading}
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {genres.length > 0 && (
                    <TablePagination
                        component="div"
                        count={totalElements}
                        page={currentPage}
                        onPageChange={handleChangePage}
                        rowsPerPage={pageSize}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) => 
                            `${from}-${to} của ${count} thể loại`
                        }
                        sx={{
                            mt: 2,
                            '& .MuiInputBase-root': {
                                border: '1px solid', // Thêm viền cho phần tử bọc ngoài
                                borderColor: 'divider', // Màu viền từ theme
                                borderRadius: '4px', // Bo góc
                                padding: '4px 8px', // Khoảng cách bên trong
                                outline: 'none', // Loại bỏ viền mặc định của trình duyệt
                                boxShadow: 'none', // Loại bỏ shadow mặc định
                            },
                            '& .MuiSelect-select': {
                                border: 'none', // Loại bỏ viền của phần tử bên trong
                                padding: '0', // Khoảng cách bên trong
                                appearance: 'none', // Loại bỏ mũi tên mặc định
                            },
                            '& .MuiInputBase-root:hover': {
                                borderColor: 'primary.main', // Thay đổi màu viền khi hover
                            },
                            '& .MuiInputBase-root:focus-within': {
                                borderColor: 'primary.main', // Thay đổi màu viền khi focus
                            },
                            '& .MuiTablePagination-toolbar': {
                                px: 0,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 1,
                            },
                        }}
                    />
                )}
            </Paper>

            <GenreModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                mode={modalMode}
                genre={selectedGenre}
                loading={actionLoading}
            />

            <ConfirmDeleteModal
                open={deleteModalOpen}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                itemName={deleteTarget?.name}
                loading={actionLoading}
            />
        </div>
    );
};

export default GenreManagement;