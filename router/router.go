package router

import (
	"easyupz/handlers"
	"embed"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"io/fs"
	"net/http"
)

func Setup(staticFiles embed.FS, indexHtml []byte) *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte("easyupz")) // Das Secret kann beliebig sein
	store.Options(sessions.Options{
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // ← true nur bei HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   0, // ← erlaubt Cookie bei fetch()
	})
	r.Use(sessions.Sessions("session", store))

	staticContent, err := fs.Sub(staticFiles, "start")
	if err != nil {
		panic(err)
	}

	r.StaticFS("/start", http.FS(staticContent))

	r.GET("/", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexHtml)
	})

	// API-Routen
	r.GET("/lehrer", handlers.GetLehrer)
	r.POST("/lehrer", handlers.PostLehrer)
	r.GET("/anrechnungen", handlers.GetAnrechnug)
	r.POST("/anrechnung", handlers.PostAnrechnung)
	r.POST("/login", handlers.Login)
	r.GET("/status", handlers.Status)
	r.POST("/logout", handlers.Logout)

	return r
}
