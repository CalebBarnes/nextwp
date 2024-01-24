package typegen

import (
	"fmt"

	"github.com/CalebBarnes/nextwp/cli/services/wordpress"
)

func GenerateTypes() error {
	fmt.Println("Generating types...")
	postTypes := wordpress.GetPostTypes()

	for key, value := range postTypes {
		if key == "wp_template" || key == "wp_template_part" || key == "wp_block" || key == "wp_navigation" || key == "nav_menu_item" || key == "attachment" {
			continue
		}

		fmt.Println("-----------------------------------")
		fmt.Println(key)
		// fmt.Println(value["rest_base"])

		// prettyJson, err := json.MarshalIndent(value, "", "  ")
		// if err != nil {
		// 	log.Fatal(err)
		// }

		// fmt.Println(string(prettyJson))
		fmt.Println("-----------------------------------")

		// Assuming value is a map
		if mappedValue, ok := value.(map[string]interface{}); ok {
			// Now you can index mappedValue
			restBase := mappedValue["rest_base"].(string)
			// ...

			item := wordpress.GetItem(restBase)

			// get the id of the item
			if newMappedValue, ok := item.(map[string]interface{}); ok {
				fmt.Println(newMappedValue["id"].(float64))
			}

			// itemJson, err := json.MarshalIndent(item, "", "  ")
			// if err != nil {
			// 	log.Fatal(err)
			// }

			// fmt.Println(string(itemJson))
		}

		fmt.Println("-----------------------------------")

	}

	// get post types
	// get each post type schema
	// get taxonomies
	// get each taxonomy schema

	// generate types
	return nil
}
