# Vivendo o Passado — versão 1.4.8 (base web + Android)

Projeto pessoal para organizar e reproduzir uma coleção própria de filmes, comédias, desenhos e séries clássicas. A identidade visual oficial foi preservada: `web/assets/logo-original.jpg`, além dos ícones web e Android derivados da arte enviada.

## O que está implementado

### Plataforma web
- Interface responsiva escura com identidade retrô/neon.
- Logotipo oficial na página inicial, favicon, ícones PWA e telas de abertura Android.
- Navegação por décadas (1970, 1980, 1990 e 2000) e categorias (filmes, comédia, desenhos e séries).
- Pesquisa do acervo pessoal.
- Busca remota no catálogo gratuito por título/assunto, respeitando a categoria selecionada.
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

## Atualização 1.4.4
- Busca remota no catálogo aberto, paginação, proteção contra respostas fora de ordem e filtros por década (1970, 1980, 1990 e 2000).
- A disponibilidade de resultados e a reprodução dependem do Internet Archive, das licenças declaradas e da compatibilidade do arquivo com o aparelho.

## Próximas etapas
1. Enviar o projeto ao repositório GitHub e executar o workflow.
2. Instalar e testar o APK em um Android real, especialmente seleção de vídeos, persistência e player.
3. Corrigir eventuais diferenças de WebView/codec observadas no aparelho.
4. Depois, planejar sincronização opcional e adaptações específicas para Android TV e LG webOS.


## Atualização 1.4.8
- Busca do catálogo ampliada: não depende mais de `licenseurl` indexado na busca avançada, que podia excluir todos os resultados.
- Títulos são descobertos primeiro; licença é verificada nos metadados completos antes de habilitar reprodução.
- Categorias e coleções continuam sujeitas ao acervo disponível no Internet Archive.

## Atualização 1.4.7
- Tela de detalhes antes da reprodução, com metadados, descrição, licença declarada e acesso à página original.


## Versão 1.4.7
- Atalhos de coleções temáticas para cinema mudo, desenhos antigos, ficção científica, terror clássico e memória histórica.
- Cache do aplicativo atualizado para incluir `catalog.js`, garantindo que a lógica do catálogo seja armazenada junto aos demais arquivos web.
- Versões Android e workflow atualizados para 1.4.7.


## Versão 1.5.0 — Vitrine de streaming

A tela inicial agora apresenta fileiras horizontais de títulos organizados por coleções nostálgicas: Sessão da Tarde, anos 80, anos 90, anos 2000 e cinema brasileiro. Ao tocar em um cartão, o aplicativo consulta o catálogo aberto pelo título. A presença de um cartão não significa que exista cópia autorizada ou dublada disponível para reprodução; a licença e o arquivo continuam sendo verificados individualmente.


## Versão 1.5.1 — Animações nostálgicas

- Nova fileira com clássicos de animação: A Bela e a Fera, Aladdin, Toy Story, O Rei Leão, Mulan, Monstros S.A. e Os Incríveis.
- Os cartões consultam o catálogo aberto; a existência de um título na vitrine não garante que haja vídeo autorizado disponível.
- Atualizados versionCode, versionName, workflow e cache para 1.5.1.
