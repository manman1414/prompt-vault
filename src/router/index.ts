/**
 * Vue Router
 * @author prompt-vault team
 * @date 2026-07-07
 */

import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: () => import('@/views/PromptList.vue') },
    { path: '/prompt/new', name: 'new', component: () => import('@/views/PromptEdit.vue') },
    { path: '/prompt/:id/edit', name: 'edit', component: () => import('@/views/PromptEdit.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/Settings.vue') },
  ],
})
