import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics';

Vue.config.productionTip = false

// Configuration VueAnalytics
Vue.use(VueAnalytics, {
  id: 'UA-169746013-1',
  router
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
