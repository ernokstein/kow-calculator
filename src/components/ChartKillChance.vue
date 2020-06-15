<template>
  <div class="chart-kill-chance">
    <div id="chart">
      <ApexCharts type="pie" width="380" :options="chartOptions" :series="series"></ApexCharts>
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue-apexcharts";

export default {
  name: "ChartKillChance",
  components: {
    ApexCharts
  },
  props: {
    routChance: Number,
    weaverChance: Number,
    steadyChance: Number,
  },
  data: () => ({
    chartOptions: {
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Rout", "Weaver", "Steady"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }
  }),
  computed: {
    series() {
      return [this.routChance, this.weaverChance, this.steadyChance]
    }
  }
};
</script>