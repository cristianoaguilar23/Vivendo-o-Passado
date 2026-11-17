# Vivendo o Passado — versão 1.3 (base web + Android)

Projeto pessoal para organizar e reproduzir uma coleção própria de filmes, comédias, desenhos e séries clássicas. A identidade visual oficial foi preservada: `web/assets/logo-original.jpg`, além dos ícones web e Android derivados da arte enviada.

## O que está implementado

### Plataforma web
- Interface responsiva escura com identidade retrô/neon.
- Logotipo oficial na página inicial, favicon, ícones PWA e telas de abertura Android.
- Navegação por décadas (1970, 1980, 1990 e 2000) e categorias (filmes, comédia, desenhos e séries).
- Pesquisa do acervo.
- Cartões com capa opcional, detalhes e sinopse/descrição.
- Fileiras de continuar assistindo, favoritos e adicionados recentemente.
- Adição de vídeos do dispositivo via seletor de arquivos.
- Adição de endereço HTTPS direto de vídeo autorizado.
- Player HTML5 e tentativa de retomar a posição.
- Favoritos, histórico e metadados guardados localmente.
- Importação/exportação JSON do catálogo (não inclui os arquivos de vídeo).
- PWA com manifesto e cache básico para a interface.

### Android
- Projeto Android nativo simples com WebView, sem dependência de Android Studio no fluxo de compilação.
- WebViewAssetLoader para servir os arquivos do app em origem HTTPS local, favorecendo IndexedDB e armazenamento web.
- JavaScript, DOM Storage e IndexedDB habilitados.
- Seletor nativo de arquivos conectado ao campo de upload de vídeo.
- Tela de abertura e ícones derivados da logo oficial.
- Workflow GitHub Actions para gerar um APK de teste automaticamente.
- Navegação Voltar do Android fecha diálogos/player antes de sair.

## O que ainda precisa ser testado

- O APK ainda precisa ser compilado pelo GitHub Actions e instalado em um aparelho Android real.
- Reprodução de cada codec/formato depende do Android e do WebView do aparelho.
- Vídeos muito grandes podem ultrapassar a quota de armazenamento do WebView/IndexedDB; para acervos grandes, uma futura camada de arquivos nativos será melhor.
- Links externos dependem de serem URLs HTTPS diretas, autorizadas e compatíveis com o player. DRM, CORS, autenticação, codecs e políticas do servidor podem impedir a reprodução.
- Não há sincronização entre dispositivos ou conta de usuário.
- APK de teste (`debug`) não é uma versão assinada para publicação na Play Store.
- Android TV/Google TV e LG webOS não estão implementados nem testados. A LG 60UK6200PSA usa webOS e exigirá pacote e validação próprios.

## Como gerar o APK pelo GitHub

1. Crie um repositório novo ou use um repositório vazio dedicado ao projeto.
2. Envie **todo o conteúdo desta pasta** para a raiz do repositório, incluindo `web/`, `android/` e `.github/`.
3. No GitHub, abra a aba **Actions**.
4. Selecione **Gerar APK Android** e clique em **Run workflow**. Também haverá compilação automática em pushes para `main`/`master` que alterem `web/`, `android/` ou o workflow.
5. Quando terminar, abra a execução e baixe o artefato **Vivendo-o-Passado-Android-debug**.
6. Extraia o ZIP do artefato e instale `app-debug.apk` no Android. Se o sistema solicitar, autorize a instalação para o aplicativo usado para abrir o APK.

O GitHub Actions prepara Java, Gradle e Android SDK; você não precisa instalar Android Studio para esse fluxo.

## Como executar a versão web

Sirva a pasta `web/` por HTTPS ou localhost. Com Python:
```bash
cd web
python -m http.server 8000
```
Abra `http://localhost:8000`.

Para publicar sem custo, GitHub Pages pode hospedar os arquivos estáticos. Algumas funções PWA exigem HTTPS ou localhost.

## Dados e privacidade

- Não existe servidor de conta nem envio automático do catálogo para terceiros.
- Favoritos, histórico e metadados ficam no armazenamento local do app/navegador.
- O backup JSON guarda os metadados, mas **não** transporta os vídeos locais.
- Os arquivos de vídeo adicionados são guardados no IndexedDB do dispositivo; desinstalar o app ou limpar seus dados pode apagá-los.
- Use apenas vídeos que você possui, obras em domínio público ou fontes para as quais tenha autorização. O projeto não inclui nem fornece cópias não autorizadas de obras protegidas.

## Estrutura

```text
.
├── web/                         # Aplicação web/PWA (fonte principal)
├── android/                     # Casca Android WebView
│   └── app/src/main/
│       ├── assets/www/           # Preenchido automaticamente no build
│       ├── java/.../MainActivity.java
│       └── res/                  # Ícones e splash
├── .github/workflows/
│   └── android-apk.yml           # Build automático do APK debug
├── scripts/build-apk.sh
└── README.md
```

## Próximas etapas
1. Enviar o projeto ao repositório GitHub e executar o workflow.
2. Instalar e testar o APK em um Android real, especialmente seleção de vídeos, persistência e player.
3. Corrigir eventuais diferenças de WebView/codec observadas no aparelho.
4. Depois, planejar sincronização opcional e adaptações específicas para Android TV e LG webOS.
