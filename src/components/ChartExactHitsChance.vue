<template>
  <div class="chart-kill-chance">
    <ApexCharts type="bar" width="600px" :options="chartOptions" :series="series"></ApexCharts>
  </div>
</template>

<script>
import {
  displayedAverageHit,
  displayedProbability
  // findIdexOfMaxValue
} from "@/scripts/utils.js";
import ApexCharts from "vue-apexcharts";

export default {
  name: "ChartExactHitsChance",
  components: {
    ApexCharts
  },
  props: {
    type: String,
    table: Array
  },
  computed: {
    chartOptions() {
      return {
        labels: this.table.map((n, i) => i),
        dataLabels: {
          enabled: false
        },
        title: {
          text: this.getTitleText()
        }
      };
    },
    series() {
      const fullData = this.table.map(displayedProbability);
      // const indexOfMaxValue = findIdexOfMaxValue(fullData);
      return [
        {
          name: "probability",
          data: fullData
        }
      ];
    }
  },
  methods: {
    getTitleText() {
      const avg = displayedAverageHit(this.table);
      return `Average ${this.type}: ${avg}`;
    }
  }
};
</script>