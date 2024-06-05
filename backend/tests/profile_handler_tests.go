// tests/profile_handler_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"profile-management/backend/handlers"
	"profile-management/backend/models"
	"profile-management/backend/services"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	db.AutoMigrate(&models.Profile{})
	return db
}

func TestCreateProfile(t *testing.T) {
	db := setupTestDB()
	profileService := services.NewProfileService(db)
	profileHandler := handlers.NewProfileHandler(profileService)

	r := gin.Default()
	r.POST("/profiles", profileHandler.CreateProfile)

	profile := models.Profile{Name: "John Doe", Age: 30, Gender: "Male", Email: "john@example.com"}
	jsonValue, _ := json.Marshal(profile)

	req, _ := http.NewRequest("POST", "/profiles", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var createdProfile models.Profile
	json.Unmarshal(w.Body.Bytes(), &createdProfile)
	assert.Equal(t, "John Doe", createdProfile.Name)
}

func TestGetProfile(t *testing.T) {
	db := setupTestDB()
	profileService := services.NewProfileService(db)
	profileHandler := handlers.NewProfileHandler(profileService)

	profile := models.Profile{Name: "Jane Doe", Age: 28, Gender: "Female", Email: "jane@example.com"}
	db.Create(&profile)

	r := gin.Default()
	r.GET("/profiles/:id", profileHandler.GetProfile)

	req, _ := http.NewRequest("GET", "/profiles/1", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var fetchedProfile models.Profile
	json.Unmarshal(w.Body.Bytes(), &fetchedProfile)
	assert.Equal(t, "Jane Doe", fetchedProfile.Name)
}

// Additional tests for UpdateProfile, DeleteProfile, and ListProfiles would be similar
