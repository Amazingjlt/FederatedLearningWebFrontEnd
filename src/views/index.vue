<template>
  <div class="bg-dark text-gray-200 font-sans h-screen flex flex-col overflow-hidden">
    <!-- 顶部导航栏 -->
    <header class="bg-primary border-b border-gray-700 h-16 flex items-center justify-between px-6 z-10">
      <div class="flex items-center gap-2">
        <i class="fas fa-brain text-accent text-2xl"></i>
        <h1 class="text-xl font-bold">联邦学习平台</h1>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center">
          <span class="status-indicator status-online"></span>
          <span class="text-sm">系统在线</span>
        </div>
        <div class="relative">
          <button class="flex items-center gap-2 focus:outline-none">
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              class="w-8 h-8 rounded-full object-cover border border-gray-600"
            />
            <span class="hidden md:inline text-sm font-medium">管理员</span>
            <i class="fas fa-chevron-down text-xs text-gray-400"></i>
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边菜单栏 -->
      <aside class="bg-primary w-64 border-r border-gray-700 flex-shrink-0 overflow-y-auto">
        <nav class="py-4">
          <div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            主要功能
          </div>
          <router-link
            to="/fl/dashboard"
            class="sidebar-item"
            active-class="active-menu"
          >
            <i class="fas fa-tachometer-alt"></i>
            <span>仪表盘</span>
          </router-link>
          <router-link
            to="/fl/jobManagement"
            class="sidebar-item"
            active-class="active-menu"
          >
            <i class="fas fa-tasks"></i>
            <span>作业管理</span>
          </router-link>
          <router-link
            to="/fl/modelManagement"
            class="sidebar-item"
            active-class="active-menu"
          >
            <i class="fas fa-cube"></i>
            <span>模型管理</span>
          </router-link>
          <router-link
            to="/fl/clientManagement"
            class="sidebar-item"
            active-class="active-menu"
          >
            <i class="fas fa-desktop"></i>
            <span>客户端管理</span>
          </router-link>
          <div class="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            数据分析
          </div>
          <router-link
            to="/fl/dataQuality"
            class="sidebar-item"
            active-class="active-menu"
          >
            <i class="fas fa-chart-line"></i>
            <span>数据质量分析</span>
          </router-link>
          <div class="px-4 py-2 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            设置
          </div>
          <router-link
            to="/fl/setting"
            class="sidebar-item"
            active-class="active-menu"
          >
            <i class="fas fa-cog"></i>
            <span>设置</span>
          </router-link>
        </nav>
      </aside>

      <!-- 主内容区域 -->
      <main class="flex-1 overflow-auto bg-dark">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑可以在这里添加
</script>

<style scoped>
.sidebar-item {
  @apply flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-secondary transition-all duration-200 cursor-pointer;
}

.sidebar-item i {
  @apply w-5 h-5;
}

.active-menu {
  @apply bg-secondary text-accent relative;
}

.active-menu::before {
  content: '';
  @apply absolute left-0 top-0 h-full w-1 bg-accent;
}

.status-indicator {
  @apply w-2 h-2 rounded-full inline-block mr-2;
}

.status-online {
  @apply bg-accent;
}
</style>