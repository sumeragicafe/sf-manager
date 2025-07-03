import { createRouter, createWebHistory} from 'vue-router';
import NotFound from '../views/NotFound.vue';


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:[
        {
            path: '/',
            name: 'landing',
            component: () => import('../layouts/landing/Landing.vue'),
            children:[
                {
                    path: '',
                    name: 'home',
                    component: () => import('../views/landing_page/LandingPage.vue'),
                },
                {
                    path:'/o-que-fazemos',
                    name:'o-que-fazemos',
                    component: () => import('../views/o-que-fazemos/AboutPage.vue'),
                },
                {
                    path:'/nossa-historia',
                    name:'nossa-historia',
                    component: () => import('../views/nossa-historia/OurHistoryPage.vue'),
                },
                {
                    path:'/contato',
                    name:'contato',
                    component: () => import('../views/contato/ContactPage.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: NotFound
        }
        
    ]
});
export default router;