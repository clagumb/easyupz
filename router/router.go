package router

import (
	"embed"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"io/fs"
	"net/http"
	"upzbayern/handlers"
)

func Setup(staticFiles embed.FS, indexHtml []byte) *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte("upzbayern")) // Das Secret kann beliebig sein
	store.Options(sessions.Options{
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // ← true nur bei HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   0, // ← erlaubt Cookie bei fetch()
	})
	r.Use(sessions.Sessions("session", store))

	staticContent, err := fs.Sub(staticFiles, "static")
	if err != nil {
		panic(err)
	}

	r.StaticFS("/static", http.FS(staticContent))

	r.GET("/", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexHtml)
	})

	// API-Routen
	r.GET("/lehrer", handlers.GetLehrer)
	r.POST("/lehrer", handlers.PostLehrer)
	r.POST("/login", handlers.Login)
	r.GET("/status", handlers.Status)
	r.POST("/logout", handlers.Logout)

	return r
}
