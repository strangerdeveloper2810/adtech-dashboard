package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// SuccessResponse sends a standardized success JSON response.
func SuccessResponse(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{
		"success": true,
		"data":    data,
	})
}

// SuccessWithMeta sends a paginated success response.
func SuccessWithMeta(c *gin.Context, data any, meta any) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"meta":    meta,
	})
}

// ErrorResponse sends a standardized error JSON response.
func ErrorResponse(c *gin.Context, status int, code string, message string) {
	c.JSON(status, gin.H{
		"success": false,
		"error": gin.H{
			"code":    code,
			"message": message,
		},
	})
}

// ValidationError sends a 400 error for validation failures.
func ValidationError(c *gin.Context, err error) {
	ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error())
}

// NotFoundError sends a 404 error.
func NotFoundError(c *gin.Context, resource string) {
	ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", resource+" not found")
}

// UnauthorizedError sends a 401 error.
func UnauthorizedError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", message)
}

// ForbiddenError sends a 403 error.
func ForbiddenError(c *gin.Context) {
	ErrorResponse(c, http.StatusForbidden, "FORBIDDEN", "insufficient permissions")
}

// InternalError sends a 500 error.
func InternalError(c *gin.Context) {
	ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", "something went wrong")
}
