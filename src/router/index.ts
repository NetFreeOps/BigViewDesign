import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Login',
            component: () =>import('../views/Login.vue')
          },
      {
        path: '/home',
        name: 'home',
        component: () =>import('../views/Home.vue')
      },
      {
        path:'/index',
        name:'index',
        component:()=>import('../views/index.vue')
      },
      {
        path: '/screen1',
        name: 'screen1',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/screen1.vue')
      }
    ]
  })
  
  export default router