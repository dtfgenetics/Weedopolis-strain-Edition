// Weedopolis card asset loader
// Put this whole folder in your public assets path, for example: /assets/weedopolis/cards/

export async function loadWeedopolisCards(baseUrl = '/assets/weedopolis/cards') {
  const res = await fetch(`${baseUrl}/data/weedopolis-cards.json`);
  if (!res.ok) throw new Error(`Failed to load Weedopolis cards: ${res.status}`);
  const data = await res.json();
  const withUrls = data.cards.map(card => ({
    ...card,
    image: `${baseUrl}/${card.assets.webpMedium}`,
    imageLarge: `${baseUrl}/${card.assets.webpLarge}`,
    imagePrint: `${baseUrl}/${card.assets.printPng}`,
    thumb: `${baseUrl}/${card.assets.thumbnail}`
  }));
  return { ...data, cards: withUrls };
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
