export function readMultiplayerConfig(source = globalThis) {
  const config = source.WEEDOPOLIS_MULTIPLAYER || {};
  return {
    provider: config.provider || 'supabase',
    supabaseUrl: config.supabaseUrl || '',
    supabaseAnonKey: config.supabaseAnonKey || '',
    enabled: Boolean(config.supabaseUrl && config.supabaseAnonKey)
  };
}

export function requireMultiplayerConfig(config) {
  if (!config?.enabled) {
    throw new Error('Online multiplayer requires WEEDOPOLIS_MULTIPLAYER.supabaseUrl and supabaseAnonKey.');
  }
  return config;
}
