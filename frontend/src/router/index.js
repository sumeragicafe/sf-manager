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
                    component: () => import('../views/Landing/home/HomePage.vue'),
                },
                {
                    path:'/o-que-fazemos',
                    name:'o-que-fazemos',
                    component: () => import('../views/Landing/o-que-fazemos/AboutPage.vue'),
                },
                {
                    path:'/nossa-historia',
                    name:'nossa-historia',
                    component: () => import('../views/Landing/nossa-historia/OurHistoryPage.vue'),
                },
                {
                    path:'/contato',
                    name:'contato',
                    component: () => import('../views/Landing/contato/ContactPage.vue')
                },
                {
                    path:'/eventos',
                    name:'eventos',
                    component: () => import('../views/Landing/eventos/EventsPage.vue')
                },
                {
                    path:'/parcerias',
                    name:'parcerias',
                    component: () => import('../views/Landing/parcerias/PartnersPage.vue')
                }
            ]
        },
        {
            path: '/staff',
            name: 'staff',
            component: () => import('../layouts/staff/Staff.vue'),
             children:[
                {
                    path: 'pets',
                    name: 'PetsPage',
                    component: () => import('../views/Staff/pets/Pets.vue')
                   
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