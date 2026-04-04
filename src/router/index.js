import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/fl/dashboard'
  },
  {
    path: '/fl',
    name: 'Index',
    component: () => import('@/views/index.vue'),
    redirect: '/fl/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/fl/dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'jobManagement',
        name: 'JobManagement',
        component: () => import('@/views/fl/jobManagement.vue'),
        meta: { title: '作业管理' }
      },
      {
        path: 'modelManagement',
        name: 'ModelManagement',
        component: () => import('@/views/fl/modelManagement.vue'),
        meta: { title: '模型管理' }
      },
      {
        path: 'clientManagement',
        name: 'ClientManagement',
        component: () => import('@/views/fl/clientManagement.vue'),
        meta: { title: '客户端管理' }
      },
      {
        path: 'dataQuality',
        name: 'DataQuality',
        component: () => import('@/views/fl/dataQuality.vue'),
        meta: { title: '数据质量分析' }
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/fl/setting.vue'),
        meta: { title: '设置' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 联邦学习平台`
  }
  next()
})

export default router