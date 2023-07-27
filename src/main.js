import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = "http://127.0.0.1:8020"
createApp(App).mount('#app')

