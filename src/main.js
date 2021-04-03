import { createApp } from 'vue'
import { ElInput, ElCollapse, ElCollapseItem } from 'element-plus'
import store from './store'
import App from './App.vue'

const app = createApp(App)
// element-ui
app.use(ElInput)
app.use(ElCollapse)
app.use(ElCollapseItem)
// vuex
app.use(store)
// mount application
app.mount('#app')
