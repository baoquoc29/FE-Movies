import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, CardMedia, Chip, CardActions, Button } from "@mui/material";
import ResponsivePieChart from "../../../components/chart/ReponsivePieChart";
import { statisticService } from "../../../Service/StatisticService";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { BuildingIcon, CalendarIcon, Clock, FlagIcon, PlayCircleIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {

  const [barData, setBarData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [topMovies, setTopMovies] = useState([]);

  const getStatisticRevenue = async () => {
    try {
      const response = await statisticService.getStatisticRevenue();
      if (response.code === 200) {
        const data = response.data;
        let months = [];
        let values = [];
        data.forEach(item => {
          months.push(item.month);
          values.push(item.revenue);

        });
        setBarData({
          labels: months,
          values: values,
        });
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const statisticPackageVip = async () => {
    try{
      const response = await statisticService.getStatisticPackage();
      if (response.code === 200) {
        const data = response.data;
        setPieData([
          ["Gói dịch vụ", "Số lượng"], // Tiêu đề cột
          ...data.map(item => [item.vipPackageName, item.vipCount]) // Dữ liệu
        ]);
  
      }
    }catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  }

  const getMoviesTop = async () => {
    try {
      const response = await statisticService.getStatisticTopMovie();
      if (response.code === 200) {
        const data = response.data;
        console.log("Top Movies Data:", data); // Log dữ liệu top movies
        setTopMovies(data);
      }
    } catch (error) {
      console.error("Error fetching top movies:", error);
    }

  }

  useEffect(() => {
    getStatisticRevenue();
    statisticPackageVip()
    getMoviesTop();
  }, []);

  const options = {
    chartArea: {
      width: "100%",   // Chiếm 100% chiều rộng khả dụng
      height: "90%",   // Chiếm 90% chiều cao
      bottom: 30,         // Khoảng cách từ trên xuống
    },
    legend: {
      position: "bottom", // Vị trí legend: 'top', 'bottom', 'left', 'right'
      alignment: "center", // Căn giữa legend
      textStyle: {
        fontSize: 12,
        maxLines: 3 // Giới hạn số dòng, nếu dài sẽ tự động xuống dòng
      }
    },
  };
  const truncateText = (text, maxLength) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }
  const stripHtmlTags = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || ""; // Lấy nội dung văn bản thuần túy
  };
  return (
    <div className="admin-dashboard-container" style={{ padding: "20px", color: "black" }}>
      <Typography sx={{fontSize: 20, fontWeight: 600}} gutterBottom>
        Dashboard
      </Typography>

      {/* Biểu đồ */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        {/* Biểu đồ cột */}
        <Box sx={{ 
              flex: 1, 
              minWidth: "300px", 
              backgroundColor: "white", 
              padding:3, 
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: 2, // Bo góc
              height: '400px'
              }}>
          <Typography variant="h6" gutterBottom>
            Doanh thu hàng tháng
          </Typography>
          {barData && (
            <Bar
              data={{
                labels: barData.labels,
                datasets: [
                  {
                    label: "Doanh thu",
                    backgroundColor: "#3498db",
                    data: barData.values,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                title: {
                  display: true,
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                    },
                    ticks: {
                      font: {
                        size: 10, // Giảm kích thước font của nhãn trục x
                      },
                      maxRotation: 45, // Xoay nhãn trục x để tránh tràn
                      minRotation: 0, // Giữ nhãn không bị xoay quá nhiều
                    },
                  },
                  y: {
                    title: {
                      display: true,
                    },
                    ticks: {
                      font: {
                        size: 10, // Kích thước font của nhãn trục y
                      },
                    },
                  },
                },
              }}
              />
          )}
        </Box>

        {/* Biểu đồ tròn */}
        <Box sx={{ 
          flex: 1, 
          minWidth: "300px", 
          backgroundColor: "white", 
          padding: 3, 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 2,
          height: '400px' // Đặt chiều cao cố định hoặc sử dụng flex/grid để điều chỉnh
        }}>
          <Typography variant="h6" gutterBottom>
            Các gói vip
          </Typography>
          {
            pieData && pieData.length > 0 ? (
              <ResponsivePieChart 
                data={pieData} 
                options={options} 
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Không có dữ liệu để hiển thị
              </Typography>
            )
          }
        </Box>
      </Box>

      {/* Top 10 phim */}
      <Box
        sx={{
          backgroundColor: "white", // Nền trắng
          borderRadius: 2, // Bo góc
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Đổ bóng
          padding: 3, // Khoảng cách bên trong
        }}
      >
        <Typography variant="h6" gutterBottom>
          Top 10 phim có lượng xem nhiều nhất
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',    // grid-cols-1
            sm: 'repeat(2, 1fr)',     // sm:grid-cols-2
            md: 'repeat(3, 1fr)',     // md:grid-cols-3
            lg: 'repeat(4, 1fr)',     // lg:grid-cols-4
            xl: 'repeat(5, 1fr)'      // xl:grid-cols-5
          },
          gap: 2,                    // gap-4 (16px) - MUI theme spacing 1 = 8px
        }}>
          {topMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    aspectRatio: "2/3",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={movie.thumbnailUrl || require("../../../assets/no_image.png")}
                    alt={movie.title}
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                  <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                    <Chip
                      icon={<StarIcon style={{ color: "#fdd835", fill: "#fdd835" }} />}
                      label={movie.averageRating.toFixed(1)}
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.7)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.8)",
                        },
                      }}
                    />
                  </Box>
                  {movie.episodeCount > 1 && (
                    <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
                      <Chip
                        icon={<PlayCircleIcon />}
                        label={`${movie.episodeCount} tập`}
                        variant="outlined"
                        sx={{
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          border: "none",
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3" noWrap title={movie.title}>
                      {movie.title}
                    </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 1,
                      color: "text.secondary",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CalendarIcon sx={{ fontSize: "small", mr: 0.5 }} />
                      <Typography variant="caption" sx={{ml:0.5}}>{movie.releaseYear}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Clock sx={{ fontSize: "small", mr: 0.5 }} />
                      <Typography variant="caption" sx={{ml:0.5}}>{movie.duration} phút</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {movie.genres.slice(0, 3).map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        size="small"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ))}
                    {movie.genres.length > 3 && (
                      <Chip
                        label={`+${movie.genres.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={stripHtmlTags(movie.description)}
                      dangerouslySetInnerHTML={{ __html: movie.description }}
                    />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mt: 1.5,
                      color: "text.secondary",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FlagIcon sx={{ fontSize: "small", mr: 0.5 }} />
                      <Typography variant="caption">{movie.country}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BuildingIcon sx={{ fontSize: "small", mr: 0.5 }} />
                      <Typography variant="caption">
                        {truncateText(movie.publisher, 10) ? truncateText(movie.publisher, 10) : "Đang cập nhật"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    pt: 0,
                  }}
                >
                  <Chip
                    label={movie.status === "ongoing" ? "Sắp chiếu" : movie.status === "completed" ? "Đã hoàn thành" : "Đang ra"}
                    sx={{
                      backgroundColor: movie.status === "completed" ? "green" : movie.status === "ongoing" ? "orange" : "blue",
                      color: "white",
                    }}
                  />
                  <Button size="small" variant="outlined">
                    <Link to={`/admin/movies/detail/${movie.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      Xem chi tiết
                    </Link>
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default AdminDashboard;