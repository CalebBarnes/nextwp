package utils

import (
	"encoding/json"
	"log"
)

func ConvertJsonToMap(body []byte) map[string]interface{} {
	var result map[string]interface{}
	err := json.Unmarshal([]byte(body), &result)
	if err != nil {
		log.Fatal(err)
	}
	return result
}

// func ConvertMapToJson(result interface{}) []byte {
// 	jsonBytes, err := json.MarshalIndent(result, "", "  ")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	return jsonBytes
// }
