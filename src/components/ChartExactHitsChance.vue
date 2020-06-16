<template>
  <div class="chart-kill-chance">
    <ApexCharts type="bar" width="600px" :options="chartOptions" :series="series"></ApexCharts>
  </div>
</template>

<script>
import { sum } from "@/scripts/utils.js";
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
      return [
        {
          name: "probability",
          data: this.table.map(n => (n * 100).toFixed(2))
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

function displayedAverageHit(hitsTable) {
  const avg = sum(hitsTable.map((chance, dmg) => chance * dmg));
  return +avg.toFixed(2);
}
</script>