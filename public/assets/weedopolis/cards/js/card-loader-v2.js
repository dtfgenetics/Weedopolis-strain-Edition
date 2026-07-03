function order2(order) {
  return String(order).padStart(2, '0');
}

function applyAssetPathRules(card, rules = {}) {
  if (card.assets) return card.assets;
  const vars = { order2: order2(card.order), id: card.id };
  const fill = pattern => pattern.replaceAll('{order2}', vars.order2).replaceAll('{id}', vars.id);
  return {
    webpMedium: fill(rules.webpMedium || 'cards/webp_384x512/{order2}_{id}.webp'),
    webpLarge: fill(rules.webpLarge || 'cards/webp_768x1024/{order2}_{id}.webp'),
    printPng: fill(rules.printPng || 'cards/png_1152x1536/{order2}_{id}.png'),
    thumbnail: fill(rules.thumbnail || 'cards/thumbs_180x240/{order2}_{id}.jpg')
  };
}

export async function loadWeedopolisCards(baseUrl = '/assets/weedopolis/cards') {
  const res = await fetch(`${baseUrl}/data/weedopolis-cards.json`);
  if (!res.ok) throw new Error(`Failed to load card data: ${res.status}`);
  const data = await res.json();
  const cards = data.cards.map(card => {
    const assets = applyAssetPathRules(card, data.assetPathRules);
    return {
      ...card,
      assets,
      image: `${baseUrl}/${assets.webpMedium}`,
      imageLarge: `${baseUrl}/${assets.webpLarge}`,
      imagePrint: `${baseUrl}/${assets.printPng}`,
      thumb: `${baseUrl}/${assets.thumbnail}`
    };
  });
  return { ...data, cards };
}

export function getCardByBoardPosition(cards, boardPosition) {
  return cards.find(card => card.boardPosition === boardPosition) || null;
}

export function getCardById(cards, id) {
  return cards.find(card => card.id === id) || null;
}

export function getPropertiesByGroup(cards, group) {
  return cards.filter(card => card.type === 'property' && card.group === group);
}
