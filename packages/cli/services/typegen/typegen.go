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

type TypeGenerator struct {
	PostTypes      map[string]interface{}
	generatedFiles []string
}

type Schema struct {
	Properties map[string]interface{}
	TypeName   string
}

type GeneratedContent struct {
	PropertiesContent string
	AdditionalTypes   string
}

func (tg *TypeGenerator) GenerateTypes() error {
	println("\x1b[32m[@nextwp/cli]\x1b[0m Generating types for " + os.Getenv("WP_URL"))

	for key, value := range tg.PostTypes {
		if key == "wp_template" || key == "wp_template_part" || key == "wp_block" || key == "wp_navigation" || key == "nav_menu_item" || key == "attachment" {
			continue
		}
		tg.ProcessPostType(key, value)
	}
	utils.FormatFilesWithPrettier(tg.generatedFiles)
	return nil
}

func (tg *TypeGenerator) ProcessPostType(key string, value interface{}) {
	titleCaser := cases.Title(language.English)
	pascalCaseKey := titleCaser.String(key)

	if mappedValue, ok := value.(map[string]interface{}); ok {
		restBase := mappedValue["rest_base"].(string)
		schemaProperties := wordpress.GetSchema(restBase)["schema"].(map[string]interface{})["properties"].(map[string]interface{})

		schema := Schema{
			Properties: schemaProperties, // Ensure this is defined correctly
			TypeName:   pascalCaseKey,
		}

		filePath := schema.GenerateTypeScriptFile() // each post type gets its own file
		tg.generatedFiles = append(tg.generatedFiles, filePath)
	}
}

