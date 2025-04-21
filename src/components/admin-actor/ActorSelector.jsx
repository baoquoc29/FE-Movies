import { useEffect, useState } from "react"
import { Add, Close, Person } from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from "@mui/material"
import styles from "./ActorSelector.module.scss"
import { movieService } from "../../Service/MovieService"

export function ActorSelector({ actors, onChange }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [newActor, setNewActor] = useState({
    id: null,
    name: "",
    gender: null,
    bio: "",
    birthDate: "",
    profile: null, // File
    roleName: ""
  });
  const [searchTerm, setSearchTerm] = useState("")
  const [existingActors, setExistingActors] = useState([])
  const [touched, setTouched] = useState({
    name: false,
  });
  useEffect(() => {
    getAllActorNoPage();
  }, [])

  const getAllActorNoPage = async () => {
      try {
          const response = await movieService.getAllActorNoPage()
          if (response) {
              setExistingActors(response.data)
          }
      } catch (error) {
          console.error("Error fetching actors:", error)
      }
  }

  const handleAddActor = () => {
    if (!newActor.name) {
      setTouched(prev => ({ ...prev, name: true })); // Hiển thị lỗi nếu chưa nhập
      return;
    }
    if (newActor.name.trim()) {
      console.log("Adding new actor:", newActor)
      onChange([...actors, { ...newActor }])
      setNewActor({
        id: null,
        name: "",
        gender: null,
        bio: "",
        birthDate: "",
        profile: null, // File
        roleName: ""
      })
      setTouched({
        name: false
      });
      setIsAddDialogOpen(false)
    }
  }

  const handleSelectActor = (actor) => {
    onChange([...actors, { 
        id: actor.id, 
        name: actor.name,
        profileUrl: actor.profileUrl,
        roleName: "", // Thay character bằng roleName
    }])
    setIsSelectDialogOpen(false)
    setSearchTerm("")
}

  const handleRemoveActor = (index) => {
    const updatedActors = [...actors]
    updatedActors.splice(index, 1)
    onChange(updatedActors)
  }

  const handleUpdateRoleName = (index, roleName) => {
    const updatedActors = [...actors]
    updatedActors[index] = { ...updatedActors[index], roleName: roleName }
    onChange(updatedActors)
  }

  const filteredActors = existingActors.filter(
    (actor) => actor.name.toLowerCase().includes(searchTerm.toLowerCase()) && !actors.some((a) => a.id === actor.id),
  )
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setNewActor({
      name: "",
      gender: null,
      bio: "",
      birthDate: "",
      roleName: "",
      profile: undefined,
    });
    setTouched({
      name: false,
    });
  };
  return (
    <div className={styles.actorSelector}>
      <div className={styles.buttonGroup}>
      <Dialog
          open={isAddDialogOpen}
          onClose={handleCloseDialog}>
          <DialogTitle>Thêm diễn viên mới</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Box className={styles.formFields}>
              {/* Tên diễn viên (required) */}
              <TextField
                label="Tên diễn viên"
                value={newActor.name}
                onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                onBlur={() => setTouched(prev => ({ ...prev, name: true }))} // Đánh dấu đã chạm vào
                placeholder="Nhập tên diễn viên"
                fullWidth
                margin="dense"
                error={touched.name && !newActor.name} // Chỉ hiển thị lỗi sau khi chạm
                helperText={touched.name && !newActor.name ? "Tên diễn viên là bắt buộc" : ""}
              />


              {/* Giới tính */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="gender-label">Giới tính</InputLabel>
                <Select
                  labelId="gender-label"
                  value={newActor.gender ?? ""}
                  label="Giới tính"
                  onChange={(e) =>
                    setNewActor({ 
                      ...newActor, 
                      gender: e.target.value === "" ? null : Number(e.target.value) 
                    })
                  }
                >
                  <MenuItem value={1}>Nam</MenuItem>
                  <MenuItem value={0}>Nữ</MenuItem>
                  <MenuItem value={2}>Khác</MenuItem>
                </Select>
              </FormControl>

              {/* Tiểu sử */}
              <TextField
                label="Tiểu sử"
                value={newActor.bio || ""}
                onChange={(e) => setNewActor({ ...newActor, bio: e.target.value })}
                placeholder="Nhập tiểu sử diễn viên"
                fullWidth
                multiline
                rows={3}
                margin="dense"
              />

              {/* Ngày sinh */}
              <TextField
                label="Ngày sinh"
                type="date"
                value={newActor.birthDate || ""}
                onChange={(e) => setNewActor({ ...newActor, birthDate: e.target.value })}
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0] // Ngày không vượt quá hiện tại
                }}
              />

              {/* Tên nhân vật */}
              <TextField
                label="Tên nhân vật"
                value={newActor.roleName || ""}
                onChange={(e) => setNewActor({ ...newActor, roleName: e.target.value })}
                placeholder="Nhập tên nhân vật"
                fullWidth
                margin="dense"
              />

              {/* Ảnh đại diện */}
              <Box sx={{ mt: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Tải ảnh đại diện
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewActor({ 
                          ...newActor, 
                          profile: e.target.files[0],
                          profileUrl: URL.createObjectURL(e.target.files[0]) 
                        });
                      }
                    }}
                  />
                </Button>
                <FormHelperText>Ảnh JPG/PNG, kích thước tối đa 5MB</FormHelperText>
              </Box>

              {/* Xem trước ảnh */}
              {newActor.profile && (
                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Typography variant="caption">Xem trước ảnh</Typography>
                  <Box
                    component="img"
                    src={newActor.profileUrl}
                    alt="Ảnh đại diện"
                    sx={{
                      width: 140,
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #ccc",
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setNewActor({ 
                      ...newActor, 
                      profile: undefined,
                    })}
                  >
                    Xóa ảnh
                  </Button>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Huỷ</Button>
            <Button onClick={handleAddActor} variant="contained">Thêm diễn viên</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isSelectDialogOpen} onClose={() => setIsSelectDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>Chọn diễn viên</DialogTitle>
          <DialogContent>
            <TextField
              placeholder="Nhập tên diễn viên"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              className={styles.searchField}
            />
            <div className={styles.actorResults}>
              {filteredActors.length > 0 ? (
                <List>
                  {filteredActors.map((actor) => (
                    <ListItem key={actor.id} disablePadding>
                      <ListItemButton onClick={() => handleSelectActor(actor)}>
                        <img
                          src={actor?.profileUrl}
                          alt={actor.name}
                          style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 12 }}
                        />
                        {actor.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" className={styles.noResults}>
                  Không có diễn viên nào
                </Typography>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsSelectDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
          size="small"
        >
          Thêm diễn viên mới
        </Button>
        <Button
          variant="outlined"
          startIcon={<Person />}
          onClick={() => setIsSelectDialogOpen(true)}
          size="small"
        >
          Chọn diễn viên trong hệ thống
        </Button>
      </div>

      {actors.length > 0 ? (
        <Paper variant="outlined" className={styles.actorList}>
          <div className={styles.listHeader}>
            <div style={{width: 50}}>Ảnh</div>
            <div style={{flex: 1}}>Diễn viên</div>
            <div style={{flex:1 }}>Nhân vật</div> 
            <div style={{width: 24}}></div>
          </div>
            
          {actors.map((actor, index) => (
            <div key={index} className={styles.listItem} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 50, height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {actor.profile ? (
                  <img
                      src={URL.createObjectURL(actor.profile)}
                      alt={actor.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ): (
                  <img
                      src={actor.profileUrl}
                      alt={actor.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>{actor.name}</div>
                <TextField
                  value={actor.roleName || ""}
                  onChange={(e) => handleUpdateRoleName(index, e.target.value)}
                  placeholder="Nhập tên nhân vật"
                  size="small"
                  style={{ flex: 1 }}
                />
                <IconButton onClick={() => handleRemoveActor(index)} size="small">
                  <Close />
                </IconButton>
            </div>
          ))}
        </Paper>


      ) : (
        <Paper variant="outlined" className={styles.emptyState}>
          <Typography color="text.secondary">Không có diễn viên nào đươc thêm</Typography>
        </Paper>
      )}
    </div>
  )
}