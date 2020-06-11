export function fact(n) {
  if (n <= 1) {
    return 1;
  } else {
    return fact(n - 1) * n;
  }
}
export function sum(array) {
  return array.reduce((a, b) => a + b, 0);
}
export function range(n) {
  return Array(n).keys();
}
export function range_incl(n) {
  return Array(n + 1).keys();
}
export function range_from_incl(from, to) {
  return [...Array(to - from + 1).keys()].map((_, i) => i + from);
}

/// (number, number, number) -> number
export function get_dice_successes_chance(dices, required, successes) {
  const misses = dices - successes;
  const a = fact(dices) / fact(successes) / fact(misses);
  const b = ((7 - required) / 6) ** successes * ((required - 1) / 6) ** misses;
  return a * b;
}

/// (number, number) -> [number]
export function get_success_chance_table(att, me) {
  const hits_chance_table = [];
  for (let hits of range_incl(att)) {
    hits_chance_table[hits] = get_dice_successes_chance(att, me, hits);
  }
  return hits_chance_table;
}

/// (number, number) -> [[number]]
export function get_dmg_chance_table_by_hits(max_hits, de) {
  const dmg_chance_table_by_hits = [];
  for (let hits of range_incl(max_hits)) {
    dmg_chance_table_by_hits[hits] = get_success_chance_table(hits, de);
  }
  return dmg_chance_table_by_hits;
}

/// (number, number, number) -> [number]
export function get_dmg_chance_table(att, me, de) {
  const hits_chance_table = get_success_chance_table(att, me);

  const max_hits = hits_chance_table.length - 1;
  const dmg_chance_table_by_hits = get_dmg_chance_table_by_hits(max_hits, de);

  const final_dmg_chance_table = [];
  for (let hits of dmg_chance_table_by_hits.keys()) {
    const hits_chance = hits_chance_table[hits];
    const dmg_chance_table = dmg_chance_table_by_hits[hits];
    for (let dmg of dmg_chance_table.keys()) {
      const dmg_chance = dmg_chance_table[dmg];
      final_dmg_chance_table[dmg] = (final_dmg_chance_table[dmg] ?? 0) + dmg_chance * hits_chance;
    }
  }
  return final_dmg_chance_table;
}

/// (number, number, number) -> number
export function get_dmg_avg(att, me, de) {
  return sum(get_dmg_chance_table(att, me, de).map((dmg, chance) => dmg * chance));
}

/// (number) -> number
export function get_2d6_success_chance(required) {
  if (required > 12) {
    return 0;
  } else {
    const number_chance_times_36 = [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    return sum(range_from_incl(required, 12).map((n) => number_chance_times_36[n])) / 36;
  }
}

/// ({ weaver: number, route: number }, number, boolean) -> { weaver_chance: number, route_chance: number }
export function get_nerve_chance(ne, dmg, inspired) {
  let route_chance = get_2d6_success_chance(Math.max(3, ne.route - dmg));
  let weaver_chance = get_2d6_success_chance(Math.max(3, ne.weaver - dmg)) - route_chance;
  if (ne.route - dmg > 12 && ne.weaver > 12) {
    weaver_chance = get_2d6_success_chance(12);
  }
  if (inspired) {
    route_chance = route_chance ** 2;
    weaver_chance = weaver_chance + route_chance * weaver_chance;
  }
  return {
    route_chance,
    weaver_chance,
  };
}
/// ({ att, me }, { de, ne: { weaver, route }, inspired: boolean }) -> { weaver_chance, route_chance}
export function get_kill_chance(attacker, defender) {
  const dmg_chance_table = get_dmg_chance_table(attacker.att, attacker.me, defender.de);
  const nerve_chance_by_dmg = dmg_chance_table.map((_, dmg) => get_nerve_chance(defender.ne, dmg, defender.inspired));
  const total_nerve_chance = {
    route_chance: 0,
    weaver_chance: 0,
  };
  for (let dmg of nerve_chance_by_dmg.keys()) {
    total_nerve_chance.route_chance += nerve_chance_by_dmg[dmg].route_chance * dmg_chance_table[dmg];
    total_nerve_chance.weaver_chance += nerve_chance_by_dmg[dmg].weaver_chance * dmg_chance_table[dmg];
  }
  return total_nerve_chance;
}
