import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import './AdminMovieDetail.scss';
import MovieDetailTab from "./MovieDetailTab";
import { useParams, useSearchParams } from "react-router-dom";
import { movieService } from "../../../../Service/MovieService";
import { toast } from "react-toastify";
import UpdateMovie from "../update/UpdateMovie";
import EpisodeManagement from "../eposode/EpisodeManagement";
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AdminMoviePage() {
  const [tab, setTab] = React.useState(0);
  const [movie, setMovie] = useState({});
  const {slug} = useParams();
  const [searchParams] = useSearchParams();

  const action = searchParams.get('action');

  const getDetailMovie = async () => {
    try{
      const response = await movieService.movieDetail(slug);
      if(response.code === 200){
        setMovie(response.data);
      }else {
        toast.error("Phim không tồn tại trong hệ thống");
      }
    }catch(error){
      toast.error("Lỗi vui lòng kiểm tra lại kết nối")
    }
  }

  useEffect(() => {
    getDetailMovie();
  }, []);
  useEffect(() => {
      if (action === 'edit') {
        setTab(1); // Chuyển sang tab "Chỉnh sửa"
      }
  }, [action]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };
  
  return (
    <Box sx={{ width:'100%', mt: 4, backgroundColor:'white', minHeight: '100vh' }}>
      <div className="movie-header-admin-detail" >
          <div style={{display: 'flex', flexDirection: 'row'}}>
              <span style={{fontWeight: 'bold'}}>Home</span> 
              <span style={{marginRight: '10px', marginLeft: '10px'}}> / </span>
              <span style={{fontWeight: 'bold', color: '#3b82f6'}}>Chi tiết phim</span>
          </div>
      </div>
      {/* Tabs nằm dưới */}
      <Tabs
        value={tab}
        onChange={handleChange}
        centered
        variant="fullWidth"
        sx={{
          border: "1px solid #e0e0e0",
          mx: 4,
          color: "black",
        }}
      >
        <Tab label="Chi tiết" sx={{ textTransform: "none" }} />
        <Tab label="Chỉnh sửa" sx={{ textTransform: "none" }} />
        <Tab label="Tập phim" sx={{ textTransform: "none" }} />

      </Tabs>

      {/* Nội dung tab tương ứng */}
      <TabPanel value={tab} index={0}>
        <Box  sx={{mx: 2, color: 'black'}}>
        {movie?.id ? (
          <MovieDetailTab movie={movie} />
        ) : (
          <Typography>Đang tải thông tin phim...</Typography>
        )}
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1} sx={{mx: 4, color: 'black'}}>
        <UpdateMovie movie={movie}/>
      </TabPanel>
      <TabPanel value={tab} index={2} sx={{mx: 4, color: 'black'}}>
        <EpisodeManagement movie={movie}/>
      </TabPanel>
    </Box>
  );
}
