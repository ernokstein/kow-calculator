<template>
  <div class="outputs">
    <h3 class="title">Results</h3>

    <ChartKillChanceVue
      class="kill-chance"
      :rout-chance="value.killChance.routChance"
      :waver-chance="value.killChance.waverChance"
      :steady-chance="steadyChance"
    ></ChartKillChanceVue>

    <ChartExactHitsChanceVue class="hits-chance" :type="'hits'" :table="value.hitsChanceTable"></ChartExactHitsChanceVue>

    <ChartExactHitsChanceVue class="dmg-chance" :type="'wounds'" :table="value.dmgChanceTable"></ChartExactHitsChanceVue>
  </div>
</template>

<script>
import ChartKillChanceVue from "./ChartKillChance.vue";
import ChartExactHitsChanceVue from "./ChartExactHitsChance.vue";

export default {
  name: "Outputs",
  components: {
    ChartExactHitsChanceVue,
    ChartKillChanceVue
  },
  props: {
    value: Object
  },
  computed: {
    steadyChance() {
      return (
        1 - this.value.killChance.routChance - this.value.killChance.waverChance
      );
    }
  }
};
</script>

<style scoped>
.outputs {
  display: grid;
  grid-template-columns: min-content min-content min-content;
  grid-template-areas:
    "title title title"
    "kill-chance hits-chance dmg-chance";
}
.title {
  grid-area: title;
}
.kill-chance {
  grid-area: kill-chance;
}
.hits-chance {
  grid-area: hits-chance;
}
.dmg-chance {
  grid-area: dmg-chance;
}
</style>