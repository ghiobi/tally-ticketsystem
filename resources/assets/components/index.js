import Vue from 'vue'
import Vuex from 'vuex'

// Plugins
Vue.use(Vuex)

// Register all main/common Vue Components Here
import Home from './home/Home.vue'

Vue.component('home', Home)

// Register all apps here
import './home'
import './notifications'
