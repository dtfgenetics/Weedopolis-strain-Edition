/* Browser tests: open index.html and run runWeedopolisTests() in the console. */
(function () {
  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function count(type) {
    return window.WEEDOPOLIS_EDITION.spaces.filter(function (space) { return space.type === type; }).length;
  }

  window.runWeedopolisTests = function () {
    const data = window.WEEDOPOLIS_EDITION;
    const spaces = data.spaces;
    const names = spaces.map(function (space) { return space.name; });
    const joined = names.join(' | ');
    const banned = [
      'Boardwalk','Park Place','Reading Railroad','Pennsylvania Railroad','B&O Railroad','Short Line',
      'Mediterranean Avenue','Baltic Avenue','Oriental Avenue','Vermont Avenue','Connecticut Avenue',
      'St. Charles Place','States Avenue','Virginia Avenue','St. James Place','Tennessee Avenue',
      'New York Avenue','Kentucky Avenue','Indiana Avenue','Illinois Avenue','Atlantic Avenue',
      'Ventnor Avenue','Marvin Gardens','Pacific Avenue','North Carolina Avenue','Pennsylvania Avenue'
    ];

    assert(data.gameName === 'Weedopolis', 'Game name must be Weedopolis.');
    assert(spaces.length === 40, 'Board must contain exactly 40 spaces.');
    assert(spaces[0].spaceNumber === 1 && spaces[0].name === 'Start Session', 'space_number 1 must map to square index 0.');
    assert(spaces[39].spaceNumber === 40 && spaces[39].name === 'Permanent Marker', 'space_number 40 must map to square index 39.');
    assert(count('corner') === 4, 'Board must contain 4 corners.');
    assert(count('property') === 22, 'Board must contain 22 strain properties.');
    assert(count('category') === 4, 'Board must contain 4 category spaces.');
    assert(count('utility') === 2, 'Board must contain 2 utilities.');
    assert(count('tax') + count('fee') === 2, 'Board must contain 2 taxes/fees.');
    assert(names.filter(function (name) { return name === 'High Chance'; }).length === 3, 'Board must contain 3 High Chance spaces.');
    assert(names.filter(function (name) { return name === 'Community Stash'; }).length === 3, 'Board must contain 3 Community Stash spaces.');
    ['Indica','Sativa','Hybrid','Autoflower','Grow Lights','Water Works','Trim Jail / Just Visiting','Compliance Check','Smoke Break'].forEach(function (required) {
      assert(names.includes(required), 'Missing required space: ' + required);
    });
    banned.forEach(function (oldName) {
      assert(!joined.includes(oldName), 'Old classic property name remains: ' + oldName);
    });
    assert(data.decks.highChance.length === 24, 'High Chance deck must contain 24 cards.');
    assert(data.decks.communityStash.length === 24, 'Community Stash deck must contain 24 cards.');
    console.info('Weedopolis tests passed:', {
      spaces: spaces.length,
      properties: count('property'),
      highChance: data.decks.highChance.length,
      communityStash: data.decks.communityStash.length
    });
    return true;
  };
})();
