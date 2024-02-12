package utils

import (
	"encoding/json"
	"log"
	"os"
	"os/exec"
)

func ConvertJsonToMap(body []byte) map[string]interface{} {
	var result map[string]interface{}
	err := json.Unmarshal([]byte(body), &result)
	if err != nil {
		log.Fatal(err)
	}
	return result
}

func FormatFilesWithPrettier(filePaths string) {
	cmd := exec.Command("prettier", "./types/*.ts", "--write")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		log.Printf("Failed to format file: %v", err)
		return // or handle the error as appropriate
	}
}
