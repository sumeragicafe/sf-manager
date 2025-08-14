import { createRouter, createWebHistory} from 'vue-router';
import { useSessionStore } from '@/stores/session'
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
                },
                {
                    path:'/formulario-de-adocao/:animalId?',
                    name:'formulario-de-adocao',
                    component: () => import('../views/Landing/form/Form.vue')
                }
            ]
        },
        {
            path: '/staff',
            name: 'staff',
            meta: { requiresAuth: true },
            component: () => import('../layouts/staff/Staff.vue'),
             children:[
                {
                    path: 'pet',
                    name: 'PetPage',
                    component: () => import('../views/Staff/pets/Pets.vue')
                   
                },
                {
                    path: 'user',
                    name: 'UserPage',
                    component: () => import('../views/Staff/users/UsersPage.vue')
                   
                },
                {
                    path: 'role',
                    name: 'RolePage',
                    component: () => import('../views/Staff/roles/RolePage.vue')
                   
                },
                {
                    path: 'adoption-requests',
                    name: 'AdoptionRequestsPage',
                    component: () => import('../views/Staff/adoption-requests/AdoptionRequestsPage.vue')
                },
                {
                    path: 'media',
                    name: 'MediaPage',
                    component: () => import('../views/Staff/media/MediaPage.vue')
                },

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

router.beforeEach(async (to, from, next) => {
  const session = useSessionStore();

  // Verifica se a sessão já foi carregada, se não, carrega
  if (!session.isLoggedIn) {
    await session.fetchSession();
  }

  // Exemplo de rota protegida
  if (to.meta.requiresAuth && !session.isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

// async function isAuthenticated() {
//   try {
//     const res = await fetch('/api/user/session', {
//       credentials: 'include', // muito importante para enviar cookies
//     });
//     if (!res.ok) return false;

//     const data = await res.json();
//     return !!data.user;
//   } catch (err) {
//     return false;
//   }
// }





export default router;