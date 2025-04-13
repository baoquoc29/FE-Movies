"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Button,
  TextField,
  TextareaAutosize,
  Switch,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  OutlinedInput
} from "@mui/material"

import styles from "./MovieForm.scss"
import ImageUpload from "../../../../components/image-upload/ImageUpload"
import { ActorSelector } from "../../../../components/admin-actor/ActorSelector"

// Sample data
const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  // ... other genres
]

const countries = [
  "United States",
  "United Kingdom",
  // ... other countries
]

const statusOptions = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "RELEASED", label: "Released" },
  { value: "ARCHIVED", label: "Archived" },
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
  actorRequests: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string().min(1, "Actor name is required"),
      character: z.string().optional(),
    })
  ).default([]),
  genreIds: z.array(z.number()).min(1, "Select at least one genre"),
})

const CreateMovie = () => {
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [posterFile, setPosterFile] = useState(null)
  const [posterPreview, setPosterPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { 
    control,
    handleSubmit,
    formState: { errors },
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
      status: "UPCOMING",
      restrictedAccess: false,
      actorRequests: [],
      genreIds: [],
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      // Append all fields
      Object.keys(data).forEach(key => {
        if (key === 'actorRequests' || key === 'genreIds') {
          formData.append(key, JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      })
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile)
      if (posterFile) formData.append('poster', posterFile)

      console.log("Form submitted", Object.fromEntries(formData))
      // await submitToApi(formData)
    } catch (error) {
      console.error("Submission error", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: '#fff', // Đảm bảo nền trắng
        padding: '24px 0' // Thêm padding
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
                <Typography variant="h6" className={styles.sectionTitle}>Movie Information</Typography>

                <FormControl fullWidth margin="normal" error={!!errors.title}>
                    <FormLabel>Title *</FormLabel>
                    <OutlinedInput
                        {...register('title')}
                        placeholder="Enter movie title"
                    />
                    {errors.title && (
                        <FormHelperText 
                        error
                        sx={{
                            margin: '8px 0 0 0',
                            fontSize: '0.875rem',
                            lineHeight: 1.3
                        }}
                        >
                        {errors.title.message}
                        </FormHelperText>
                    )}
                </FormControl>

                <TextField
                label="Description"
                fullWidth
                multiline
                minRows={4}
                margin="normal"
                error={!!errors.description}
                helperText={errors.description?.message}
                {...register('description')}
                />

                <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <TextField
                    label="Release Year"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.releaseYear}
                    helperText={errors.releaseYear?.message}
                    {...register('releaseYear', { valueAsNumber: true })}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <TextField
                    label="Duration (minutes)"
                    type="number"
                    fullWidth
                    margin="normal"
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    {...register('duration', { valueAsNumber: true })}
                    />
                </div>
                </div>


                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <TextField
                        label="Publisher"
                        fullWidth
                        margin="normal"
                        {...register('publisher')}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <TextField
                        label="Director"
                        fullWidth
                        margin="normal"
                        {...register('director')}
                        />
                    </div>
                    </div>


                <FormControl fullWidth margin="normal" error={!!errors.country}>
                <FormLabel>Country *</FormLabel>
                <Select
                    value={watch('country') || ''}
                    onChange={(e) => setValue('country', e.target.value)}
                >
                    {countries.map(country => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>{errors.country?.message}</FormHelperText>
                </FormControl>

                <FormControl fullWidth margin="normal">
                <FormLabel>Status</FormLabel>
                <Select
                    value={watch('status') || 'UPCOMING'}
                    onChange={(e) => setValue('status', e.target.value)}
                >
                    {statusOptions.map(status => (
                    <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                    ))}
                </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" className={styles.switchContainer}>
                <FormLabel>Restricted Access</FormLabel>
                <Box display="flex" alignItems="center">
                    <Switch
                    checked={watch('restrictedAccess')}
                    onChange={(e) => setValue('restrictedAccess', e.target.checked)}
                    />
                    <Typography variant="body2" ml={1}>
                    {watch('restrictedAccess') ? 'Enabled' : 'Disabled'}
                    </Typography>
                </Box>
                <FormHelperText>Enable if this movie has age restrictions</FormHelperText>
                </FormControl>
            </div>
            </div>
            <div style={{flex: 1}}>
        <div className={styles.formSection}>
            <Typography variant="h6" className={styles.sectionTitle}>Media & Categories</Typography>

            <FormControl fullWidth margin="normal">
              <FormLabel>Thumbnail</FormLabel>
              <ImageUpload
                imageFile={thumbnailFile}
                imagePreview={thumbnailPreview}
                onImageChange={(file, preview) => {
                  setThumbnailFile(file)
                  setThumbnailPreview(preview)
                }}
                onImageRemove={() => {
                  setThumbnailFile(null)
                  setThumbnailPreview(null)
                }}
                aspectRatio="1:1"
                label="Upload thumbnail"
              />
              <FormHelperText>Recommended size: 300x300 pixels</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Poster</FormLabel>
              <ImageUpload
                imageFile={posterFile}
                imagePreview={posterPreview}
                onImageChange={(file, preview) => {
                  setPosterFile(file)
                  setPosterPreview(preview)
                }}
                onImageRemove={() => {
                  setPosterFile(null)
                  setPosterPreview(null)
                }}
                aspectRatio="2:3"
                label="Upload poster"
              />
              <FormHelperText>Recommended size: 800x1200 pixels</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.genreIds}>
              <FormLabel>Genres *</FormLabel>
              {/* <GenreSelector
                genres={genres}
                selectedGenreIds={watch('genreIds') || []}
                onChange={(ids) => setValue('genreIds', ids)}
              /> */}
              <FormHelperText>{errors.genreIds?.message || 'Select at least one genre'}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Actors</FormLabel>
              <ActorSelector
                actors={watch('actorRequests') || []}
                onChange={(actors) => setValue('actorRequests', actors)}
              />
              <FormHelperText>Add actors and their character names</FormHelperText>
            </FormControl>
          </div>
        </div>
        </div>
    

      <Box className={styles.formActions}>
        <Button
          variant="outlined"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Movie'}
        </Button>
      </Box>
    </Box>
    </Container>

  )
}
export default CreateMovie;