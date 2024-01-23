package wordpress

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

/*
* Pulls the acf json from the wordpress site and saves it to the local filesystem
 */
func PullAcfJson() error {
	wpUrl := os.Getenv("WP_URL")

	fmt.Println("Pulling saved acf json from: " + wpUrl)

	req, err := http.NewRequest("GET", wpUrl+"/wp-json/nextwp/v1/acf-json", nil)
	if err != nil {
		return err
	}
	auth := "Basic " + base64.StdEncoding.EncodeToString([]byte(os.Getenv("WP_APPLICATION_PASSWORD")))

	req.Header.Add("Authorization", auth)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var result map[string]interface{}
	err = json.Unmarshal([]byte(body), &result)
	if err != nil {
		return err
	}

	// loop over the json array in body, and write each key to its own file
	for key, value := range result {
		fmt.Println("Pulling field group: " + value.(map[string]interface{})["title"].(string))

		// convert value back into json string
		jsonString, err := json.Marshal(value)
		if err != nil {
			return err
		}

		// using the key as the filename, write each value to its own file
		err = os.WriteFile(key, jsonString, 0644)

		if err != nil {
			return err
		}

	}

	return nil
}

/*
* Pushes the acf json from the local filesystem to the wordpress site
 */
func PushAcfJson() error {
	wpUrl := os.Getenv("WP_URL")

	files, err := os.ReadDir(".")
	if err != nil {
		return err
	}

	result := make(map[string]interface{})

	for _, file := range files {
		if file.IsDir() {
			continue
		}

		if file.Name()[len(file.Name())-5:] != ".json" {
			continue
		}

		fmt.Println("Pushing field group: " + file.Name())

		contents, contentsErr := os.ReadFile(file.Name())
		if contentsErr != nil {
			return contentsErr
		}

		var fieldGroup map[string]interface{}
		err = json.Unmarshal([]byte(contents), &fieldGroup)
		if err != nil {
			return err
		}

		result[file.Name()] = fieldGroup

	}

	jsonBytes, err := json.MarshalIndent(result, "", "  ")

	if err != nil {
		return err
	}

	fmt.Println("Pushing saved acf json to: " + wpUrl)
	// println(string(jsonBytes))

	req, err := http.NewRequest("POST", wpUrl+"/wp-json/nextwp/v1/acf-json", nil)
	if err != nil {
		return err
	}

	auth := "Basic " + base64.StdEncoding.EncodeToString([]byte(os.Getenv("WP_APPLICATION_PASSWORD")))

	req.Header.Add("Authorization", auth)

	req.Body = io.NopCloser(bytes.NewReader(jsonBytes))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	println(resp.Status)

	return nil
}
