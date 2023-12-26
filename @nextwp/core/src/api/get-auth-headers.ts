export function getAuthHeaders(): HeadersInit | undefined {
  if (!process.env.WP_APPLICATION_PASSWORD) {
    return;
  }
  return {
    Authorization: `Basic ${btoa(process.env.WP_APPLICATION_PASSWORD)}`,
  };
}
