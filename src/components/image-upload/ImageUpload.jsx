"use client"

import { useState, useRef } from "react"
import { Upload as UploadIcon, Close as CloseIcon } from "@mui/icons-material"
import { Button, IconButton, Box, Typography } from "@mui/material"
import styles from "./ImageUpload.module.scss"

const ImageUpload = ({
  imageFile = null,
  imagePreview = null,
  onImageChange,
  onImageRemove,
  aspectRatio = "1:1",
  label = "Upload image",
})  => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate aspect ratio for the container
  const getPaddingBottom = () => {
    switch (aspectRatio) {
      case "16:9": return "56.25%"
      case "4:3": return "75%"
      case "2:3": return "150%"
      default: return "100%"
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageChange(file, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageChange(file, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.imageUploadAdmin}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className={styles.fileInput} 
      />

      {!imagePreview ? (
        <Box
          className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
          style={{ paddingBottom: getPaddingBottom() }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Box className={styles.uploadContent}>
            <UploadIcon className={styles.uploadIcon} />
            <Typography variant="body1" className={styles.uploadLabel}>
              {label}
            </Typography>
            <Typography variant="caption" className={styles.uploadHint}>
              Drag and drop or click to browse
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box className={styles.previewContainer} style={{ paddingBottom: getPaddingBottom() }}>
          <img
            src={imagePreview}
            alt="Preview"
            className={styles.previewImage}
          />
          <IconButton
            color="error"
            className={styles.removeButton}
            onClick={(e) => {
              e.stopPropagation()
              onImageRemove()
            }}
          >
            <CloseIcon />
          </IconButton>
          <Button
            variant="contained"
            size="small"
            className={styles.changeButton}
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
          >
            Change
          </Button>
        </Box>
      )}
    </div>
  )
}

export default ImageUpload;