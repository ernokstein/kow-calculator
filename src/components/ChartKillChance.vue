<template>
  <div class="chart-kill-chance">
    <ApexCharts :width="300" :options="chartOptions" :series="series"></ApexCharts>
  </div>
</template>

<script>
import { displayedProbability } from "@/scripts/utils.js";
import ApexCharts from "vue-apexcharts";

export default {
  name: "ChartKillChance",
  components: {
    ApexCharts
  },
  props: {
    routChance: Number,
    waverChance: Number
  },
  data: () => ({
    chartOptions: {
      chart: {
        type: "pie"
      },
      labels: ["Rout", "Waver", "Steady"],
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
    steadyChance() {
      return 1 - this.routChance - this.waverChance;
    },
    series() {
      const rc = displayedProbability(this.routChance);
      const wc = displayedProbability(this.waverChance);
      const sc = displayedProbability(this.steadyChance);
      console.log(rc, wc, sc);
      return [rc, wc, sc];
    }
  }
};
</script>