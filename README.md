# Minha sessão

Aplicativo React com Capacitor para Android. O estado do Context existe em memória enquanto o processo roda. O Preferences guarda a sessão entre execuções em SharedPreferences. Ao abrir, o aplicativo mostra uma tela de carregamento, lê supabase_session e restaura os tokens com setSession. O listener salva também as renovações de token e remove a sessão ao sair. A senha serve apenas para o login. Preferences não oferece criptografia própria.

## Executar

1. Instale Node 22.12 ou superior, Android Studio e o SDK solicitado pelo Gradle.
2. No Supabase, habilite o provedor de e-mail e crie um usuário de teste com e-mail confirmado em Authentication → Users.
3. Copie `.env.example` para `.env`. Preencha a URL do projeto e a chave **publishable** (ou anon legada). Use somente a chave pública.
4. Na raiz do projeto, execute `npm ci` e `npm run android`. No Android Studio selecione um aparelho ou emulador e clique em Run. Após alterar o .env, repita o build e a sincronização.
5. Para visualizar no navegador, execute `npm run dev`. Nesse ambiente o Preferences usa localStorage.

## Gravar a demonstração

Inicie a gravação de tela no Android. Entre com o usuário de teste e mostre o e-mail na área interna. Com o aparelho conectado, execute no computador `adb shell am force-stop br.edu.sessao.mobile`. Abra o app pelo ícone e mostre a área interna com o mesmo e-mail, sem digitar credenciais. Encerre a gravação. Em uma verificação separada, toque em Sair e reabra para confirmar o retorno ao login.

Anexe o vídeo e o ZIP do código ao Classroom.
