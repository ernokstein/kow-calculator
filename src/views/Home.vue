<template>
  <form class="home">
    <div id="title">
      <h1>KoW Calculator</h1>
      <a
        href="https://github.com/ernokstein/kow-calculator"
        target="_BLANK"
        rel="noreferrer noopener"
      >Source code</a>
    </div>

    <Inputs v-model="inputs"></Inputs>

    <button id="calculate" type="submit" @click.prevent="calculate">Calculate</button>

    <Outputs v-model="outputs"></Outputs>
  </form>
</template>

<script>
import { calculate } from "@/scripts/calculate.js";
import Inputs from "@/components/Inputs.vue";
import Outputs from "@/components/Outputs.vue";

export default {
  name: "Home",
  components: {
    Inputs,
    Outputs
  },
  data: () => ({
    inputs: {
      attacker: {
        att: 12,
        me: 4,
        cs: null,
        tc: null,
        elite: false,
        vicious: false,
        brutal: false
      },
      defender: {
        de: 4,
        neWaver: 13,
        neRout: 15,
        rallied: null,
        wounds: null,
        inspired: true,
        ensnare: false
      },
      charge: {
        attackedSide: "front",
        hindered: false,
        chargeFromHill: false
      }
    },
    outputs: {
      hitsChanceTable: [],
      dmgChanceTable: [],
      killChance: {
        waverChance: 0,
        routChance: 0
      }
    }
  }),
  mounted() {
    this.calculate();
  },
  methods: {
    calculate() {
      const button = this.$el.querySelector("#calculate");
      button.disabled = true;
      button.style.cursor = "wait";
      setTimeout(() => {
        this.outputs = calculate(this.inputs);
        button.disabled = false;
        button.style.cursor = "";
      }, 1);
    }
  }
};
</script>

<style>
.home {
  width: fit-content;
  max-width: 100vw;
  margin: 0 auto;
  display: grid;
  grid-template-areas:
    "title"
    "inputs"
    "calculate"
    "outputs";
  grid-template-columns: min-content;
  row-gap: 20px;
  column-gap: 50px;
}
#title {
  grid-area: title;
  display: flex;
  flex-direction: row;
  margin: 20px 0 0 0;
}
.inputs {
  grid-area: inputs;
}
#calculate {
  grid-area: calculate;
  font-size: 2em;
}
.outputs {
  grid-area: outputs;
}
h1 {
  text-align: start;
  margin: 0;
}
a {
  margin: 0 10px;
}
h3 {
  text-align: start;
}
</style>