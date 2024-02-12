package main

import (
	"log"
	"log/slog"
	"os"
	"strings"

	"github.com/CalebBarnes/nextwp/cli/services/typegen"
	"github.com/CalebBarnes/nextwp/cli/services/wordpress"
	"github.com/joho/godotenv"
	"github.com/urfave/cli/v2"
)

var version = "development"

func main() {
	godotenv.Load(".env.local")
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
		Before: func(c *cli.Context) error {
			if c.Bool("version") {
				version = strings.Replace(version, "nextwp-cli-", "", -1)
				println(version)
				os.Exit(0)
			}
			return nil
		},
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name:               `version`,
				Aliases:            []string{`v`},
				DisableDefaultText: true,
				Usage:              `Check the version of @nextwp/cli`,
			},
		},
		Commands: []*cli.Command{
			{
				Name:  "typegen",
				Usage: "Generate TypeScript types for your WP REST API schema (WIP but works)",
				Action: func(c *cli.Context) error {
					loadProjectEnvs()
					checkRequiredEnvs()
					return typegen.GenerateTypes()
				},
			},
			{
				Name:  "pull-acf-json",
				Usage: "Pull ACF JSON from WordPress (WIP but works)",
				Action: func(c *cli.Context) error {
					loadProjectEnvs()
					checkRequiredEnvs()
					return wordpress.PullAcfJson()
				},
			},
			{
				Name:  "push-acf-json",
				Usage: "Push ACF JSON to WordPress (WIP)",
				Action: func(c *cli.Context) error {
					loadProjectEnvs()
					checkRequiredEnvs()
					return wordpress.PushAcfJson()
				},
			},
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}

func loadProjectEnvs() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	err = godotenv.Load(cwd + "/.env.production")
	if err != nil {
		err = godotenv.Load(cwd + "/.env.development")
		if err != nil {
			err = godotenv.Load(cwd + "/.env.local")
			if err != nil {
				log.Fatal("\x1b[32m[@nextwp/cli]\x1b[0m Error loading .env file (production, development, local)")
				log.Fatal(err)
			}
		}
	}
	if os.Getenv("NEXT_PUBLIC_WP_URL") != "" {
		os.Setenv("WP_URL", os.Getenv("NEXT_PUBLIC_WP_URL"))
	}
}

func checkRequiredEnvs() {
	if os.Getenv("WP_URL") == "" {
		log.Fatal("\x1b[32m[@nextwp/cli]\x1b[0m WP_URL or NEXT_PUBLIC_WP_URL is not set. You should run this command in the root of your project with a .env file (.env.production, .env.development, .env.local)")
	}
	if os.Getenv("WP_APPLICATION_PASSWORD") == "" {
		log.Fatal("\x1b[32m[@nextwp/cli]\x1b[0m WP_APPLICATION_PASSWORD is not set. You should run this command in the root of your project with a .env file (.env.production, .env.development, .env.local)")
	}
}
