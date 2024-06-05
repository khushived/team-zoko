package models

import "gorm.io/gorm"

type Profile struct {
    gorm.Model
    Name   string `json:"name"`
    Age    int  `json:"age"`  // Change from string to int
    Gender string `json:"gender"`
    Email  string `json:"email"`
}
