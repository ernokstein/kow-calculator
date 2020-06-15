<template>
  <div class="chart-kill-chance">
    <div id="chart">
      <ApexCharts type="bar" :options="chartOptions" :series="series"></ApexCharts>
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue-apexcharts";

export default {
  name: "ChartExactHitsChance",
  components: {
    ApexCharts
  },
  props: {
    table: Array
  },
  computed: {
    chartOptions() {
      return {
        labels: this.table.map((n, i) => i),
        dataLabels: {
          enabled: false,
        }
      }
    },
    series() {
      return [
        {
          name: "probability",
          data: this.table.map(n => (n * 100).toFixed(2))
        }
      ]
    },
  }
};
</script>