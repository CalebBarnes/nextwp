package typegen

import (
	"fmt"

	"github.com/CalebBarnes/nextwp/cli/services/utils"
	"github.com/CalebBarnes/nextwp/cli/services/wordpress"
)

func GenerateTypes() error {
	fmt.Println("Generating types...")
	postTypes := wordpress.GetPostTypes()

	for key, value := range postTypes {
		if key == "wp_template" || key == "wp_template_part" || key == "wp_block" || key == "wp_navigation" || key == "nav_menu_item" || key == "" {
			continue
		}

		fmt.Println("-----------------------------------")
		fmt.Println(key)
		fmt.Println(value["rest_base"])

		jsonBytes := utils.ConvertMapToJson(value)
		fmt.Println(string(jsonBytes))
		fmt.Println("-----------------------------------")

		schema := wordpress.GetSchema(key)
		schemaJson := utils.ConvertMapToJson(schema)
		fmt.Println(string(schemaJson))
		fmt.Println("-----------------------------------")

	}

	// get post types
	// get each post type schema
	// get taxonomies
	// get each taxonomy schema

	// generate types
	return nil
}
