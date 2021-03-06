import { getSucessChanceTable,getDmgChanceTable,getKillChance } from './chances.js'

/// ({ att, me, elite, vicious, rerollOneHitDie, rerollOneDmgDie }, { de, ne: { waver, rout }, inspired: boolean }) -> { hitsChanceTable, dmgChanceTable, killChance }
export function getAllOutputs(attacker, defender) {
  const hitsChanceTable = getSucessChanceTable(attacker.att, attacker.me, attacker.elite, attacker.blast, attacker.rerollOneHitDie)
  const dmgChanceTable = getDmgChanceTable(hitsChanceTable, attacker, defender)
  const killChance = getKillChance(dmgChanceTable, defender)
  return { hitsChanceTable, dmgChanceTable, killChance }
}

/// ({ attacker: { att, me, elite, vicious, blast { die, plus }, rerollOneHitDie, rerollOneDmgDie }, defender: { de, neWaver, neRout }, inspired }, charge: { attackedSide, hindered, chargeFromHill }) -> { hitsChanceTable, dmgChanceTable, killChance }
export function calculate(inputs) {
  let att = +inputs.attacker.att;
  let me = +inputs.attacker.me;
  let elite = inputs.attacker.elite;
  let vicious = inputs.attacker.vicious;
  let de = +inputs.defender.de;
  let waver = +inputs.defender.neWaver;
  let rout = +inputs.defender.neRout;
  let inspired = inputs.defender.inspired;
  let blast = inputs.attacker.hasBlast && {
    die: +inputs.attacker.blastDie,
    plus: +inputs.attacker.blastPlus
  }
  let rerollOneHitDie = inputs.attacker.rerollOneHitDie
  let rerollOneDmgDie = inputs.attacker.rerollOneDmgDie

  const toHitReduction =
    (inputs.charge.hindered ? 1 : 0) +
    (inputs.defender.ensnare && inputs.charge.attackedSide === "front" ? 1 : 0);
  if (me + toHitReduction > 6) {
    att = Math.round(att / 2);
    me = 6;
  } else {
    me += toHitReduction; // add instead of substract
  }

  const totalTc = Math.max(
    0,
    +inputs.attacker.tc +
      (inputs.charge.chargeFromHill ? 1 : 0) +
      (inputs.charge.hindered ? -1 : 0)
  );
  const deReduction = +inputs.attacker.cs + totalTc;
  de = Math.max(2, de - deReduction);

  const totalNerveModifiation =
    (inputs.attacker.brutal ? -1 : 0) +
    +inputs.defender.rallied +
    -inputs.defender.wounds;
  waver += totalNerveModifiation;
  rout += totalNerveModifiation;

  return getAllOutputs(
    { att, me, elite, vicious, blast, rerollOneHitDie, rerollOneDmgDie },
    { de, ne: { waver, rout }, inspired }
  );
}