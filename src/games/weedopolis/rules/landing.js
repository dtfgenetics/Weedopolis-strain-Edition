export function resolveLanding(space) {
  if (!space) return { action: 'missing_space', message: 'Board space not found.' };

  switch (space.space_type) {
    case 'corner':
      return resolveCorner(space);
    case 'property':
      return { action: 'property', canBuy: true, rentDue: true, space };
    case 'category':
      return { action: 'premium_line', canBuy: true, rentDue: true, space };
    case 'utility':
      return { action: 'utility', canBuy: true, rentDue: true, space };
    case 'card':
      return { action: space.space_name === 'High Chance' ? 'draw_high_chance' : 'draw_community_stash', space };
    case 'tax':
      return { action: 'pay_tax', amount: 200, space };
    case 'fee':
      return { action: 'pay_fee', amount: 100, space };
    default:
      return { action: 'unknown', space };
  }
}

function resolveCorner(space) {
  if (space.space_name === 'Start Session') return { action: 'start_session', amount: 200, space };
  if (space.space_name === 'Compliance Check') return { action: 'go_to_trim_jail', space };
  if (space.space_name === 'Smoke Break') return { action: 'safe_space', space };
  return { action: 'trim_jail_or_visiting', space };
}
