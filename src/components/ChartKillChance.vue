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
    ApexCharts,
  },
  props: {
    routChance: Number,
    waverChance: Number,
  },
  computed: {
    title() {
      return "Kill chance: " + displayedProbability(this.routChance);
    },
    chartOptions() {
      return {
        chart: {
          type: "pie",
        },
        labels: ["Rout", "Waver", "Steady"],
        title: {
          text: this.title,
        },
        legend: {
          position: "top",
        },
        theme: {},
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
      };
    },
    steadyChance() {
      return 1 - this.routChance - this.waverChance;
    },
    series() {
      const rc = displayedProbability(this.routChance);
      const wc = displayedProbability(this.waverChance);
      const sc = displayedProbability(this.steadyChance);
      return [rc, wc, sc];
    },
  },
};
</script>