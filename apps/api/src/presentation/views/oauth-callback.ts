import { OAuthMethod } from "@harmonia/shared";

interface OAuthCallbackData {
  success: boolean;
  isPasswordSetupRequired?: boolean,
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  method?: OAuthMethod;
  error?: string;
}

export function getOAuthCallbackHTML(data: OAuthCallbackData, returnTo?: string): string {
  const messagePayload = data.success
    ? { type: 'oauth-success', data: { token: data.token, user: data.user, method: data.method, isPasswordSetupRequired: data.isPasswordSetupRequired } }
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
          
          window.opener.postMessage(message, targetOrigin);

          setTimeout(() => {
            window.close();
          }, 10000);

        } else {
          messageElement.textContent = 'Janela principal não encontrada. Pode fechar esta aba.';
        }
      } catch (e) {
        document.getElementById('message').textContent = 'Ocorreu um erro inesperado.';
      }
    })();
  </script>
</body>
</html>
  `;
}