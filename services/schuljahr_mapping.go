package services

import (
	"easyupz/dtos"
	"easyupz/models"
)

func MappingSchuljahrToDTO(sj models.Schuljahr) dtos.SchuljahrDTO {
	var wfDTOs []dtos.WochenfaktorDTO
	var schultageGesamt uint = 0

	for _, wf := range sj.Wochenfaktoren {
		if wf.Bezeichnung == "Schuljahr" {
			schultageGesamt = wf.Schultage
		}

		wfDTOs = append(wfDTOs, dtos.WochenfaktorDTO{
			ID:          wf.ID,
			Bezeichnung: wf.Bezeichnung,
			Beginn:      wf.Beginn.Format("2006-01-02"),
			Ende:        wf.Ende.Format("2006-01-02"),
			Schultage:   wf.Schultage,
		})
	}

	return dtos.SchuljahrDTO{
		ID:              sj.ID,
		Anzeigeform:     sj.Anzeigeform,
		Aktiv:           sj.Aktiv,
		SchultageGesamt: schultageGesamt,
		Wochenfaktoren:  wfDTOs,
	}
}
