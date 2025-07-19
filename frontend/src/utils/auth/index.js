import router from '@/router'; // ajuste o path conforme necessário

export async function verifySession() {
  try {
    const response = await fetch('/api/user/session', {
      method: 'GET',
      credentials: 'include', // IMPORTANTE: envia o cookie da sessão
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        router.push({ name: 'staff' }); // redireciona para o painel administrativo
      }
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
  }
}

export async function logout() {
  try {
    const res = await fetch('/api/user/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      // Opcional: limpar estado local (Pinia, etc)
      // Exemplo:
      // const session = useSessionStore();
      // session.logout();
      console.log(res);

      router.push({ name: 'login', query:  { loggedOut: '1' } });
    } else {
      console.error('Erro ao deslogar');
    }
  } catch (error) {
    console.error('Erro ao deslogar:', error);
  }
}