import assert from 'node:assert/strict';
import fs from 'node:fs';

const provider = JSON.parse(fs.readFileSync('data/multiplayer_provider.json', 'utf8'));
assert.equal(provider.preferred_provider, 'wordpress_rest_polling');
assert.equal(provider.rest_namespace, 'weedopolis/v1');
assert(provider.required_endpoints.includes('POST /rooms'));
assert(provider.required_endpoints.includes('GET /rooms/{code}'));

const adapter = fs.readFileSync('src/games/weedopolis/multiplayer/wordpress-rest-adapter.js', 'utf8');
assert(adapter.includes('createWordPressRestMultiplayerAdapter'));
assert(adapter.includes('assertMultiplayerAdapter'));

const plugin = fs.readFileSync('wordpress-plugin/weedopolis-multiplayer/weedopolis-multiplayer.php', 'utf8');
assert(plugin.includes('Plugin Name: Weedopolis Multiplayer'));
assert(plugin.includes('rest_api_init'));

const rest = fs.readFileSync('wordpress-plugin/weedopolis-multiplayer/includes/rest.php', 'utf8');
assert(rest.includes('register_rest_route'));
assert(rest.includes('weedopolis/v1'));
assert(rest.includes('/rooms'));
assert(rest.includes('/join'));
assert(rest.includes('/state'));

const schema = fs.readFileSync('wordpress-plugin/weedopolis-multiplayer/includes/schema.php', 'utf8');
for (const table of ['rooms', 'players', 'game_states', 'events']) {
  assert(schema.includes(`weedopolis_${table}`));
}

console.log('wordpress multiplayer validation passed');
