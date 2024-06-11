package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "strconv"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "github.com/go-redis/redis/v8"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var (
    rdb *redis.Client
    db  *gorm.DB
)

type Profile struct {
    ID     uint   `gorm:"primaryKey"`
    Name   string
    Email  string
    Age    int
    Gender string
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
        "ID":     profile.ID,
        "name":   profile.Name,
        "email":  profile.Email,
        "age":    profile.Age,
        "gender": profile.Gender,
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

func getAllProfiles(c *gin.Context) {
    var profiles []Profile
    if err := db.Find(&profiles).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, profiles)
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
        c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
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
        c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
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
    router := gin.Default()

    // CORS configuration
    config := cors.Config{
        AllowOrigins:     []string{"https://main--teamzoko.netlify.app"}, // Replace with your Netlify URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }

    router.Use(cors.New(config))

    // Routes
    router.GET("/", func(c *gin.Context) {
        c.String(http.StatusOK, "Welcome to Team Zoko!")
    })    
    router.POST("/profiles", createProfile)
    router.GET("/profiles", getAllProfiles) // Fixed route to get all profiles
    router.PUT("/profiles/:id", updateProfile)
    router.DELETE("/profiles/:id", deleteProfile)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080" // Default to port 8080 if not specified
    }
    router.Run(":" + port)
}
