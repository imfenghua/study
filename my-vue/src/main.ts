import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import {filterHtml} from './directives'

const app = createApp(App)

app.use(router)
app.directive('filterHtml', filterHtml)

app.mount('#app')
