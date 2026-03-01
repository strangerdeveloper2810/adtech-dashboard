package handler

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"adtech/internal/storage"

	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	storage *storage.MinIOStorage
}

func NewUploadHandler(storage *storage.MinIOStorage) *UploadHandler {
	return &UploadHandler{storage: storage}
}

// Upload handles single file upload
// POST /upload
func (h *UploadHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		ValidationError(c, err)
		return
	}
	defer file.Close()

	// Validate file size (max 10MB)
	if header.Size > 10*1024*1024 {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "file size exceeds 10MB limit")
		return
	}

	// Validate file type
	ext := filepath.Ext(header.Filename)
	allowedExts := map[string]bool{
		".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true,
		".mp4": true, ".webm": true, ".mov": true,
	}
	if !allowedExts[ext] {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "file type not allowed")
		return
	}

	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	// Generate unique filename
	objectName := fmt.Sprintf("uploads/%d%s", time.Now().UnixNano(), ext)

	url, err := h.storage.Upload(c.Request.Context(), objectName, file, header.Size, contentType)
	if err != nil {
		InternalError(c)
		return
	}

	SuccessResponse(c, http.StatusOK, gin.H{
		"url":      url,
		"filename": header.Filename,
		"size":     header.Size,
	})
}

// UploadMultiple handles multiple file upload
// POST /upload/multiple
func (h *UploadHandler) UploadMultiple(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		ValidationError(c, err)
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "no files provided")
		return
	}

	if len(files) > 10 {
		ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", "max 10 files per upload")
		return
	}

	var results []gin.H
	for _, header := range files {
		if header.Size > 10*1024*1024 {
			continue
		}

		file, err := header.Open()
		if err != nil {
			continue
		}

		ext := filepath.Ext(header.Filename)
		contentType := header.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "application/octet-stream"
		}

		objectName := fmt.Sprintf("uploads/%d%s", time.Now().UnixNano(), ext)
		url, err := h.storage.Upload(c.Request.Context(), objectName, file, header.Size, contentType)
		file.Close()
		if err != nil {
			continue
		}

		results = append(results, gin.H{
			"url":      url,
			"filename": header.Filename,
			"size":     header.Size,
		})
	}

	SuccessResponse(c, http.StatusOK, results)
}
