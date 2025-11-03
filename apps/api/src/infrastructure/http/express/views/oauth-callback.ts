interface OAuthCallbackData {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  error?: string;
}

export function getOAuthCallbackHTML(data: OAuthCallbackData, returnTo?: string): string {
  const messagePayload = data.success
    ? { type: 'oauth-success', data: { token: data.token, user: data.user } }
    : { type: 'oauth-error', error: data.error || 'Unknown error' };

  const messageJson = JSON.stringify(messagePayload);
  const targetOrigin = returnTo || '*';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Autenticando...</title>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <p id="message">Finalizando autenticação...</p>
  </div>

  <script>
    (function() {
      try {
        const message = ${messageJson};
        const targetOrigin = '${targetOrigin}';
        const messageElement = document.getElementById('message');

        if (window.opener && !window.opener.closed) {
          messageElement.textContent = message.type === 'oauth-success' ? 'Autenticação concluída!' : 'Falha na autenticação.';
          
          console.log('📤 Enviando mensagem para a janela principal:', message, 'para a origem:', targetOrigin);
          window.opener.postMessage(message, targetOrigin);

          // Dê tempo para a mensagem ser processada antes de fechar.
          // setTimeout(() => {
          //   console.log('🚪 Fechando popup.');
          //   window.close();
          // }, 500); // 500ms é um tempo seguro.

        } else {
          console.error('❌ A janela principal (opener) não foi encontrada ou está fechada.');
          messageElement.textContent = 'Janela principal não encontrada. Pode fechar esta aba.';
        }
      } catch (e) {
        console.error('❌ Erro no script de callback:', e);
        document.getElementById('message').textContent = 'Ocorreu um erro inesperado.';
      }
    })();
  </script>
</body>
</html>
  `;
}