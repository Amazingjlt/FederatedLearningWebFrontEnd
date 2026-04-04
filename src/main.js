import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

// 导入ECharts
import * as echarts from 'echarts'

// 导入Mock数据(开发环境)
if (import.meta.env.MODE === 'development') {
  import('./mock/dashboard')
  import('./mock/jobManagement')
  import('./mock/modelManagement')
  import('./mock/clientManagement')
  import('./mock/dataQuality')
  import('./mock/setting')
}

const app = createApp(App)

// 全局挂载ECharts
app.config.globalProperties.$echarts = echarts

app.use(router)
app.mount('#app')