package typegen

import (
	"encoding/json"
	"fmt"
	"log"
	"log/slog"
	"os"
	"strings"

	"github.com/CalebBarnes/nextwp/cli/services/wordpress"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func GenerateTypes() error {
	slog.Info("Generating types for post types on your WordPress site: " + os.Getenv("WP_URL"))
	postTypes := wordpress.GetPostTypes()

	for key, value := range postTypes {
		if key == "wp_template" || key == "wp_template_part" || key == "wp_block" || key == "wp_navigation" || key == "nav_menu_item" || key == "attachment" {
			continue
		}
		titleCaser := cases.Title(language.English)
		pascalCaseKey := titleCaser.String(key)
		fmt.Println("-----------------------------------")
		fmt.Println(pascalCaseKey)
		fmt.Println("-----------------------------------")

		// Assuming value is a map
		if mappedValue, ok := value.(map[string]interface{}); ok {
			// Now you can index mappedValue
			restBase := mappedValue["rest_base"].(string)
			schema := wordpress.GetSchema(restBase)

			generateTypeScriptFile(schema["schema"].(map[string]interface{})["properties"].(map[string]interface{}), pascalCaseKey)

		}
		fmt.Println("-----------------------------------")
	}
	return nil
}

func generateTypeScriptFile(schema map[string]interface{}, typeName string) {
	fileContent := "export interface " + typeName + " {\n"
	fileContent += generateTsProperties(schema)
	fileContent += "}\n"

	fileName := "./types/" + typeName + ".ts"
	file, err := os.Create(fileName)
	if err != nil {
		log.Fatalf("Failed to create file: %v", err)
	}
	defer file.Close()

	jsonSchema, err := json.MarshalIndent(schema, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal schema: %v", err)
	}

	fileContent += "\n"
	fileContent += "\n const schema = " + string(jsonSchema)
	fileContent += "\n"

	_, err = file.WriteString(fileContent)
	if err != nil {
		log.Fatalf("Failed to write to file: %v", err)
	}
}

func generateTsProperties(schema map[string]interface{}) string {
	var propertiesContent string
	for propName, propDetails := range schema {
		if propName == "" {
			continue // Skip properties with empty names
		}

		isAcf := false
		// todo: fetch acf fields from endpoint to get better type info and comments etc
		propMap, ok := propDetails.(map[string]interface{})
		if !ok {
			continue // or handle error as appropriate
		}
		if propMap["required"] == false || propMap["required"] == true {
			isAcf = true
		}

		propType := getTsType(propName, propDetails, isAcf)

		propertiesContent += generatePropertyComment(propName, propType, propDetails.(map[string]interface{}), isAcf)
		propertiesContent += fmt.Sprintf("  %s: %s;\n", propName, propType)
	}
	return propertiesContent
}

func getTsType(propName string, propDetails interface{}, isAcf bool) string {
	propMap, ok := propDetails.(map[string]interface{})
	if !ok {
		return "@ ERROR @" // or handle error as appropriate
		// return "any" // or handle error as appropriate
	}

	// pattern example: pattern: "^hero$", we want to just return hero
	if propMap, ok := propDetails.(map[string]interface{}); ok {
		if propName == "acf_fc_layout" && propMap["pattern"] != nil {
			pattern := propMap["pattern"].(string)
			value := strings.ReplaceAll(pattern, "^", "")
			value = strings.ReplaceAll(value, "$", "")
			return "\"" + value + "\""
		}
	}
	if enumValues, ok := propMap["enum"].([]interface{}); ok {
		if typeValue, typeExists := propMap["type"]; typeExists {
			// Check if the type is "string"
			if typeStr, isStringType := typeValue.(string); isStringType && typeStr == "string" {
				// Generate TypeScript type for enum values of type string
				enumStrings := make([]string, len(enumValues))
				for i, enumVal := range enumValues {
					if strVal, isString := enumVal.(string); isString {
						enumStrings[i] = fmt.Sprintf(`"%s"`, strVal)
					}
				}
				return strings.Join(enumStrings, " | ")
			}
			return jsonTypeToTsType(enumValues)

		}
	}

	// Handling 'items' for arrays
	if items, ok := propMap["items"].(map[string]interface{}); ok {
		typeValue := propMap["type"]
		// Check if it is an array and items is an object
		if isTypeArray(typeValue) && hasProperties(items) {
			itemsType := generateTsProperties(items["properties"].(map[string]interface{}))
			return fmt.Sprintf("{%s}[] | null", itemsType)
		}
	}

	// Check for 'items' with 'oneOf'
	if items, ok := propMap["items"].(map[string]interface{}); ok {
		if oneOf, ok := items["oneOf"].([]interface{}); ok {
			var oneOfTypes []string
			for _, oneOfProp := range oneOf {
				oneOfType := getTsType(propName, oneOfProp, isAcf)
				oneOfTypes = append(oneOfTypes, oneOfType)
			}
			return strings.Join(oneOfTypes, " | ")
		}
	}
	// check for properties (nested object)
	if properties, ok := propMap["properties"].(map[string]interface{}); ok {
		// This is a nested object, handle recursively
		return "{\n" + generateTsProperties(properties) + "}"
	}

	typeValue, exists := propMap["type"]
	if !exists {
		return "@ TYPE VALUE NOT EXISTS @"
		// return "any"
	}

	switch v := typeValue.(type) {
	case string:
		return jsonTypeToTsType(v)
	case []interface{}:
		types := make([]string, len(v))
		for i, elem := range v {
			if strType, ok := elem.(string); ok {
				types[i] = jsonTypeToTsType(strType)
			} else {
				types[i] = "@ NOT_IMPLEMENTED_TYPE @" // or handle non-string types as needed
			}
		}
		return strings.Join(types, " | ")
	default:
		return "@ NOT_IMPLEMENTED @"
	}
}

func jsonTypeToTsType(jsonType interface{}) string {
	switch v := jsonType.(type) {
	case string:
		// Handle basic types
		return basicTypeToTsType(v)
	case []interface{}:
		// Handle enums and multiple types
		var types []string
		for _, elem := range v {
			if strType, ok := elem.(string); ok {
				tsType := basicTypeToTsType(strType)
				typesInterface := make([]interface{}, len(types))
				if !contains(typesInterface, tsType) {
					types = append(types, tsType)
				}
			}
		}
		return strings.Join(types, " | ")
	default:
		return "@ NOT_IMPLEMENTED_ANY @"
		// return "any"
	}
}

func basicTypeToTsType(jsonType string) string {
	switch jsonType {
	case "string":
		return "string"
	case "integer", "int":
		return "number"
	case "boolean":
		return "boolean"
	case "null":
		return "null"
	default:
		return "any"
	}
}

// Helper function to check if a slice contains a specific value
func contains(slice []interface{}, value interface{}) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}

