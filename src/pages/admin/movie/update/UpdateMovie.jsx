import { useEffect, useState} from "react"
import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {z} from "zod"
import {
    Button,
    Switch,
    FormControl,
    FormHelperText,
    FormLabel,
    Box,
    Container,
    OutlinedInput,
} from "@mui/material"
import Select from "react-select"
import styles from "./UpdateMovieForm.scss"
import ImageUpload from "../../../../components/image-upload/ImageUpload"
import {ActorSelector} from "../../../../components/admin-actor/ActorSelector"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css";
import { movieService } from "../../../../Service/MovieService"
import { toast } from "react-toastify"

const statusOptions = [
    {value: "upcoming ", label: "Sắp chiếu"},
    {value: "ongoing", label: "Đang ra"},
    {value: "finish", label: "Hoàn thành"},
]

// Form schema with validation
const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(2000).optional(),
    releaseYear: z.number().min(1900).max(new Date().getFullYear() + 5).optional().nullable(),
    duration: z.number().min(1).optional().nullable(),
    publisher: z.string().optional(),
    director: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    status: z.string().optional(),
    restrictedAccess: z.boolean().default(false),
    genreIds: z.array(z.number()).min(1, "Select at least one genre"),
    isDeleteThumbnail: z.boolean().default(false),
    isDeletePoster: z.boolean().default(false),
})

