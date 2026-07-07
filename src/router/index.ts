/**
 * Vue Router
 * @author prompt-vault team
 * @date 2026-07-07
 */

import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

/** 桌面端 file:// 协议下使用 hash 路由，避免刷新 404 */
function createAppHistory() {
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return createWebHashHistory()
  }
  return createWebHistory()
}

export default createRouter({
  history: createAppHistory(),
  routes: [
    { path: '/', name: 'list', component: () => import('@/views/PromptList.vue') },
    { path: '/prompt/new', name: 'new', component: () => import('@/views/PromptEdit.vue') },
    { path: '/prompt/:id/edit', name: 'edit', component: () => import('@/views/PromptEdit.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/Settings.vue') },
  ],
})