func isTypeArray(typeValue interface{}) bool {
	if typeValue == "array" {
		return true
	}
	if typeSlice, ok := typeValue.([]interface{}); ok {
		return contains(typeSlice, "array")
	}
	return false
}

func hasProperties(item interface{}) bool {
	if itemMap, ok := item.(map[string]interface{}); ok {
		_, hasProps := itemMap["properties"]
		return hasProps
	}
	return false
}

func generatePropertyComment(propName string, propType string, propDetails map[string]interface{}, isAcfField bool) string {
	var propertyComment string
	if description, ok := propDetails["description"]; ok {
		propertyComment += "  /**\n"
		propertyComment += fmt.Sprintf("  * %s\n", description)
		propertyComment += "  */\n"
	}

	if isAcfField {
		acfFieldType := getAcfFieldType(propName, propDetails)
		propertyComment += getAcfFieldComment(acfFieldType)
	}
	return propertyComment
}

func getAcfFieldType(propName string, propDetails map[string]interface{}) string {
	if items, ok := propDetails["items"].(map[string]interface{}); ok {
		if oneOf, ok := items["oneOf"].([]interface{}); ok {
			if len(oneOf) > 0 {
				return "repeater"
			}
		}
	}

	// if propName == "acf_fc_layout" {
	// 	return "flexible_content"
	// }

	return ""
}

func getAcfFieldComment(acfFieldType string) string {
	if acfFieldType == "" {
		return ""
	}
	comment := `  /**
  * acf: ` + acfFieldType + `
  */` + "\n"
	return comment
}
