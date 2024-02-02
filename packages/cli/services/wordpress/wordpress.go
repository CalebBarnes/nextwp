package wordpress

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/CalebBarnes/nextwp/cli/services/utils"
)

func GetPostTypes() map[string]interface{} {
	endpoint := os.Getenv("WP_URL") + "/wp-json/wp/v2/types"

	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return nil
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}
	result := utils.ConvertJsonToMap(body)

	err = json.Unmarshal([]byte(body), &result)
	if err != nil {
		return nil
	}
	return result
}

func GetSchema(postType string) map[string]interface{} {
	endpoint := os.Getenv("WP_URL") + "/wp-json/wp/v2/" + postType + "?context=edit"

	req, err := http.NewRequest("OPTIONS", endpoint, nil)
	if err != nil {
		return nil
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}
	result := utils.ConvertJsonToMap(body)

	err = json.Unmarshal([]byte(body), &result)
	if err != nil {
		return nil
	}
	return result
}

// func GetItem(postType string) interface{} {
// 	endpoint := os.Getenv("WP_URL") + "/wp-json/wp/v2/" + postType + "?per_page=1"
// 	fmt.Println("Get Items: " + endpoint)

// 	req, err := http.NewRequest("GET", endpoint, nil)
// 	if err != nil {
// 		return nil
// 	}

// 	resp, err := http.DefaultClient.Do(req)
// 	if err != nil {
// 		return nil
// 	}
// 	defer resp.Body.Close()

// 	body, err := io.ReadAll(resp.Body)
// 	if err != nil {
// 		return nil
// 	}
// 	var result []interface{}
// 	err = json.Unmarshal(body, &result)
// 	if err != nil {
// 		return nil
// 	}
// 	err = json.Unmarshal([]byte(body), &result)
// 	if err != nil {
// 		return nil
// 	}
// 	return result[0]
// }
