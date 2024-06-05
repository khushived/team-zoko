package handlers

import (
    "log"
    "net/http"
    "profile-management/backend/models"
    "profile-management/backend/services"
    "strconv"

    "github.com/gin-gonic/gin"
)

type ProfileHandler struct {
    ProfileService *services.ProfileService
}

func NewProfileHandler(profileService *services.ProfileService) *ProfileHandler {
    return &ProfileHandler{ProfileService: profileService}
}

func (h *ProfileHandler) CreateProfile(c *gin.Context) {
    var profile models.Profile
    if err := c.ShouldBindJSON(&profile); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    log.Printf("Received Profile Data: %+v\n", profile)
    if err := h.ProfileService.CreateProfile(&profile); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, profile)
}

func (h *ProfileHandler) GetProfile(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid profile ID"})
        return
    }
    profile, err := h.ProfileService.GetProfile(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
        return
    }
    c.JSON(http.StatusOK, profile)
}

func (h *ProfileHandler) UpdateProfile(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid profile ID"})
        return
    }
    var updatedProfile models.Profile
    if err := c.ShouldBindJSON(&updatedProfile); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    updatedProfile.ID = uint(id)
    if err := h.ProfileService.UpdateProfile(&updatedProfile); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, updatedProfile)
}

func (h *ProfileHandler) DeleteProfile(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid profile ID"})
        return
    }
    if err := h.ProfileService.DeleteProfile(uint(id)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Profile deleted"})
}

func (h *ProfileHandler) ListProfiles(c *gin.Context) {
    var profiles []models.Profile
    if err := h.ProfileService.DB.Find(&profiles).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, profiles)
}
