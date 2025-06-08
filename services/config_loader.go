package services

import (
	"fmt"

	"gopkg.in/ini.v1"
)

type ConfigLoader struct {
	cfg *ini.File
}

func NewConfigLoader() (*ConfigLoader, error) {
	iniFile, err := ini.Load("./config/config.ini")
	if err != nil {
		return nil, fmt.Errorf("%w", err)
	}

	return &ConfigLoader{cfg: iniFile}, nil
}

func (cl *ConfigLoader) GetValue(section string, key string) string {
	return cl.cfg.Section(section).Key(key).String()
}
