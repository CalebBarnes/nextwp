package typegen

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"
	"sort"
	"strings"

	"github.com/CalebBarnes/nextwp/cli/services/utils"
	"github.com/CalebBarnes/nextwp/cli/services/wordpress"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

const includeComments = true
const debugSchema = false

func GenerateTypes() error {
	println("\x1b[32m[@nextwp/cli]\x1b[0m Generating types for " + os.Getenv("WP_URL"))
	postTypes := wordpress.GetPostTypes()
	generatedFiles := []string{}

	for key, value := range postTypes {
		if key == "wp_template" || key == "wp_template_part" || key == "wp_block" || key == "wp_navigation" || key == "nav_menu_item" || key == "attachment" {
			continue
		}
		pascalCaseKey := cases.Title(language.English).String(key)

		if mappedValue, ok := value.(map[string]interface{}); ok {
			restBase := mappedValue["rest_base"].(string)
			schema := wordpress.GetSchema(restBase)

			filePath := generateTypeScriptFile(schema["schema"].(map[string]interface{})["properties"].(map[string]interface{}), pascalCaseKey)
			generatedFiles = append(generatedFiles, filePath)
		}
	}

	cwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Failed to get current working directory: %v", err)
	}
	filesString := strings.ReplaceAll(strings.Join(generatedFiles, ", "), cwd+"/", "")
	println("\x1b[32m[@nextwp/cli]\x1b[0m TypeScript types generated at " + filesString)

	utils.FormatFilesWithPrettier("./types")
	return nil
}

func generateTypeScriptFile(schema map[string]interface{}, typeName string) string {
	fileContent := "export interface " + typeName + " {\n"
	fileContent += generateTsProperties(schema)
	fileContent += "}\n"

	dirName := "./types"
	fileName := strings.ReplaceAll(strings.ToLower(dirName+"/"+typeName+".ts"), " ", "-")
	err := os.MkdirAll(dirName, 0755)
	if err != nil {
		log.Fatalf("Failed to create directory: %v", err)
	}

	file, err := os.Create(fileName)
	if err != nil {
		log.Fatalf("Failed to create file: %v", err)
	}
	defer file.Close()

	if debugSchema {
		jsonSchema, err := json.MarshalIndent(schema, "", "  ")
		if err != nil {
			log.Fatalf("Failed to marshal schema: %v", err)
		}
		fileContent += "\n"
		fileContent += "\n const schema = " + string(jsonSchema)
		fileContent += "\n"
	}

	_, err = file.WriteString(fileContent)
	if err != nil {
		log.Fatalf("Failed to write to file: %v", err)
	}

	cwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("Failed to get current working directory: %v", err)
	}
	return path.Join(cwd, fileName)
}

func generateTsProperties(schema map[string]interface{}) string {
	var propertiesContent string
	var sortedKeys []string
	// sort keys alphabetically to prevent unnecessary git diffs
	for propName := range schema {
		sortedKeys = append(sortedKeys, propName)
	}
	sort.Strings(sortedKeys)

	for _, propName := range sortedKeys {
		propDetails := schema[propName]
		if propName == "" {
			continue // Skip properties with empty names
		}

		isOptional := false
		// todo: fetch acf fields from endpoint to get better type info and comments etc (is this still needed? I think I have covered most of them)
		isAcf := false
		propMap, ok := propDetails.(map[string]interface{})
		if !ok {
			continue
		}
		if required, exists := propMap["required"]; exists {
			isAcf = true
			if req, ok := required.(bool); ok && !req {
				isOptional = true
			}
		}

		propType := getTsType(propName, propDetails, isAcf)

		if includeComments {
			propertiesContent += generatePropertyComment(propName, propType, propDetails.(map[string]interface{}), isAcf)
		}
		if isOptional {
			propertiesContent += fmt.Sprintf("  %s?: %s;\n", propName, propType)
		} else {
			propertiesContent += fmt.Sprintf("  %s: %s;\n", propName, propType)
		}
	}
	return propertiesContent
}

