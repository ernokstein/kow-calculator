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
#app {
  font-family: serif;
  font-size: 1.2em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
