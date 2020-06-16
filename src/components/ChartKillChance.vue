<template>
  <div class="chart-kill-chance">
    <ApexCharts :width="300" :options="chartOptions" :series="series"></ApexCharts>
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
    steadyChance: Number
  },
  data: () => ({
    chartOptions: {
      chart: {
        type: "pie"
      },
      labels: ["Rout", "Weaver", "Steady"],
      title: {
        text: "Kill chance"
      },
      legend: {
        position: "top"
      },
      theme: {}
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200
      //       },
      //       legend: {
      //         position: "bottom"
      //       }
      //     }
      //   }
      // ]
    }
  }),
  computed: {
    series() {
      return [this.routChance, this.weaverChance, this.steadyChance];
    }
  }
};
</script>