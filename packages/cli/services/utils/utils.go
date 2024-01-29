package utils

import (
	"encoding/json"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func ConvertJsonToMap(body []byte) map[string]interface{} {
	var result map[string]interface{}
	err := json.Unmarshal([]byte(body), &result)
	if err != nil {
		log.Fatal(err)
	}
	return result
}

func getMainProjectDir() string {
	exePath, err := os.Executable()
	if err != nil {
		log.Fatalf("Failed to get executable path: %v", err)
	}
	exeDir := filepath.Dir(exePath)
	projectDir := filepath.Dir(exeDir)
	return projectDir
}

func FormatFileWithPrettier(filePaths []string) {
	projectDir := getMainProjectDir()
	args := append([]string{projectDir + "/js/format.js"}, filePaths...)
	cmd := exec.Command("node", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		log.Printf("Failed to format file: %v", err)
		return // or handle the error as appropriate
	}
}