func getTsType(propName string, propDetails interface{}, isAcf bool) string {
	propMap, ok := propDetails.(map[string]interface{})
	if !ok {
		return "@ ERROR @"
		// return "any"
	}

	// Handle 'enum' within 'items' (acf select fields)
	if items, ok := propMap["items"].(map[string]interface{}); ok {
		if enumValues, ok := items["enum"].([]interface{}); ok {
			enumTypes := make([]string, len(enumValues))
			for i, enumVal := range enumValues {
				if strVal, isString := enumVal.(string); isString {
					enumTypes[i] = fmt.Sprintf(`"%s"`, strVal)
				}
			}
			return strings.Join(enumTypes, " | ") + " | null"
		}
	}

	// Handling 'array' type with specific item types (taxonomies or specific field types that are arrays like number[] or string[])
	if propType, ok := propMap["type"]; ok && propType == "array" {
		if items, ok := propMap["items"].(map[string]interface{}); ok {
			if itemType, ok := items["type"].(string); ok {
				tsItemType := basicTypeToTsType(itemType)
				return tsItemType + "[]"
			}
		}
		return "any[]" // Fallback for arrays with unknown item types
	}

	// Handling 'acf_fc_layout' field pattern value for flexible content layouts
	if propMap, ok := propDetails.(map[string]interface{}); ok {
		if propName == "acf_fc_layout" && propMap["pattern"] != nil {
			pattern := propMap["pattern"].(string)
			value := strings.ReplaceAll(pattern, "^", "")
			value = strings.ReplaceAll(value, "$", "")
			return "\"" + value + "\""
		}
	}

	// Handling 'enum' for string types
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
	// check for properties (nested object), handle recursively
	if properties, ok := propMap["properties"].(map[string]interface{}); ok {
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
				types[i] = "@ NOT_IMPLEMENTED_TYPE @"
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
	case "number":
		return "number"
	case "boolean":
		return "boolean"
	case "null":
		return "null"
	case "object":
		return "any" // this would be an empty object, like the acf field with no subfields
	case "":
		return "any // ! @ NOT_IMPLEMENTED_BASIC_TYPE EMPTY_STRING"
	default:
		log.Println("UNHANDLED switch case in basicTypeToTsType: " + jsonType)
		return "any // ! @ NOT_IMPLEMENTED_BASIC_TYPE " + jsonType + " @"
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
	propertyComment += "/**\n"

	if isAcfField {
		acfFieldType := getAcfFieldType(propName, propDetails)
		propertyComment += getAcfFieldComment(acfFieldType)
	}

	if description, ok := propDetails["description"]; ok {
		if description != "" {
			propertyComment += fmt.Sprintf("  * %s\n", description)
		}
	}

	propertyComment += "*/\n"

	if propertyComment == "/**\n*/\n" {
		return ""
	}

	return propertyComment
}

func getAcfFieldType(propName string, propDetails map[string]interface{}) string {
	if description, ok := propDetails["description"]; ok {
		if strings.Contains(description.(string), "A `Ymd` formatted date string.") {
			return "date picker"
		}
		if strings.Contains(description.(string), "A `Y-m-d H:i:s` formatted date string.") {
			return "date time picker"
		}
	}

	if items, ok := propDetails["items"].(map[string]interface{}); ok {
		if oneOf, ok := items["oneOf"].([]interface{}); ok {
			if len(oneOf) > 0 {
				return "flexible content"
			}
		}
	}
	if format, ok := propDetails["format"].(string); ok {
		if format == "email" {
			return "email"
		}
	}

	propertiesMap, ok := propDetails["properties"].(map[string]interface{})
	if ok {
		if propertiesMap["target"] != nil && propertiesMap["title"] != nil && propertiesMap["url"] != nil {
			return "link"
		}
	}

	return ""
}

func getAcfFieldComment(acfFieldType string) string {
	if acfFieldType == "" {
		return ""
	}

	comment := `  * ACF: ` + cases.Title(language.English).String(acfFieldType) + "\n"
	if acfFieldType == "flexible content" {
		comment += " *\n"
		comment += ` * Enables the creation of a series of subfields which can be dynamically repeated and ordered.` + "\n"
		comment += ` * @see https://www.advancedcustomfields.com/resources/flexible-content/` + "\n"
	}
	if acfFieldType == "repeater" {
		comment += " *\n"
		comment += ` * Enables the creation of a series of subfields which can be dynamically repeated and ordered.` + "\n"
		comment += ` * @see https://www.advancedcustomfields.com/resources/repeater/` + "\n"
	}

	// if acfFieldType == "date picker" {
	// 	comment += " *\n"
	// 	comment += ` * Provides an interface for date selection, allowing a user-friendly way to pick a date.` + "\n"
	// 	comment += ` * @see https://www.advancedcustomfields.com/resources/date-picker/` + "\n"
	// }

	// if acfFieldType == "date time picker" {
	// 	comment += " *\n"
	// 	comment += ` * Allows users to select both a date and a time, with an intuitive interface for time-sensitive content.` + "\n"
	// 	comment += ` * @see https://www.advancedcustomfields.com/resources/date-time-picker/` + "\n"
	// }

	// if acfFieldType == "email" {
	// 	comment += " *\n"
	// 	comment += ` * A specialized field for email addresses, ensuring valid email format input.` + "\n"
	// 	comment += ` * @see https://www.advancedcustomfields.com/resources/email/` + "\n"
	// }

	// if acfFieldType == "link" {
	// 	comment += " *\n"
	// 	comment += ` * A comprehensive field for adding links, including URL, title, and target, for a complete linking solution.` + "\n"
	// 	comment += ` * @see https://www.advancedcustomfields.com/resources/link/` + "\n"
	// }

	return comment
}