func (s *Schema) GenerateTypeScriptFile() string {
	generatedContent := s.GenerateTSProperties(s.TypeName)

	fileContent := "export interface " + s.TypeName + " {\n"
	fileContent += generatedContent.PropertiesContent
	fileContent += "}\n"

	if generatedContent.AdditionalTypes != "" {
		fileContent += "\n" + generatedContent.AdditionalTypes
	}

	fileName := strings.ReplaceAll(strings.ToLower("./types/"+s.TypeName+".ts"), " ", "-")
	file, err := os.Create(fileName)
	if err != nil {
		log.Fatalf("Failed to create file: %v", err)
	}
	defer file.Close()

	jsonSchema, err := json.MarshalIndent(s.Properties, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal schema: %v", err)
	}

	fileContent += "\n\nconst schema = " + string(jsonSchema) + "\n"

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

func (s *Schema) GenerateTSProperties(parentName string) GeneratedContent {
	var propertiesContent string
	var additionalTypes string
	var sortedKeys []string
	// sort keys alphabetically
	for propName := range s.Properties {
		sortedKeys = append(sortedKeys, propName)
	}
	sort.Strings(sortedKeys)

	for _, propName := range sortedKeys {
		propDetails := s.Properties[propName]
		if propName == "" {
			continue // Skip properties with empty names
		}

		// Create individual types for oneOf schemas (flexible content layouts)
		if oneOfSchemas, ok := ExtractOneOf(propDetails); ok {
			var moduleTypes []string
			for _, oneOfSchema := range oneOfSchemas {

				layoutProps := oneOfSchema["properties"].(map[string]interface{})
				layoutPattern := strings.Trim(layoutProps["acf_fc_layout"].(map[string]interface{})["pattern"].(string), "^$")
				layoutNameWords := strings.Split(layoutPattern, "-")
				for i, word := range layoutNameWords {
					layoutNameWords[i] = cases.Title(language.English).String(word)
				}

				fmt.Println(layoutNameWords)

				layoutName := strings.Join(layoutNameWords, "")
				fmt.Println(layoutName)

				// layoutName := fmt.Sprintf("%s%s", "FC_Layout", layoutName)

				// Create a new Schema instance for each oneOf schema
				oneOfSchemaInstance := Schema{
					Properties: oneOfSchema,
					TypeName:   layoutName,
				}

				// Generate TypeScript properties and additional types for this oneOf schema
				oneOfGeneratedContent := oneOfSchemaInstance.GenerateTSProperties(layoutName)

				// Add the generated properties content as a new type definition
				additionalTypes += fmt.Sprintf("type %s = {%s}\n", layoutName, oneOfGeneratedContent.PropertiesContent)

				// Append any additional types generated within the oneOf schema
				if oneOfGeneratedContent.AdditionalTypes != "" {
					additionalTypes += oneOfGeneratedContent.AdditionalTypes + "\n"
				}

				moduleTypes = append(moduleTypes, layoutName)
			}
			propertiesContent += fmt.Sprintf("  %s?: %s;\n", propName, strings.Join(moduleTypes, " | "))
			continue
		}

		isOptional := false
		// todo: fetch acf fields from endpoint to get better type info and comments etc (is this still needed? I think I have covered most of them)
		isAcf := false
		propMap, ok := propDetails.(map[string]interface{})
		if !ok {
			continue // or handle error as appropriate
		}
		if required, exists := propMap["required"]; exists {
			isAcf = true
			if req, ok := required.(bool); ok && !req {
				isOptional = true
			}
		}

		propType := GetTsType(propName, propDetails, isAcf, parentName)

		if includeComments {
			propertiesContent += GeneratePropertyComment(propName, propType, propDetails.(map[string]interface{}), isAcf)
		}
		if isOptional {
			propertiesContent += fmt.Sprintf("  %s?: %s;\n", propName, propType)
		} else {
			propertiesContent += fmt.Sprintf("  %s: %s;\n", propName, propType)
		}
	}

	return GeneratedContent{
		PropertiesContent: propertiesContent,
		AdditionalTypes:   additionalTypes,
	}
}

func GetTsType(propName string, propDetails interface{}, isAcf bool, parentName string) string {
	propMap, ok := propDetails.(map[string]interface{})
	if !ok {
		return "any"
	}

	// Handling 'enum' within 'items' (e.g., acf select fields)
	if items, ok := propMap["items"].(map[string]interface{}); ok {
		if enumValues, ok := items["enum"].([]interface{}); ok {
			return enumToTsType(enumValues) + " | null"
		}
	}

	// Handling 'array' type with specific item types
	if propType, ok := propMap["type"]; ok && propType == "array" {
		if items, ok := propMap["items"].(map[string]interface{}); ok {
			if itemType, ok := items["type"].(string); ok {
				return BasicTypeToTsType(itemType) + "[]"
			}
		}
		return "any[]" // Fallback for arrays with unknown item types
	}

	// Handling specific string patterns (e.g., 'acf_fc_layout' field pattern value for flexible content layouts)
	if propName == "acf_fc_layout" && propMap["pattern"] != nil {
		pattern := propMap["pattern"].(string)
		return fmt.Sprintf("\"%s\"", strings.Trim(pattern, "^$"))
	}

	// Handling 'enum' for string types
	if enumValues, ok := propMap["enum"].([]interface{}); ok {
		return enumToTsType(enumValues)
	}

	// Handling nested objects (recursive call for nested properties)
	if properties, ok := propMap["properties"].(map[string]interface{}); ok {
		nestedSchema := Schema{Properties: properties}
		nestedContent := nestedSchema.GenerateTSProperties(cases.Title(language.English).String(propName))
		return "{\n" + nestedContent.PropertiesContent + "}"
	}

	// Fallback to basic type conversion
	if typeValue, ok := propMap["type"].(string); ok {
		return BasicTypeToTsType(typeValue)
	}

	return "any"
}

func JsonTypeToTsType(jsonType interface{}) string {
	switch v := jsonType.(type) {
	case string:
		// Handle basic types
		return BasicTypeToTsType(v)
	case []interface{}:
		// Handle enums and multiple types
		var types []string
		for _, elem := range v {
			if strType, ok := elem.(string); ok {
				tsType := BasicTypeToTsType(strType)
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

func BasicTypeToTsType(jsonType string) string {
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
		println("basicTypeToTsType: " + jsonType)
		return "any // ! @ NOT_IMPLEMENTED_BASIC_TYPE " + jsonType + " @"
	}
}

func GeneratePropertyComment(propName string, propType string, propDetails map[string]interface{}, isAcfField bool) string {
	var propertyComment string
	propertyComment += "/**\n"

	if isAcfField {
		acfFieldType := GetAcfFieldType(propDetails)
		propertyComment += GetAcfFieldComment(acfFieldType)
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

func GetAcfFieldType(propDetails map[string]interface{}) string {
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

func GetAcfFieldComment(acfFieldType string) string {
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

	return comment
}

func ExtractOneOf(propDetails interface{}) ([]map[string]interface{}, bool) {
	propMap, ok := propDetails.(map[string]interface{})
	if !ok {
		return nil, false
	}

	if items, ok := propMap["items"].(map[string]interface{}); ok {
		if oneOf, ok := items["oneOf"].([]interface{}); ok {
			var oneOfSchemas []map[string]interface{}
			for _, schema := range oneOf {
				if schemaMap, ok := schema.(map[string]interface{}); ok {
					oneOfSchemas = append(oneOfSchemas, schemaMap)
				}
			}
			return oneOfSchemas, true
		}
	}

	return nil, false
}