const UpdateMovie = ({movie}) => {
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countries, setCountTrys] = useState([]);
    const [genres, setGenres] = useState([]);
    const [actorRequests, setActorRequests] = useState([]);

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
        register,
        setValue,
        watch
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            releaseYear: null,
            duration: null,
            publisher: "",
            director: "",
            country: "",
            status: "upcoming",
            restrictedAccess: false,
            genreIds: [],
            isDeleteThumbnail: false,
            isDeletePoster: false
        }
    })

    const fetchCountries = async () => {
        try {
            const response = await movieService.getAllCountry()
            setCountTrys(response.data)
        } catch (error) {
            console.error("Error fetching countries:", error)
        }
    }

    const fetchGenres = async () => {
        try {
            const response = await movieService.getAllGenres(1, 1000)
            setGenres(response.data.content)
        } catch (error) {
            console.error("Error fetching genres:", error)
        }
    }
    useEffect(() => {
        if (movie) {
            reset({
                title: movie.title || "",
                description: movie.description || "",
                releaseYear: movie.releaseYear || null,
                duration: movie.duration || null,
                publisher: movie.publisher || "",
                director: movie.director || "",
                country: movie.country || "",
                status: movie.status || "upcoming",
                restrictedAccess: movie.restrictedAccess || false,
                genreIds: movie.genres?.map((genre) => genre.id) || [],
            });
            setThumbnailPreview(movie.thumbnailUrl || null);
            setPosterPreview(movie.posterUrl || null);
            setActorRequests(movie.actors || []);
        }
    }, [movie, reset]);
    useEffect(() => {
        fetchCountries();
        fetchGenres();
    }, [])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const genreIds = data.genreIds || [];
            const currentGenreIds = movie.genres?.map(g => g.id) || [];
            const deleteIds = currentGenreIds.filter(id => !genreIds.includes(id));
            const addIds = genreIds.filter(id => !currentGenreIds.includes(id));
            console.log(deleteIds);
            console.log(addIds);
            const formData = new FormData()
            // Append all fields
            Object.keys(data).forEach((key) => {
                if (key === "genreIds") {
                    // Gửi các genre cần thêm
                    addIds.forEach((id, index) => {
                        formData.append(`genreAddIds[${index}]`, id);
                    });

                    // Gửi các genre cần xoá
                    deleteIds.forEach((id, index) => {
                        formData.append(`genreDeleteIds[${index}]`, id);
                    });
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
            if (posterFile) formData.append('poster', posterFile)
            // Khởi tạo rỗng nếu null để tránh lỗi
            const safeActorRequests = Array.isArray(actorRequests) ? actorRequests : [];
            const safeMovieActors = movie && Array.isArray(movie.actors) ? movie.actors : [];
            
            // Lấy danh sách ID từ actorRequests
            const actorRequestIds = safeActorRequests
                .map(actor => actor.id)
                .filter(id => id !== undefined && id !== null);
            
            // Tìm các actor trong movie.actors nhưng không có trong actorRequests
            const actorDeleteIds = safeMovieActors
                .filter(actor => !actorRequestIds.includes(actor.id))
                .map(actor => actor.id);
            
            // Append actorDeleteIds vào formData nếu có
            actorDeleteIds.forEach((id, index) => {
                formData.append(`actorDeleteIds[${index}]`, id);
            });
            
            // Append actorRequests vào formData
            safeActorRequests.forEach((actor, index) => {
                if (actor.id) formData.append(`actorRequests[${index}].id`, actor.id);
                if (actor.name) formData.append(`actorRequests[${index}].name`, actor.name);
                if (actor.gender) formData.append(`actorRequests[${index}].gender`, actor.gender);
                if (actor.bio) formData.append(`actorRequests[${index}].bio`, actor.bio);
                if (actor.birthDate) formData.append(`actorRequests[${index}].birthDate`, actor.birthDate);
                if (actor.roleName) formData.append(`actorRequests[${index}].roleName`, actor.roleName);
                if (actor.profile) {
                    formData.append(`actorRequests[${index}].profile`, actor.profile);
                }
            });
            console.log("Form submitted", Object.fromEntries(formData))
            const response = await movieService.updateMovie(movie.id, formData);
            if(response.code === 200) {
                // Chuyển hướng sang trang detail với slug phim vừa tạo
                if(response.data && response.data.slug) {
                    window.location.href = `/admin/movies/detail/${response.data.slug}`
                } 
                toast.success('Cập nhật phim thành công')
            }else if(response.code === 401) {
                toast.error('Ban không có quyền thực hiện hành động này');
            }else{
                toast.error('error', 'Cập nhật phim thất bại');
            }
        } catch (error) {
            console.error("Submission error", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const modules = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['clean'], // xóa định dạng
        ],
      };
    

    return (
        <Container maxWidth="xl" sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#fff', // Đảm bảo nền trắng
            color: '#000', // Màu chữ
        }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} style={{width: '100%'}}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '24px',
                    flex: 1
                }}>

                    <div style={{flex: 1}}>
                        <div className={styles.formSection}>

                            <FormControl fullWidth margin="normal" error={!!errors.title}>
                                <FormLabel>Tiêu đề <span style={{color: 'red'}}>*</span></FormLabel>
                                <OutlinedInput
                                    {...register('title')}
                                    placeholder="Nhập tiêu đề"
                                    sx={{height: '40px',
                                         marginTop: '2px',
                                         '&::placeholder': {
                                            color: 'rgba(0, 0, 0, 0.6)', // Màu placeholder
                                         },

                                    }}
                                />
                                {errors.title && (
                                    <FormHelperText
                                        error
                                        sx={{
                                            margin: '8px 0 0 0',
                                            lineHeight: 1.3,
                                            color: 'red',
                                        }}
                                    >
                                        {errors.title.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={!!errors.description}>
                                <FormLabel>Mô tả</FormLabel>
                                <ReactQuill
                                    theme="snow"
                                    value={watch("description")}
                                    onChange={(value) => setValue("description", value)}
                                    modules={modules}
                                    style={{ height: '220px', marginBottom: '40px' }}
                                />
                                {errors.description && (
                                    <FormHelperText>{errors.description.message}</FormHelperText>
                                )}
                            </FormControl>

                            <div style={{display: 'flex', gap: '16px'}}>
                                <div style={{flex: 1}}>
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.releaseYear}
                                    >
                                        <FormLabel>Năm ra mắt</FormLabel>
                                        <OutlinedInput
                                            type="number"
                                            {...register('releaseYear', {valueAsNumber: true})}
                                            placeholder="Nhập năm ra mắt"
                                            sx={{height: '40px', marginTop: '2px'}}
                                        />
                            {errors.releaseYear && (
                                <FormHelperText
                                    error
                                    sx={{
                                        margin: '8px 0 0 0',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {errors.releaseYear.message}
                                </FormHelperText>
                            )}
                                    </FormControl>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        error={!!errors.duration}
                                    >
                                        <FormLabel>Thời gian mỗi tập (phút)</FormLabel>
                                        <OutlinedInput
                                            type="number"
                                            {...register('duration', { valueAsNumber: true })}
                                            placeholder="Nhập thời gian mỗi tập"
                                            sx={{
                                                height: '40px',
                                                marginTop: '2px'
                                            }}
                                        />
                                        {errors.duration && (
                                            <FormHelperText
                                                error
                                                sx={{
                                                    margin: '8px 0 0 0',
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.3,
                                                }}
                                            >
                                                {errors.duration.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </div>
                            </div>


                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <FormControl fullWidth margin="normal">
                                        <FormLabel>Nhà sản xuất</FormLabel>
                                        <OutlinedInput
                                            {...register('publisher')}
                                            placeholder="Nhập tên nhà sản xuất"
                                            sx={{
                                                height: '40px',
                                                mt: '2px',
                                                '& input': {
                                                    padding: '10px 14px',
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <FormControl fullWidth margin="normal">
                                        <FormLabel>Đạo diễn</FormLabel>
                                        <OutlinedInput
                                            {...register('director')}
                                            placeholder="Nhập tên giám đốc"
                                            sx={{
                                                height: '40px',
                                                mt: '2px',
                                                '& input': {
                                                    padding: '10px 14px',
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            </div>

                            <FormControl fullWidth margin="normal" error={!!errors.country}>
                                <FormLabel>Quốc gia <span style={{ color: 'red' }}>*</span></FormLabel>
                                <Controller
                                    name="country"
                                    control={control}
                                    rules={{ required: 'Vui lòng chọn quốc gia' }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={countries.map(country => ({ value: country, label: country }))}
                                            value={field.value ? { value: field.value, label: field.value } : null}
                                            onChange={(selectedOption) => field.onChange(selectedOption?.value || '')}
                                            placeholder="Chọn một quốc gia"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    height: '40px',
                                                    marginTop: '2px',
                                                    backgroundColor: '#fff',
                                                    color: '#000',
                                                }),
                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: 'rgba(0, 0, 0, 0.6)',
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: '#fff',
                                                    color: '#000',
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
                                                    color: '#000',
                                                }),
                                            }}
                                        />
                                    )}
                                />
                                {errors.country && (
                                    <FormHelperText style={{ margin: 0, color: 'red' }}>
                                        {errors.country?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={!!errors.genreIds}>
                                <FormLabel>Thể loại <span style={{color: 'red'}}>*</span></FormLabel>
                                <Controller
                                    name="genreIds"
                                    control={control}
                                    render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={genres.map(genre => ({ value: genre.id, label: genre.name }))}
                                        value={genres
                                        .filter(genre => field.value?.includes(genre.id))
                                        .map(genre => ({ value: genre.id, label: genre.name }))}
                                        onChange={(selectedOptions) => {
                                        const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                        field.onChange(selectedIds);
                                        }}
                                        onBlur={field.onBlur}
                                        placeholder="Chọn thể loại"
                                        styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            minHeight: '40px',
                                            marginTop: '2px',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            borderColor: errors.genreIds ? '#d32f2f' : base.borderColor,
                                            '&:hover': {
                                            borderColor: errors.genreIds ? '#d32f2f' : base.borderColor,
                                            },
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: 'rgba(0, 0, 0, 0.6)',
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: '#fff',
                                            color: '#000',
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
                                            color: '#000',
                                        }),
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: '#e3f2fd',
                                        }),
                                        multiValueLabel: (base) => ({
                                            ...base,
                                            color: '#1976d2',
                                        }),
                                        multiValueRemove: (base) => ({
                                            ...base,
                                            color: '#1976d2',
                                            ':hover': {
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            },
                                        }),
                                        }}
                                    />
                                    )}
                                />
                                {errors.genreIds && (
                                    <FormHelperText style={{margin: 0, color: 'red'}}>
                                    {errors.genreIds.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>Trạng thái</FormLabel>
                                <Select 
                                    options={statusOptions} // Sử dụng statusOptions làm danh sách tùy chọn
                                    value={statusOptions.find(option => option.value === watch('status')) || null} // Tìm giá trị hiện tại
                                    onChange={(selectedOption) => setValue('status', selectedOption?.value || '')} // Cập nhật giá trị khi chọn
                                    placeholder="Chọn một trạng thái"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            height: '40px',
                                            marginTop: '2px',
                                            backgroundColor: '#fff', // Nền trắng
                                            color: '#000', // Màu chữ
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: 'rgba(0, 0, 0, 0.6)', // Màu placeholder
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: '#fff', // Nền menu
                                            color: '#000', // Màu chữ trong menu
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused ? '#f0f0f0' : '#fff', // Nền khi hover
                                            color: '#000', // Màu chữ
                                        }),
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal" className={styles.switchContainer}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                                    <FormLabel>Trạng thái vip</FormLabel>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <Switch
                                            checked={watch('restrictedAccess')}
                                            onChange={(e) => setValue('restrictedAccess', e.target.checked)}
                                        />
                                    </div>
                                </div>

                                <FormHelperText style={{margin: 0}}>Khi chọn thì chỉ có tài khoản vip mới xem được phim</FormHelperText>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <FormLabel>Diễn viên <span style={{color: 'red'}}>*</span></FormLabel>
                                <ActorSelector
                                    actors={actorRequests || []}
                                    onChange={(actors) => setActorRequests(actors)}
                                />
                                <FormHelperText style={{margin: 0}}>Thêm diễn viên và tên nhân vật</FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={styles.formSection}>

                            <FormControl fullWidth margin="normal">
                                <FormLabel style={{marginBottom: '5px'}}>Ảnh bìa</FormLabel>
                                <ImageUpload
                                    imageFile={thumbnailFile}
                                    imagePreview={thumbnailPreview}
                                    onImageChange={(file, preview) => {
                                        setThumbnailFile(file)
                                        setThumbnailPreview(preview)
                                        setValue('isDeleteThumbnail', false)
                                    }}
                                    onImageRemove={() => {
                                        setValue('isDeleteThumbnail', true)
                                        setThumbnailFile(null)
                                        setThumbnailPreview(null)
                                    }}
                                    aspectRatio="1:1"
                                    label="Upload thumbnail"
                                />
                                <FormHelperText style={{margin: 0}}>Kích thước khuyến nghị: 300x300 pixel</FormHelperText>                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <FormLabel style={{marginBottom: '5px'}}>Áp phích</FormLabel>
                                
                                <ImageUpload
                                    imageFile={posterFile}
                                    imagePreview={posterPreview}
                                    onImageChange={(file, preview) => {
                                        setPosterFile(file)
                                        setPosterPreview(preview)
                                        setValue('isDeleteThumbnail', false)
                                    }}
                                    onImageRemove={() => {
                                        setValue('isDeletePoster', true)
                                        setPosterFile(null)
                                        setPosterPreview(null)
                                    }}
                                    aspectRatio="2:1"
                                    label="Upload poster"
                                />
                                <FormHelperText style={{margin: 0}}>Kích thước khuyến nghị: 800x1200 pixel</FormHelperText>                            </FormControl>
                        </div>
                    </div>
                </div>


                <Box sx={{display: 'flex', justifyContent: 'end', marginTop: '24px', gap: '16px'}}>
                    <Button
                        variant="outlined"
                        onClick={() => reset()}
                        disabled={isSubmitting}
                    >
                        Huỷ
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </Box>
            </Box>
        </Container>

    )
}
export default UpdateMovie;