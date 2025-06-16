package router

import (
	"easyupz/handlers"
	"embed"
	"io/fs"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func Setup(staticFiles embed.FS, indexHtml []byte) *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte("easyupz")) // Das Secret kann beliebig sein
	store.Options(sessions.Options{
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // ← true nur bei HTTPS
		SameSite: http.SameSiteLaxMode,
		MaxAge:   900,
	})
	r.Use(sessions.Sessions("session", store))
	r.Use(handlers.ExtendSession(900))

	staticContent, err := fs.Sub(staticFiles, "start")
	if err != nil {
		panic(err)
	}

	r.StaticFS("/start", http.FS(staticContent))

	r.GET("/", func(c *gin.Context) {
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexHtml)
	})

	// API-Routen
	r.GET("/status", handlers.Status)
	r.POST("/logout", handlers.Logout)
	r.POST("/login", handlers.Login)

	r.GET("/gesamtansicht", handlers.GetGesamtansicht)

	r.GET("/lehrerverwaltung", handlers.GetLehrerverwaltung)
	r.POST("/lehrerverwaltung", handlers.PostLehrerverwaltung)

	r.GET("/anrechnungen", handlers.GetAnrechnug)
	r.POST("/anrechnung", handlers.PostAnrechnung)

	r.GET("/benutzer", handlers.GetBenutzer)
	r.POST("/benutzer", handlers.PostBenutzer)
	r.DELETE("/benutzer/:id", handlers.DeleteBenutzer)

	return r
}
