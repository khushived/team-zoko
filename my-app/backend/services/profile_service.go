package services

import (
    "context"
    "encoding/json"
    "profile-management/backend/models"
    "strconv"

    "github.com/go-redis/redis/v8"
    "gorm.io/gorm"
)

type ProfileService struct {
    DB    *gorm.DB
    Redis *redis.Client
    Ctx   context.Context
}

func NewProfileService(db *gorm.DB, redis *redis.Client) *ProfileService {
    return &ProfileService{
        DB:    db,
        Redis: redis,
        Ctx:   context.Background(),
    }
}

func (s *ProfileService) CreateProfile(profile *models.Profile) error {
    if err := s.DB.Create(profile).Error; err != nil {
        return err
    }
    return s.cacheProfile(profile)
}

func (s *ProfileService) GetProfile(id uint) (*models.Profile, error) {
    cachedProfile, err := s.getCachedProfile(id)
    if err == nil {
        return cachedProfile, nil
    }

    var profile models.Profile
    if err := s.DB.First(&profile, id).Error; err != nil {
        return nil, err
    }
    s.cacheProfile(&profile)
    return &profile, nil
}

func (s *ProfileService) UpdateProfile(profile *models.Profile) error {
    if err := s.DB.Save(profile).Error; err != nil {
        return err
    }
    return s.cacheProfile(profile)
}

func (s *ProfileService) DeleteProfile(id uint) error {
    if err := s.DB.Delete(&models.Profile{}, id).Error; err != nil {
        return err
    }
    s.Redis.Del(s.Ctx, s.profileCacheKey(id))
    return nil
}

func (s *ProfileService) cacheProfile(profile *models.Profile) error {
    data, err := json.Marshal(profile)
    if err != nil {
        return err
    }
    return s.Redis.Set(s.Ctx, s.profileCacheKey(profile.ID), data, 0).Err()
}

func (s *ProfileService) getCachedProfile(id uint) (*models.Profile, error) {
    data, err := s.Redis.Get(s.Ctx, s.profileCacheKey(id)).Result()
    if err != nil {
        return nil, err
    }

    var profile models.Profile
    if err := json.Unmarshal([]byte(data), &profile); err != nil {
        return nil, err
    }
    return &profile, nil
}

func (s *ProfileService) profileCacheKey(id uint) string {
    return "profile:" + strconv.Itoa(int(id))
}
