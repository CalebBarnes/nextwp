export function getAuthHeaders(
  wpApplicationPassword?: string
): HeadersInit | undefined {
  if (!process.env.WP_APPLICATION_PASSWORD && !wpApplicationPassword) {
    return;
  }
  return {
    Authorization: `Basic ${btoa(
      wpApplicationPassword || process.env.WP_APPLICATION_PASSWORD
    )}`,
  };
}
