import { getSucessChanceTable,getDmgChanceTable,getKillChance } from './chances.js'

/// ({ att, me, elite, vicious }, { de, ne: { waver, rout }, inspired: boolean }) -> { hitsChanceTable, dmgChanceTable, killChance }
export function getAllOutputs(attacker, defender) {
  const hitsChanceTable = getSucessChanceTable(attacker.att, attacker.me, attacker.elite)
  const dmgChanceTable = getDmgChanceTable(hitsChanceTable, attacker, defender)
  const killChance = getKillChance(dmgChanceTable, defender)
  return { hitsChanceTable, dmgChanceTable, killChance }
}

/// ({ attacker: { att, me, elite, vicious }, defender: { de, neWaver, neRout }, inspired }, charge: { attackedSide, hindered, chargeFromHill }) -> { hitsChanceTable, dmgChanceTable, killChance }
export function calculate(inputs) {
  let att = +inputs.attacker.att;
  let me = +inputs.attacker.me;
  let elite = inputs.attacker.elite;
  let vicious = inputs.attacker.vicious;
  let de = +inputs.defender.de;
  let waver = +inputs.defender.neWaver;
  let rout = +inputs.defender.neRout;
  let inspired = inputs.defender.inspired;

  if (inputs.charge.attackedSide === "flank") {
    att *= 2;
  } else if (inputs.charge.attackedSide === "rear") {
    att *= 3;
  }

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
    { att, me, elite, vicious },
    { de, ne: { waver, rout }, inspired }
  );
}