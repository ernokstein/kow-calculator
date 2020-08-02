<template>
  <span class="tag-beta" title="This option needs more testing. Calculation may be incorrect.">beta</span>
</template>

<script>
export default {
  name: "TagBeta",
};
</script>

<style scoped>
.tag-beta {
  color: white;
  font-family: monospace;
  background-color: #c20;
  border: 1px solid black;
  border-radius: 7px;
  padding: 0 3px;
  margin: 5px;
}
</style>
