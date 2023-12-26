export function toCamel(str: string): string {
  return str.replace(/(?<temp1>[-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
}
