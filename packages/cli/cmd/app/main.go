package main

import (
	"log"
	"log/slog"
	"os"

	"github.com/CalebBarnes/nextwp/cli/services/typegen"
	"github.com/joho/godotenv"
	"github.com/urfave/cli/v2"
)

func main() {

	os.Setenv("ENVIRONMENT", "development")
	err := godotenv.Load(".env.local")
	if err != nil {
		os.Setenv("ENVIRONMENT", "production")
	}

	if os.Getenv("NEXTWP_CLI_WORKING_DIR") != "" {
		err := os.Chdir(os.Getenv("NEXTWP_CLI_WORKING_DIR"))
		if err != nil {
			log.Fatal(err)
		}
	}

	app := &cli.App{
		Name:  "@nextwp/cli",
		Usage: "NextWP CLI",
		Action: func(c *cli.Context) error {
			slog.Info("Welcome to @nextwp/cli")
			return nil
		},
		Commands: []*cli.Command{
			{
				Name:  "typegen",
				Usage: "Generate TypeScript types for your WP REST API schema",
				Action: func(c *cli.Context) error {
					return typegen.GenerateTypes()
				},
			},
			// {
			// 	Name:  "pull-acf-json",
			// 	Usage: "Pull ACF JSON from WordPress",
			// 	Action: func(c *cli.Context) error {
			// 		return wordpress.PullAcfJson()
			// 	},
			// },
			// {
			// 	Name:  "push-acf-json",
			// 	Usage: "Push ACF JSON to WordPress",
			// 	Action: func(c *cli.Context) error {
			// 		return wordpress.PushAcfJson()
			// 	},
			// },
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
