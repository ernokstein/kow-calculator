<template>
  <div class="outputs">
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

    <ChartKillChanceVue
      :rout-chance="value.routChance"
      :weaver-chance="value.weaverChance"
      :steady-chance="steadyChance"
    ></ChartKillChanceVue>
  </div>
</template>

<script>
import ChartKillChanceVue from './ChartKillChance.vue';
export default {
  name: "Outputs",
  components: {
    ChartKillChanceVue
  },
  props: {
    value: Object
  },
  computed: {
    steadyChance() {
      return 1 - this.value.routChance - this.value.weaverChance
    },
    displayedRoutProbability() {
      return displayedPercentage(this.value.routChance);
    },
    displayedWeaverProbability() {
      return displayedPercentage(this.value.weaverChance);
    },
    displayedSteadyProbability() {
      return displayedPercentage(this.steadyChance);
    }
  }
};

function displayedPercentage(n) {
  return (n * 100).toFixed(2) + " %";
}
</script>
