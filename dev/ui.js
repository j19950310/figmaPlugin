import './src/style/_main.scss'
import Vue from 'vue'
import App from './App'

// figma message
import messagePlugin from './src/message';

Vue.use(messagePlugin)

new Vue({
  el: '#app',
  render: h => h(App)
})