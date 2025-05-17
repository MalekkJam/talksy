import { createWebHistory, createRouter } from 'vue-router';
import Home from "@/components/views/Home.vue";
import Login from "@/components/auth/Login.vue";
import Register from '@/components/auth/Register.vue';
import Conversation from '@/components/common/Conversation.vue';
import Settings from '@/components/user/Settings.vue';
import LandingPage from '@/components/common/LandingPage.vue';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/', 
    component: Home, 
    children: [
      { path: '', component: LandingPage },
      { 
        path: '/private/:conversation', 
        component: Conversation,
        meta: { chatType: 'private' } 
      },
      { 
        path: '/group/:conversation', 
        component: Conversation,
        meta: { chatType: 'group' } 
      },
      { path: '/settings', component: Settings }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;