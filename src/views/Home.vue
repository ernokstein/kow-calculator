<template>
  <div class="home">
    <h1 id="title">KoW Calculator</h1>

    <div id="inputs-attacker" class="inputs">
      <h3>Attacker</h3>
      <label>
        <span>Me</span>
        <input type="number" v-model="attacker.me" />
      </label>
      <label>
        <span>Att</span>
        <input type="number" v-model="attacker.att" />
      </label>
      <br />
      <label>
        <span>Crushing Strength</span>
        <input type="number" v-model="attacker.cs" />
      </label>
      <label>
        <span>Thunderous Charge</span>
        <input type="number" v-model="attacker.tc" />
      </label>
      <br />
      <label>
        <span>Elite</span>
        <input type="checkbox" v-model="attacker.elite" />
      </label>
      <label>
        <span>Vicious</span>
        <input type="checkbox" v-model="attacker.vicious" />
      </label>
      <label>
        <span>Brutal/Shattering</span>
        <input type="checkbox" v-model="attacker.brutal" />
      </label>
      <br />
      <label>
        <span>Hindered</span>
        <input type="checkbox" v-model="attacker.hindered" />
      </label>
      <label>
        <span>Charge from hill</span>
        <input type="checkbox" v-model="attacker.chargeFromHill" />
      </label>
    </div>

    <div id="inputs-defender" class="inputs">
      <h3>Defender</h3>
      <label>
        <span>De</span>
        <input type="number" v-model="defender.de" />
      </label>
      <label id="inputs-defender-ne">
        <span>Ne</span>
        <input type="number" v-model="defender.ne.weaver" /> /
        <input type="number" v-model="defender.ne.rout" />
      </label>
      <br />
      <label>
        <span>Previous Wounds</span>
        <input type="number" v-model="defender.wounds" />
      </label>
      <label>
        <span>Rallied</span>
        <input type="number" v-model="defender.rallied" />
      </label>
      <br />
      <label>
        <span>Inspired</span>
        <input type="checkbox" v-model="defender.inspired" />
      </label>
      <label>
        <span>Ensnare/Stealthy</span>
        <input type="checkbox" v-model="defender.ensnare" />
      </label>
    </div>

    <div id="attacked-side">
      <h3>Attacked Side</h3>
      <label>
        <span>Front</span>
        <input type="radio" id="front" value="front" v-model="attackedSide" />
      </label>
      <label>
        <span>Flank</span>
        <input type="radio" id="flank" value="flank" v-model="attackedSide" />
      </label>
      <label>
        <span>Rear</span>
        <input type="radio" id="rear" value="rear" v-model="attackedSide" />
      </label>
    </div>

    <button id="calculate" type="button" @click="calculate">Calculate</button>

    <div id="results" v-if="result">
      <label>
        <span>Rout probability</span>
        <input v-model="displayedRoutProbability" />
      </label>
      <label>
        <span>Weaver probability</span>
        <input v-model="displayedWeaverProbability" />
      </label>
      <label>
        <span>Steady probability</span>
        <input v-model="displayedSteadyProbability" />
      </label>

      <ChartKillChance></ChartKillChance>
    </div>
  </div>
</template>

<script>
import { getKillChance } from "@/scripts/chances.js";
import ChartKillChance from "@/components/ChartKillChance.vue";

export default {
  name: "Home",
  components: {
    ChartKillChance
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
      ne: { weaver: 13, rout: 15 },
      rallied: null,
      wounds: null,
      inspired: true,
      ensnare: false
    },
    attackedSide: "front",
    result: {
      weaverChance: 0,
      routChance: 0
    }
  }),
  methods: {
    calculate() {
      let att = +this.attacker.att;
      let me = +this.attacker.me;
      let elite = this.attacker.elite;
      let vicious = this.attacker.vicious;
      let de = +this.defender.de;
      let weaver = +this.defender.ne.weaver;
      let rout = +this.defender.ne.rout;
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

      this.result = getKillChance(
        { att, me, elite, vicious },
        { de, ne: { weaver, rout }, inspired }
      );
    }
  },
  computed: {
    displayedRoutProbability() {
      return displayedPercentage(this.result.routChance);
    },
    displayedWeaverProbability() {
      return displayedPercentage(this.result.weaverChance);
    },
    displayedSteadyProbability() {
      return displayedPercentage(
        1 - this.result.routChance - this.result.weaverChance
      );
    }
  }
};

function displayedPercentage(n) {
  return (n * 100).toFixed(2) + " %";
}
</script>

<style scoped>
.home {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-areas:
    "title title"
    "attacker defender"
    "attacked-side attacked-side"
    "calculate calculate"
    "results results";
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 50px;
}
#title {
  grid-area: title;
}
#attacker {
  grid-area: attacker;
}
#defender {
  grid-area: defender;
}
#attacked-side {
  grid-area: attacked-side;
  width: fit-content;
  margin: 0 auto;
}
#calculate {
  grid-area: calculate;
  font-size: 2em;
}
#results {
  grid-area: results;
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