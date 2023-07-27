import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})


axios.defaults.baseURL = "http://127.0.0.1:8020"
createApp(App).use(vuetify).mount('#app')

