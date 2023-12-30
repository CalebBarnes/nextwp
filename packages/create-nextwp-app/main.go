package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/urfave/cli/v2"
)

const repoURL = "https://github.com/CalebBarnes/nextwp"
const starterProjectSubDir = "apps/next-wordpress-starter"

func main() {
	app := &cli.App{
		Name:  "create-nextwp-app",
		Usage: "Create a new NextWP project",
		Action: func(c *cli.Context) error {
			projectName := c.Args().First()
			if projectName == "" {
				fmt.Print("Enter your project name: ")
				reader := bufio.NewReader(os.Stdin)
				input, err := reader.ReadString('\n')
				if err != nil {
					log.Fatalf("Error reading project name: %s", err)
				}
				projectName = strings.TrimSpace(input)
				if projectName == "" {
					log.Fatal("No project name entered. Exiting.")
				}
			}

			fmt.Printf("Initializing nextwp project: %s\n", projectName)

			// Check if the WORKING_DIR environment variable is set
			workingDir := os.Getenv("WORKING_DIR")
			if workingDir == "" {
				// If not, use the current working directory
				cwd, err := os.Getwd()
				if err != nil {
					return err
				}
				workingDir = cwd
			}

			// Create a path for the new project directory
			projectDir := fmt.Sprintf("%s/%s", workingDir, projectName)

			cmd := exec.Command("git", "clone", "--depth", "1", "--filter=blob:none", repoURL, projectDir)
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// Change directory to the new project directory
			if err := os.Chdir(projectDir); err != nil {
				return err
			}

			// log current working directory
			cwd, err := os.Getwd()
			if err != nil {
				return err
			}
			fmt.Printf("Current working directory: %s\n", cwd)

			// remove the old .git directory
			if err := os.RemoveAll(".git"); err != nil {
				return err
			}

			// make temp dir
			if err := os.Mkdir("temp", 0755); err != nil {
				return err
			}

			// move subdirectory dir to root/temp
			files, err := os.ReadDir(starterProjectSubDir)
			if err != nil {
				return err
			}
			for _, file := range files {
				oldPath := filepath.Join(starterProjectSubDir, file.Name())
				newPath := filepath.Join("temp", file.Name())
				err := os.Rename(oldPath, newPath)
				if err != nil {
					return err
				}
			}

			// remove all files from project root except for temp dir
			files, err = os.ReadDir(".")
			if err != nil {
				return err
			}
			for _, file := range files {
				if file.Name() != "temp" {
					err := os.RemoveAll(file.Name())
					if err != nil {
						return err
					}
				}
			}

			// move temp files to project root, and then delete temp dir
			files, err = os.ReadDir("temp")
			if err != nil {
				return err
			}
			for _, file := range files {
				oldPath := filepath.Join("temp", file.Name())
				newPath := filepath.Join(".", file.Name())
				err := os.Rename(oldPath, newPath)
				if err != nil {
					return err
				}
			}
			err = os.RemoveAll("temp")
			if err != nil {
				return err
			}

			// update package.json name
			// Read the file
			content, err := os.ReadFile("package.json")
			if err != nil {
				return err
			}
			// Replace the string
			newContent := strings.Replace(string(content), "next-wordpress-starter", projectName, -1)
			// Write the updated content back to the file
			err = os.WriteFile("package.json", []byte(newContent), 0644)
			if err != nil {
				return err
			}

			// log the location of the new project
			fmt.Printf("Initialized project at: %s\n", projectDir)
			fmt.Println("cd " + projectName)

			// init new git repo
			cmd = exec.Command("git", "init")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			cmd = exec.Command("git", "add", ".")
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			cmd = exec.Command("git", "commit", "-m", "Initial commit")
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			return nil
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
