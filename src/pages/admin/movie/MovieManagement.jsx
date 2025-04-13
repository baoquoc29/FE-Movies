import React, { useEffect, useState } from 'react';
import './MovieManagement.scss';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
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
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import Select from 'react-select';

import { movieService } from '../../../Service/MovieService';
import { Link } from 'react-router-dom';

const GenreManagement = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [releaseYearSelect, setReleaseYearSelect] = useState(null);
    const [countrySelect, setCountrySelect] = useState(null);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showNotification = (severity, message) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };


    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };
    const years = [
        { value: 2024, label: '2024' },
        { value: 2023, label: '2023' },
        { value: 2022, label: '2022' },
        // ...
      ];
      
      const countries = [
        { value: 'Việt Nam', label: 'Việt Nam' },
        { value: 'Hoa Kỳ', label: 'Hoa Kỳ' },
        { value: 'Hàn Quốc', label: 'Hàn Quốc' },
        // ...
      ];
    useEffect(() => {
        fetchMovies();
    }, [currentPage, pageSize, keyword, releaseYearSelect, countrySelect]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
    
            const params = new URLSearchParams();
    
            if (keyword) params.append('keyword', keyword);
            params.append('page', currentPage + 1);
            params.append('size', pageSize);
    
            if (releaseYearSelect?.value) {
                params.append('releaseYear', releaseYearSelect.value);
            }
    
            if (countrySelect?.value) {
                params.append('country', countrySelect.value);
            }
    
            const res = await movieService.adminGetAllMovie(params);
            setMovies(res.data.content || []);
            setTotalElements(res.data.totalElements || 0);
        } catch (error) {
            showNotification('error', 'Lỗi khi lấy danh sách thể loại');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="movie-container-admin">
            <div className="movie-header-admin">
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span style={{fontWeight: 'bold'}}>Home</span> 
                    <span style={{marginRight: '10px', marginLeft: '10px'}}> / </span>
                    <span style={{fontWeight: 'bold', color: '#3b82f6'}}>Danh sách phim</span>
                </div>
            </div>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={actionLoading ? <CircularProgress size={14} color="inherit" /> : <FaPlus style={{ fontSize: '0.8rem' }} />}
                    disabled={actionLoading}
                    sx={{ 
                        textTransform: 'none',
                        '& .MuiButton-startIcon': {
                            marginRight: '4px'
                        }
                    }}
                >
            <Link
                to="/admin/movies/create"
                style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    pointerEvents: actionLoading ? 'none' : 'auto',
                }}
                >
                Thêm mới
            </Link>
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
                    gap: 1,
                    flexWrap: 'wrap' // để responsive đẹp hơn nếu hẹp
                }}>
                    <TextField
                        variant="outlined"
                        placeholder="Nhập tiêu đề phim..."
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

                    <Box sx={{ minWidth: 150 }}>
                        <Select
                            placeholder="Năm phát hành"
                            options={years}
                            value={releaseYearSelect}
                            onChange={setReleaseYearSelect}
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: 8,
                                    minHeight: 40,
                                }),
                            }}
                        />
                    </Box>

                    <Box sx={{ minWidth: 150 }}>
                        <Select
                            placeholder="Quốc gia"
                            options={countries}
                            value={countrySelect}
                            onChange={setCountrySelect}
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: 8,
                                    minHeight: 40,
                                }),
                            }}
                        />
                    </Box>
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
                                    Tên phim
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Slug
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Đạo diễn
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Năm ra mắt
                                </TableCell>

                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Thể loại
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Đánh giá
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Tổng lượt xem
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center',
                                    width:100
                                }}>
                                    Thời gian mỗi tập (phút)
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
                            {!loading && movies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                        <Alert severity="info">
                                            Không có dữ liệu thể loại nào
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                movies.map((movie, index) => (
                                    <TableRow 
                                        key={movie.id}
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
                                            {movie.title}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.slug}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.director.length !== 0 ? movie.director : 'Đang cập nhật'}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.releaseYear}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.releaseYear}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.averageRating}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.viewCount}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {movie.duration}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                gap: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <IconButton
                                                    color="info"
                                                    size="medium"
                                                    disabled={actionLoading}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'info.light',
                                                            color: 'info.contrastText'
                                                        }
                                                    }}
                                                >
                                                    <FaEye size={16} />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    size="medium"
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
                                                    size="medium"
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

                {movies.length > 0 && (
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
                            '& .MuiTablePagination-toolbar': {
                                px: 0,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 1
                            }
                        }}
                    />
                )}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GenreManagement;