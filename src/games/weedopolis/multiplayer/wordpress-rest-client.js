export function createWordPressRestClient({ rootUrl = '/wp-json/weedopolis/v1', nonce = '' } = {}) {
  return async function request(path, options = {}) {
    const response = await fetch(`${rootUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(nonce ? { 'X-WP-Nonce': nonce } : {}),
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) throw new Error(data?.message || `WordPress request failed: ${response.status}`);
    return data;
  };
}
