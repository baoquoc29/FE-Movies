import React, { useEffect, useState } from 'react';
import { FiSearch } from "react-icons/fi";
import { MdLockOutline, MdLockOpen } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  TablePagination,
  Box,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userService } from '../../../Service/UserService';
import dayjs from 'dayjs';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const blockUser = async (user) => {
        try {
            setActionLoading(true);
            const res = await userService.blockUser(user.id);
            if(res.code === 200){
                toast.success(user.isBlocked ? 'Mở khóa tài khoản người dùng thành công' : 'Khóa tài khoản người dùng thành công');
                fetchUsers();
            }else{
                toast.error('error', 'Lỗi khi khóa người dùng');
            }
        } catch (error) {
            toast.error('error', 'Lỗi khi khóa người dùng');
        } finally {
            setActionLoading(false);
        }
    }
    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize, keyword]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
    
            const res = await userService.adminGetAllUser(keyword, currentPage+1, pageSize);
            if(res.code === 200){
                setUsers(res.data.content || []);
                setTotalElements(res.data.totalElements || 0);
            }else{
                toast.error('error', 'Lỗi khi lấy danh sách thể loại');
            }

        } catch (error) {
            toast.error('error', 'Lỗi khi lấy danh sách thể loại');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="movie-container-admin">
            <div className="movie-header-admin">
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <span style={{fontWeight: 'bold'}}>Dashboard</span> 
                    <span style={{marginRight: '10px', marginLeft: '10px'}}> / </span>
                    <span style={{fontWeight: 'bold', color: '#3b82f6'}}>Danh sách người dùng</span>
                </div>
            </div>

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
                        placeholder="Nhập tên người dùng, tài khoản, email ..."
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
                                    width: 30,
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
                                    Tên người dùng
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Tài khoản
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Giới tính
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Ngày sinh
                                </TableCell>

                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Số dư
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Ngày tạo
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center'
                                }}>
                                    Ngày cập nhật
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center',
                                }}>
                                    Ngày hết hạn gói vip
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                                    textAlign: 'center',
                                }}>
                                    Trạng thái
                                </TableCell>
                                <TableCell sx={{ 
                                    color: 'common.white',
                                    textAlign: 'center',
                                    width: 100
                                }}>
                                    Hành động
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loading && users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                        <Alert severity="info">
                                            Không có dữ liệu thể loại nào
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user, index) => (
                                    <TableRow 
                                        key={user.id}
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
                                            {user.fullName}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.username}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.email}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user?.gender === 0 ? 'Nam': user.gender === 1 ? 'Nữ' : 'Khác'}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : 'Đang cập nhật'}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.balance ? user.balance : 0} VNĐ
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {dayjs(user.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.updatedAt ? dayjs(user.updatedAt).format('HH:mm:ss DD/MM/YYYY') : 'Đang cập nhật'}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.vipExpiry ?  dayjs(user.vipExpiry).format('DD/MM/YYYY') : 'Đang cập nhật'}
                                        </TableCell>
                                        <TableCell sx={{ 
                                            borderRight: '1px solid',
                                            borderRightColor: 'divider'
                                        }}>
                                            {user.isBlocked ? 'Đã khóa' : 'Đang hoạt động'} 
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
                                                    size="medium"
                                                    disabled={actionLoading}
                                                    component={Link}
                                                    onClick={() => blockUser(user)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: 'primary.light',
                                                            color: 'primary.contrastText'
                                                        }
                                                    }}
                                                >
                                                    {user.isBlocked ? (<MdLockOpen size={16} />) : (<MdLockOutline size={16} />)}
                                                    
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {users.length > 0 && (
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
        </div>
    );
};

export default UserManagement;