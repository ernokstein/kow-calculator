import { fact, rangeFromIncl, rangeIncl, sum } from './utils.js'

/// (number, number, number) -> number
export function getExactSuccessResultChance(dice, probSuccess, successes) {
  const probMiss = 1 - probSuccess
  const misses = dice - successes
  const a = fact(dice) / fact(successes) / fact(misses)
  const b = probSuccess ** successes * probMiss ** misses
  return a * b
}

/// (number, number, number) -> number
export function getExactRollResultChance(dice, minRequired, successes) {
  return getExactSuccessResultChance(dice, (7 - minRequired) / 6 , successes)
}

/// (number, number, boolean) -> [number]
export function getSucessChanceTable(att, me, rerollOnes) {
  const normalSuccessChanceTable = []
  for (let hits of rangeIncl(att)) {
    normalSuccessChanceTable[hits] = getExactRollResultChance(att, me, hits)
  }
  if (rerollOnes) {
    const successChanceTableWithRerolls = []
    for (const hits of rangeIncl(att)) {
      let chance = 0
      for (const normalHits of rangeIncl(hits)) {
        const requiredRerollHits = hits - normalHits
        const missedDice = att - normalHits
        chance +=
            normalSuccessChanceTable[normalHits] * 
            getChanceOfExactRerollHits(me, requiredRerollHits, missedDice)
      }
      successChanceTableWithRerolls[hits] = chance
    }
    return successChanceTableWithRerolls
  } else {
    return normalSuccessChanceTable
  }
}

/// (number, number) -> number
function getChanceOfExactRerollHits(me, rerollHits, missedDice) {
  const probOne = 1 / (me - 1) // die that already missed
  let chance = 0
  for (const ones of rangeFromIncl(rerollHits, missedDice)) {
    chance +=
        getExactSuccessResultChance(missedDice, probOne, ones) *
        getExactRollResultChance(ones, me, rerollHits)
  }
  return chance
}

/// (number, number) -> [[number]]
export function getDmgChanceTableByHits(maxHits, de, vicious) {
  const dmgChanceTableByHits = []
  for (let hits of rangeIncl(maxHits)) {
    dmgChanceTableByHits[hits] = getSucessChanceTable(hits, de, vicious)
  }
  return dmgChanceTableByHits
}

/// ([number], { att: number, me: number, elite, vicious }, { de: number }) -> [number]
export function getDmgChanceTable(hitsChanceTable, attacker, defender) {
  const maxHits = hitsChanceTable.length - 1
  const dmgChanceTableByHits = getDmgChanceTableByHits(maxHits, defender.de, attacker.vicious)

  const finalDmgChanceTable = []
  for (let hits of dmgChanceTableByHits.keys()) {
    const hitsChance = hitsChanceTable[hits]
    const dmgChanceTable = dmgChanceTableByHits[hits]
    for (let dmg of dmgChanceTable.keys()) {
      const dmgChance = dmgChanceTable[dmg]
      finalDmgChanceTable[dmg] = (finalDmgChanceTable[dmg] ?? 0) + dmgChance * hitsChance
    }
  }
  return finalDmgChanceTable
}

/// (number, number, number) -> number
export function getDmgAvg(att, me, de) {
  return sum(getDmgChanceTable(att, me, de).map((dmg, chance) => dmg * chance))
}

const _2d6chanceTable = [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
  .map(posibilities => posibilities / 36)

const _2d6orMoreChanceTable = [...rangeIncl(12)]
  .map(orMore => sum(_2d6chanceTable.slice(orMore)))

/// (number) -> number
export function get2d6successChance(required) {
  if (required > 12) {
    return 0
  } else {
    return _2d6orMoreChanceTable[required]
  }
}

/// ({ weaver: number, rout: number }, number, boolean) -> { weaverChance: number, routChance: number }
export function getNerveChance(ne, dmg, inspired) {
  let routChance = get2d6successChance(Math.max(3, ne.rout - dmg))
  let weaverChance = get2d6successChance(Math.min(12, Math.max(3, ne.weaver - dmg))) - routChance
  if (inspired) {
    routChance = routChance ** 2
    weaverChance = weaverChance + routChance * weaverChance
  }
  return {
    routChance,
    weaverChance,
  }
}

/// ([number], { de, ne: { weaver, rout }, inspired: boolean }) -> { weaverChance, routChance}
export function getKillChance(dmgChanceTable, defender) {
  const nerveChanceByDmg = dmgChanceTable.map((_, dmg) => 
    dmg === 0 
      ? { weaverChance: 0, routChance: 0} 
      : getNerveChance(defender.ne, dmg, defender.inspired)
  )
  const totalNerveChance = {
    routChance: 0,
    weaverChance: 0,
  }
  for (let dmg of nerveChanceByDmg.keys()) {
    totalNerveChance.routChance += nerveChanceByDmg[dmg].routChance * dmgChanceTable[dmg]
    totalNerveChance.weaverChance += nerveChanceByDmg[dmg].weaverChance * dmgChanceTable[dmg]
  }
  return totalNerveChance
}
