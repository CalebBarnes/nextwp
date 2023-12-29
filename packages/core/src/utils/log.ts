import type { ColorName } from "chalk";
import chalk from "chalk";

type LogArgs = {
  prefix?: string;
  prefixColor?: ColorName;
  separator?: string;
  messageColor?: ColorName;
};

export function log(
  message: any,
  {
    prefix = "@nextwp/core",
    prefixColor = "red",
    separator = "-",
    messageColor = "white",
  }: LogArgs = {
    prefix: "@nextwp/core",
    prefixColor: "red",
    separator: "-",
    messageColor: "white",
  }
) {
  // eslint-disable-next-line no-console -- we're logging to console
  console.log(
    chalk[prefixColor](`${prefix}${chalk[messageColor](` ${separator}`)}`),
    message
  );
}
