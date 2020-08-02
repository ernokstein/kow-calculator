<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// function addScriptToHead(src) {
//   let scriptElem = document.createElement("script");
//   scriptElem.setAttribute("src", src);
//   document.head.appendChild(scriptElem);
// }

// export default {
//   mounted() {
//     addScriptToHead("https://cdn.jsdelivr.net/npm/apexcharts");
//   }
// };
</script>

<style>
body {
  margin: 0;
  margin-bottom: 30px;
}
#app {
  font-family: serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
