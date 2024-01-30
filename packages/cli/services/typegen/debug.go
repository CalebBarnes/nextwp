package typegen

import (
	"encoding/json"
	"log"
)

func GetDebugSchemaString(properties map[string]interface{}) string {
	jsonSchema, err := json.MarshalIndent(properties, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal schema: %v", err)
	}

	return "\n\nconst schema = " + string(jsonSchema) + "\n"
}
