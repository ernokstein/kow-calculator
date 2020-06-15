<template>
  <div class="outputs">
    <h3>Results</h3>
    
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
      :rout-chance="value.killChance.routChance"
      :weaver-chance="value.killChance.weaverChance"
      :steady-chance="steadyChance"
    ></ChartKillChanceVue>

    <div>
      Average hits: {{ averageHits }}
    </div>
    <ChartExactHitsChanceVue
      :table="value.hitsChanceTable"
    ></ChartExactHitsChanceVue>

    <div>
      Average wounds: {{ averageDmg }}
    </div>
    <ChartExactHitsChanceVue
      :table="value.dmgChanceTable"
    ></ChartExactHitsChanceVue>
  </div>
</template>

<script>
import { sum } from '@/scripts/utils.js'
import ChartKillChanceVue from './ChartKillChance.vue';
import ChartExactHitsChanceVue from './ChartExactHitsChance.vue';

export default {
  name: "Outputs",
  components: {
    ChartExactHitsChanceVue,
    ChartKillChanceVue,
  },
  props: {
    value: Object
  },
  computed: {
    steadyChance() {
      return 1 - this.value.killChance.routChance - this.value.killChance.weaverChance
    },
    displayedRoutProbability() {
      return displayedPercentage(this.value.killChance.routChance);
    },
    displayedWeaverProbability() {
      return displayedPercentage(this.value.killChance.weaverChance);
    },
    displayedSteadyProbability() {
      return displayedPercentage(this.steadyChance);
    },
    averageHits() {
      return displayedAverageHit(this.value.hitsChanceTable)
    },
    averageDmg() {
      return displayedAverageHit(this.value.dmgChanceTable)
    }
  }
};

function displayedAverageHit(hitsTable) {
  const avg = sum(hitsTable.map((chance, dmg) => chance * dmg))
  return (+avg.toFixed(2))
}

function displayedPercentage(n) {
  return (n * 100).toFixed(2) + " %";
}
</script>
