import './src/style/_main.scss'
import Vue from 'vue'
import App from './App'

// figma message
import message from './src/js/plugin/message';
Vue.use(message)

const app = new Vue({
  el: '#app',
  render: h => h(App),
})
