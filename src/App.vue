<!--
  App layout
  @author prompt-vault team
  @date 2026-07-07
-->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <RouterLink to="/" class="app-brand">prompt-vault</RouterLink>
      <nav class="app-nav">
        <RouterLink to="/">Prompt 库</RouterLink>
        <RouterLink to="/prompt/new">新建</RouterLink>
        <RouterLink to="/settings">设置</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.app-brand {
  font-size: 18px;
  font-weight: 700;
}

.app-nav {
  display: flex;
  gap: 16px;
}

.app-nav a.router-link-active {
  color: #409eff;
  font-weight: 600;
}

.app-main {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
</style>
