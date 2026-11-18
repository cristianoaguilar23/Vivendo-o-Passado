# Vivendo o Passado — versão 1.2

Plataforma web-first para organizar uma coleção pessoal de filmes, desenhos e séries. A logo enviada pelo usuário foi preservada em `assets/logo-original.jpg` e usada nos ícones.

## O que já funciona
- Interface responsiva com identidade retrô/neon.
- Navegação por décadas e categorias.
- Pesquisa no acervo.
- Classificação dos itens por categoria e década.
- Adição de arquivos de vídeo locais (armazenados no IndexedDB do navegador).
- Adição de endereço HTTP/HTTPS de vídeo autorizado.
- Detalhes, favoritos, histórico/continuar assistindo.
- Player HTML5.
- Manifesto e service worker básicos para instalação como PWA e cache da interface.

## Limitações importantes
- O catálogo começa vazio: nenhum filme ou desenho protegido foi incluído.
- Um endereço web comum de uma página de streaming não é necessariamente um endereço direto de vídeo. DRM, CORS, codecs e formatos podem impedir reprodução.
- Arquivos locais ocupam o armazenamento do navegador/dispositivo. Limpar os dados do navegador pode apagá-los.
- Favoritos e histórico ficam neste navegador, não sincronizam entre dispositivos.
- Chromecast, APK Android, Android TV e pacote webOS para LG ainda não estão implementados nem testados.
- A compatibilidade exata com a LG 60UK6200PSA precisa ser validada no navegador/webOS da TV.

## Executar localmente
A forma mais simples é servir esta pasta por HTTP. Com Python instalado:
```bash
python -m http.server 8000
```
Abra `http://localhost:8000`.

Também pode publicar os arquivos estáticos em GitHub Pages ou outro host estático gratuito. O navegador exige contexto seguro (HTTPS ou localhost) para algumas funções PWA.

## Próximas etapas
1. Testar a interface e o player em celular e na LG.
2. Melhorar metadados/capas e importação/exportação do catálogo.
3. Criar uma camada de catálogo compartilhada/sincronizável.
4. Preparar a versão webOS com navegação por controle remoto e validar no modelo informado.
5. Criar APK Android e depois suporte a Android TV/Google TV.
