<template>
  <form class="home">
    <h1 id="title">KoW Calculator</h1>

    <InputsAttacker v-model="attacker"></InputsAttacker>

    <InputsDefender v-model="defender"></InputsDefender>

    <InputsAttackedSide v-model="attackedSide"></InputsAttackedSide>

    <button id="calculate" type="submit" @click.prevent="calculate">Calculate</button>

    <Outputs v-model="outputs"></Outputs>
  </form>
</template>

<script>
import { getAllOutputs } from "@/scripts/chances.js";
import InputsAttackedSide from "@/components/InputsAttackedSide.vue";
import InputsAttacker from "@/components/InputsAttacker.vue";
import InputsDefender from "@/components/InputsDefender.vue";
import Outputs from "@/components/Outputs.vue";

export default {
  name: "Home",
  components: {
    InputsAttackedSide,
    InputsAttacker,
    InputsDefender,
    Outputs,
  },
  data: () => ({
    attacker: {
      att: 12,
      me: 4,
      cs: null,
      tc: null,
      elite: false,
      vicious: false,
      brutal: false,
      hindered: false,
      chargeFromHill: false
    },
    defender: {
      de: 4,
      neWeaver: 13,
      neRout: 15 ,
      rallied: null,
      wounds: null,
      inspired: true,
      ensnare: false
    },
    attackedSide: "front",
    outputs: {
      hitsChanceTable: [],
      dmgChanceTable: [],
      killChance: {
        weaverChance: 0,
        routChance: 0
      }
    }
  }),
  mounted() {
    this.calculate()
  },
  methods: {
    calculate() {
      let att = +this.attacker.att;
      let me = +this.attacker.me;
      let elite = this.attacker.elite;
      let vicious = this.attacker.vicious;
      let de = +this.defender.de;
      let weaver = +this.defender.neWeaver;
      let rout = +this.defender.neRout;
      let inspired = this.defender.inspired;

      if (this.attackedSide === "flank") {
        att *= 2;
      } else if (this.attackedSide === "rear") {
        att *= 3;
      }

      const toHitReduction =
        (this.attacker.hindered ? 1 : 0) +
        (this.defender.ensnare && this.attackedSide === "front" ? 1 : 0);
      if (me + toHitReduction > 6) {
        att = Math.round(att / 2);
        me = 6;
      } else {
        me += toHitReduction; // add instead of substract
      }

      const totalTc = Math.max(
        0,
        +this.attacker.tc +
          (this.attacker.chargeFromHill ? 1 : 0) +
          (this.attacker.hindered ? -1 : 0)
      );
      const deReduction = +this.attacker.cs + totalTc;
      de = Math.max(2, de - deReduction);

      const totalNerveModifiation =
        (this.attacker.brutal ? -1 : 0) +
        +this.defender.rallied +
        -this.defender.wounds;
      weaver += totalNerveModifiation;
      rout += totalNerveModifiation;

      this.outputs = getAllOutputs(
        { att, me, elite, vicious },
        { de, ne: { weaver, rout }, inspired }
      );
    }
  },
};
</script>

<style>
.home {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-areas:
    "title title title"
    "attacker attacked-side defender"
    "calculate calculate calculate"
    "outputs outputs outputs";
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  row-gap: 20px;
  column-gap: 50px;
}
#title {
  grid-area: title;
}
.inputs-attacker {
  grid-area: attacker;
}
.inputs-defender {
  grid-area: defender;
}
.attacked-side {
  grid-area: attacked-side;
  width: fit-content;
  margin: 0 auto;
}
#calculate {
  grid-area: calculate;
  font-size: 2em;
}
.outputs {
  grid-area: outputs;
}
.inputs {
  display: flex;
  flex-direction: column;
}
label {
  display: flex;
  flex-direction: row;
}
label span {
  flex: 1;
  text-align: end;
  padding: 0 10px;
}
label input {
  flex: 1;
  min-width: 0;
}
.inputs-defender-ne input {
  flex: 0 1 auto;
}
</style>