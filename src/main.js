import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ElCollapse, ElCollapseItem, ElIcon, ElInput } from 'element-plus'
import 'element-plus/es/components/collapse/style/css'
import 'element-plus/es/components/collapse-item/style/css'
import 'element-plus/es/components/icon/style/css'
import 'element-plus/es/components/input/style/css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(ElCollapse)
app.use(ElCollapseItem)
app.use(ElIcon)
app.use(ElInput)
app.mount('#app')
