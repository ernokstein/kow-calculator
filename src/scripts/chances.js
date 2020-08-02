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

/// (number, number, boolean, { die, plus }, boolean) -> [number]
export function getSucessChanceTable(att, me, rerollOnes, blast, rerollOneDie) {
  let finalSuccessChanceTable = getBasicSuccessChaneTable(att, me)
  if (rerollOnes) {
    finalSuccessChanceTable = applyRerollOnes(finalSuccessChanceTable, att, me, rerollOneDie)
  } else if (rerollOneDie) {
    finalSuccessChanceTable = applyRerollOneDie(finalSuccessChanceTable, att, me)
  }
  if (blast) {
    finalSuccessChanceTable = applyBlast(finalSuccessChanceTable, att, blast)
  }
  return finalSuccessChanceTable
}

function getBasicSuccessChaneTable(att, me) {
  const basicSuccessChaneTable = []
  for (let hits of rangeIncl(att)) {
    basicSuccessChaneTable[hits] = getExactRollResultChance(att, me, hits)
  }
  return basicSuccessChaneTable
}

function applyRerollOnes(normalSuccessChanceTable, att, me, rerollOneDie) {
  const successChanceTableWithRerolls = []
  for (const hits of rangeIncl(att)) {
    let chance = 0
    for (const normalHits of rangeIncl(hits)) {
      const requiredRerollHits = hits - normalHits
      const missedDice = att - normalHits
      chance +=
          normalSuccessChanceTable[normalHits] * 
          getChanceOfExactRerollHits(me, requiredRerollHits, missedDice, rerollOneDie)
    }
    successChanceTableWithRerolls[hits] = chance
  }
  return successChanceTableWithRerolls
}

function applyRerollOneDie(normalSuccessChanceTable, att, me) {
  const successChanceTableWithRerolls = []
  const rerollSuccess = (7 - me) / 6
  const rerollFail = 1 - rerollSuccess
  for (const hits of rangeIncl(att)) {
    let chance = 0
    if (hits > 0) {
      chance += normalSuccessChanceTable[hits - 1] * rerollSuccess
    }
    if (hits < att) {
      chance += normalSuccessChanceTable[hits] * rerollFail
    } else {
      chance += normalSuccessChanceTable[hits]
    }
    successChanceTableWithRerolls[hits] = chance
  }
  return successChanceTableWithRerolls
}

function applyBlast(normalSuccessChanceTable, att, blast) {
  const maxBlastPossible = att * (blast.die + blast.plus)
  const blastTable = Array(maxBlastPossible + 1).fill(0)
  blastTable[0] = normalSuccessChanceTable[0]
  for (const hits of rangeFromIncl(1, att)) {
    const blastDiceSumTable = getDiceSumTable(hits, blast.die)
    for (const blastDiceSum of blastDiceSumTable.keys()) {
      const blastDiceSumChance = blastDiceSumTable[blastDiceSum]
      blastTable[blastDiceSum + blast.plus * hits] += normalSuccessChanceTable[hits] * blastDiceSumChance
    }
  }
  return blastTable
}

//// (number, number) -> [number]
function getDiceSumTable(diceCount, diceMaxSide) {
  if (diceCount <= 0) {
    return [1]
  }

  const sides = rangeFromIncl(1, diceMaxSide)
  let numerators = [1] // start at 0 dice; 100% of getting 0
  const d = rangeFromIncl(1, diceCount)
  for (const die of d) {
    const maxSum = diceMaxSide * die
    const newNumerators = Array(maxSum + 1).fill(0)
    for (const i of numerators.keys()) {
      for (const side of sides) {
        const sum = i + side
        newNumerators[sum] += numerators[i]
      }
    }
    numerators = newNumerators
  }
  const denominator = diceMaxSide ** diceCount
  return numerators.map(numerator => numerator / denominator)
}

/// (number, number) -> number
function getChanceOfExactRerollHits(me, rerollHits, missedDice, rerollOneDie) {
  const probOne = 1 / (me - 1) // die that already missed
  let chance = 0
  for (const ones of rangeFromIncl(rerollHits, missedDice)) {
    let diceToReroll = ones
    if (rerollOneDie) {
      // increase by 1, but never more than missed dice
      diceToReroll = Math.min(diceToReroll + 1, missedDice)
    }

    const a = getExactSuccessResultChance(missedDice, probOne, ones)
    const b = getExactRollResultChance(diceToReroll, me, rerollHits)
    const subChance = a * b

    chance += subChance
  }
  return chance
}

/// (number, number, boolean) -> [[number]]
export function getDmgChanceTableByHits(maxHits, de, vicious, rerollOneDmgDie) {
  const dmgChanceTableByHits = []
  for (let hits of rangeIncl(maxHits)) {
    dmgChanceTableByHits[hits] = getSucessChanceTable(hits, de, vicious, /* blast */ false, rerollOneDmgDie)
  }
  return dmgChanceTableByHits
}

/// ([number], { att: number, me: number, elite, vicious, { die, plus }, rerollOneDmgDie } }, { de: number }) -> [number]
export function getDmgChanceTable(hitsChanceTable, attacker, defender) {
  const maxHits = hitsChanceTable.length - 1
  const dmgChanceTableByHits = getDmgChanceTableByHits(maxHits, defender.de, attacker.vicious, attacker.rerollOneDmgDie)

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

const sum2d6chanceTable = getDiceSumTable(2, 6)

const sum2d6orMoreChanceTable = [...rangeIncl(12)]
  .map(orMore => sum(sum2d6chanceTable.slice(orMore)))

/// (number) -> number
export function get2d6successChance(required) {
  if (required > 12) {
    return 0
  } else {
    return sum2d6orMoreChanceTable[required]
  }
}

/// ({ waver: number, rout: number }, number, boolean) -> { waverChance: number, routChance: number }
export function getNerveChance(ne, dmg, inspired) {
  let routChance = get2d6successChance(Math.max(3, ne.rout - dmg))
  let waverChance = get2d6successChance(Math.min(12, Math.max(3, ne.waver - dmg))) - routChance
  if (inspired) {
    routChance = routChance ** 2
    waverChance = waverChance + routChance * waverChance
  }
  return {
    routChance,
    waverChance,
  }
}

/// ([number], { de, ne: { waver, rout }, inspired: boolean }) -> { waverChance, routChance}
export function getKillChance(dmgChanceTable, defender) {
  const nerveChanceByDmg = dmgChanceTable.map((_, dmg) => 
    dmg === 0 
      ? { waverChance: 0, routChance: 0} 
      : getNerveChance(defender.ne, dmg, defender.inspired)
  )
  const totalNerveChance = {
    routChance: 0,
    waverChance: 0,
  }
  for (let dmg of nerveChanceByDmg.keys()) {
    totalNerveChance.routChance += nerveChanceByDmg[dmg].routChance * dmgChanceTable[dmg]
    totalNerveChance.waverChance += nerveChanceByDmg[dmg].waverChance * dmgChanceTable[dmg]
  }
  return totalNerveChance
}
