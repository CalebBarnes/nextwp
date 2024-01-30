package typegen

import (
	"fmt"
	"strings"
)

// Helper function to check if a slice contains a specific value
func contains(slice []interface{}, value interface{}) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

// func isTypeArray(typeValue interface{}) bool {
// 	if typeValue == "array" {
// 		return true
// 	}
// 	if typeSlice, ok := typeValue.([]interface{}); ok {
// 		return contains(typeSlice, "array")
// 	}
// 	return false
// }

// func hasProperties(item interface{}) bool {
// 	if itemMap, ok := item.(map[string]interface{}); ok {
// 		_, hasProps := itemMap["properties"]
// 		return hasProps
// 	}
// 	return false
// }

func enumToTsType(enumValues []interface{}) string {
	var enumTypes []string
	for _, enumVal := range enumValues {
		if strVal, isString := enumVal.(string); isString {
			enumTypes = append(enumTypes, fmt.Sprintf(`"%s"`, strVal))
		}
	}
	return strings.Join(enumTypes, " | ")
}
