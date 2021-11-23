import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vueMoment from 'vue-moment'
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

Vue.use(vueMoment)
// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)