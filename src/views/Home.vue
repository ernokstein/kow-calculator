<template>
  <div class="home">
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
        <span>Hindered</span>
        <input type="checkbox" v-model="attacker.hindered" />
      </label>
      <label>
        <span>Charge from hill</span>
        <input type="checkbox" v-model="attacker.chargeFromHill" />
      </label>
      <label>
        <span>Brutal/Shattering</span>
        <input type="checkbox" v-model="attacker.brutal" />
      </label>
    </div>

    <div id="inputs-defender" class="inputs">
      <h3>Defender</h3>
      <label>
        <span>De</span>
        <input type="number" v-model="defender.de" />
      </label>
      <label>
        <span>Ne</span>
        <input type="number" v-model="defender.ne.weaver" /> /
        <input type="number" v-model="defender.ne.route" />
      </label>
      <br />
      <label>
        <span>Previous wounds</span>
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

    <button id="calculate" type="button" @click="calculate">Calculate</button>

    <div id="results" v-if="result">
      <label>
        <span>Weaver probability</span>
        <input v-model="displayedWeaverProbability" />
      </label>
      <label>
        <span>Route probability</span>
        <input v-model="displayedRouteProbability" />
      </label>
    </div>
  </div>
</template>

<script>
import { get_kill_chance } from "@/scripts/chances.js";

export default {
  name: "Home",
  data: () => ({
    attacker: {
      att: 12,
      me: 4,
      cs: null,
      tc: null,
      hindered: false,
      chargeFromHill: false,
      brutal: false
    },
    defender: {
      de: 4,
      ne: { weaver: 13, route: 15 },
      rallied: null,
      wounds: null,
      inspired: true,
      ensnare: false
    },
    result: {
      weaver_chance: 0,
      route_chance: 0
    }
  }),
  methods: {
    calculate() {
      let att = +this.attacker.att;
      let me = +this.attacker.me;
      let de = +this.defender.de;
      let weaver = +this.defender.ne.weaver;
      let route = +this.defender.ne.route;
      let inspired = +this.defender.inspired;

      const toHitReduction =
        (this.attacker.hindered ? 1 : 0) + (this.defender.ensnare ? 1 : 0);
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
      route += totalNerveModifiation;

      this.result = get_kill_chance(
        { att, me },
        { de, ne: { weaver, route }, inspired }
      );
    }
  },
  computed: {
    displayedWeaverProbability() {
      return displayedPercentage(this.result.weaver_chance);
    },
    displayedRouteProbability() {
      return displayedPercentage(this.result.route_chance);
    }
  }
};

function displayedPercentage(n) {
  return (n * 100).toFixed(2) + " %";
}
</script>

<style scoped>
.home {
  max-width: fit-content;
  margin: 0 auto;
  display: grid;
  grid-template-areas:
    "attacker defender"
    "calculate calculate"
    "results results";
  grid-gap: 50px;
}
#attacker {
  grid-area: attacker;
}
#defender {
  grid-area: defender;
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
}
label span {
  min-width: 50%;
  text-align: end;
  margin: 0 10px;
}
label input {
  flex: 1;
  min-width: 10px;
}
</style>