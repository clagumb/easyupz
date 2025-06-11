package handlers

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func ExtendSession(maxAge int) gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		if session.Get("benutzer") != nil {
			session.Options(sessions.Options{
				Path:     "/",
				MaxAge:   maxAge,
				HttpOnly: true,
			})
			session.Save()
		}
		c.Next()
	}
}
