import Vue from 'vue'
import { Input, Collapse, CollapseItem } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.use(Input)
Vue.use(Collapse)
Vue.use(CollapseItem)
