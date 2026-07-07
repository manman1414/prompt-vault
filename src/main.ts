/**
 * App entry
 * @author prompt-vault team
 * @date 2026-07-07
 */

import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { usePromptStore } from './stores/prompt'
import './styles.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

usePromptStore(pinia).hydrate()

app.mount('#app')
