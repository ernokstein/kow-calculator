<template>
  <div class="chart-kill-chance">
    <ApexCharts type="bar" width="600px" :options="chartOptions" :series="series" @click="onClick"></ApexCharts>
    <div class="results-grid">
      <span class="title">Chance of 0:</span>
      <span class="value">{{ chanceOfZero }}</span>

      <span class="title">Chance of 1 or more:</span>
      <span class="value">{{ chanceOfOneOrMore }}</span>

      <span class="title">Chance of {{ selectedIndex }} or more:</span>
      <span class="value">{{ chanceOfSelectedIndexOrMore }}</span>
    </div>
  </div>
</template>

<script>
import {
  displayedAverageHit,
  displayedProbability,
  // findIdexOfMaxValue,
  sum,
} from "@/scripts/utils.js";
import ApexCharts from "vue-apexcharts";

export default {
  name: "ChartExactHitsChance",
  components: {
    ApexCharts,
  },
  props: {
    type: String,
    table: Array,
  },
  data() {
    return {
      selectedIndex: 0,
    };
  },
  computed: {
    chartOptions() {
      return {
        labels: this.table.map((n, i) => i),
        dataLabels: {
          enabled: false,
        },
        title: {
          text: this.getTitleText(),
        },
      };
    },
    series() {
      const fullData = this.table.map(displayedProbability);
      // const indexOfMaxValue = findIdexOfMaxValue(fullData);
      return [
        {
          name: "Chance",
          data: fullData,
        },
      ];
    },
    chanceOfZero() {
      return 100 * this.table[0];
    },
    chanceOfOneOrMore() {
      return 100 * (1 - this.table[0]);
    },
    chanceOfSelectedIndexOrMore() {
      const chance = sum(this.table.slice(this.selectedIndex));
      return 100 * chance;
    },
  },
  methods: {
    getTitleText() {
      const avg = displayedAverageHit(this.table);
      return `Average ${this.type}: ${avg}`;
    },
    onClick(ev, el, data) {
      if (data.dataPointIndex < 0) {
        return;
      }
      if (this.selectedIndex === data.dataPointIndex) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex = data.dataPointIndex;
      }
    },
  },
};
</script>

<style scoped>
.results-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 10px 20px;
}
.results-grid .title {
  text-align: end;
}
.results-grid .value {
  text-align: start;
}
</style>