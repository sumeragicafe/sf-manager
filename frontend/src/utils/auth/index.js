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
