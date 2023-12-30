package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
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

			fmt.Printf("Creating project: %s\n", projectName)

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
			cmd.Stdout = os.Stdout
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
			cmd = exec.Command("rm", "-rf", ".git")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// make temp dir
			cmd = exec.Command("mkdir", "temp")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// list the contents of the new project directory
			cmd = exec.Command("ls", "-la")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// move subdirectory dir to root/temp
			cmd = exec.Command("sh", "-c", "mv "+starterProjectSubDir+"/* temp/")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// remove all files from project root except for temp dir
			cmd = exec.Command("find", ".", "!", "-name", ".", "-prune", "!", "-name", "temp", "-exec", "rm", "-rf", "{}", "+")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// move temp files to project root, and then delete temp dir
			cmd = exec.Command("sh", "-c", "mv temp/* . && rm -rf temp")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// update package.json name
			cmd = exec.Command("sh", "-c", "sed -i '' 's/next-wordpress-starter/"+projectName+"/g' package.json")
			cmd.Stdout = os.Stdout
			cmd.Stderr = os.Stderr
			if err := cmd.Run(); err != nil {
				return err
			}

			// init new git repo
			cmd = exec.Command("git", "init")
			cmd.Stdout = os.Stdout
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
