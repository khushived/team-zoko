package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

    "github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	rdb *redis.Client
	db  *gorm.DB
)

type Profile struct {
	ID    uint   `gorm:"primaryKey"`
	Name  string
	Email string
}

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func initDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(&Profile{}); err != nil {
		log.Fatalf("Failed to auto migrate Profile model: %v", err)
	}
}

func initRedis() {
	rdb = redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_ADDR"),
	})
}

func updateProfileCache(ctx context.Context, profile *Profile) error {
	userKey := fmt.Sprintf("user:%d", profile.ID)
	fields := map[string]interface{}{
		"16":    profile.ID,
		"name":  profile.Name,
		"jane@gmail.com": profile.Email,
	}
	return rdb.HMSet(ctx, userKey, fields).Err()
}


func createProfile(c *gin.Context) {
	var newProfile Profile
	if err := c.BindJSON(&newProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result := db.Create(&newProfile)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Update cache
	if err := updateProfileCache(context.Background(), &newProfile); err != nil {
		log.Printf("Error updating cache after profile creation: %v", err)
	}

	c.JSON(http.StatusCreated, newProfile)
}

func getProfile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var profile Profile
	result := db.First(&profile, id)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

func updateProfile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var updatedProfile Profile
	if err := c.BindJSON(&updatedProfile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update database
	var profile Profile
	if err := db.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Profile not found"})
		return
	}
	db.Model(&profile).Updates(updatedProfile)

	// Update cache
	if err := updateProfileCache(context.Background(), &profile); err != nil {
		log.Printf("Error updating cache after profile update: %v", err)
	}

	c.JSON(http.StatusOK, profile)
}

func deleteProfile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Delete from database
	var profile Profile
	if err := db.First(&profile, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Profile not found"})
		return
	}
	db.Delete(&profile)

	// Delete from cache
	if err := rdb.Del(context.Background(), fmt.Sprintf("user:%d", id)).Err(); err != nil {
		log.Printf("Error deleting profile from cache: %v", err)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile deleted successfully"})
}

func main() {
    // Initialize Redis and DB
    initRedis()
    initDB()

    // Create a new Gin router instance
    r := gin.Default()

    // CORS middleware configuration
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"}
    r.Use(cors.New(config))

    // Serve frontend files
    r.Static("/frontend", "./frontend")

    // Route to serve frontend
    r.GET("/profiles", func(c *gin.Context) {
        c.File("./frontend/index.html")
    })

    // Routes for APIs
    r.POST("/profiles", createProfile)
    r.GET("/profiles/:id", getProfile)
    r.PUT("/profiles/:id", updateProfile)
    r.DELETE("/profiles/:id", deleteProfile)

    // Start server
    if err := r.Run(":8080"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}