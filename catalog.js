/*
 * Catálogo aberto — Vivendo o Passado 1.5.1
 * Descobre títulos no Internet Archive; valida licença e arquivo antes de habilitar reprodução.
 * A licença é declarada pelo depositante; consulte sempre a página original.
 */
(() => {
  'use strict';
  const grid = document.getElementById('openCatalogGrid');
  const status = document.getElementById('openCatalogStatus');
  if (!grid || !status) return;

  const tabs = [...document.querySelectorAll('.catalog-tab')];
  const video = document.getElementById('videoPlayer');
  const playerDialog = document.getElementById('playerDialog');
  const playerCaption = document.getElementById('playerCaption');
  const playerFullscreen = document.getElementById('playerFullscreen');
  const playerClose = document.getElementById('playerClose');
  const detailDialog = document.getElementById('detailDialog');
  const detailContent = document.getElementById('detailContent');
  const detailClose = document.getElementById('detailClose');
  const refreshButton = document.getElementById('refreshOpenCatalog');
  const favoritesButton = document.getElementById('showOpenFavorites');
  const moreButton = document.getElementById('loadMoreOpenCatalog');
  const searchInput = document.getElementById('openCatalogSearch');
  const clearSearch = document.getElementById('clearOpenCatalogSearch');
  const decadeTabs = [...document.querySelectorAll('.catalog-decade')];
  const specialButtons = [...document.querySelectorAll('.special-collection')];

  const streamingRails = document.getElementById('streamingRails');
  const featuredCollections = [
    { title: 'Memórias da Sessão da Tarde', subtitle: 'Aqueles filmes que reuniam todo mundo no sofá', items: [
      ['De Volta para o Futuro', '1985', 'Aventura · Ficção científica', 'back to the future'],
      ['Curtindo a Vida Adoidado', '1986', 'Comédia · Juventude', 'ferris bueller day off'],
      ['Os Goonies', '1985', 'Aventura · Amizade', 'the goonies'],
      ['Esqueceram de Mim', '1990', 'Comédia · Família', 'home alone'],
      ['A Lagoa Azul', '1980', 'Romance · Aventura', 'the blue lagoon'],
      ['Conta Comigo', '1986', 'Drama · Amizade', 'stand by me'],
      ['Querida, Encolhi as Crianças', '1989', 'Comédia · Fantasia', 'honey i shrunk the kids']
    ]},
    { title: 'Clássicos dos anos 80', subtitle: 'Grandes aventuras de uma década inesquecível', items: [
      ['E.T. – O Extraterrestre', '1982', 'Ficção científica · Família', 'et the extraterrestrial'],
      ['Os Caça-Fantasmas', '1984', 'Comédia · Fantasia', 'ghostbusters 1984'],
      ['O Exterminador do Futuro', '1984', 'Ação · Ficção científica', 'terminator 1984'],
      ['Top Gun', '1986', 'Ação · Drama', 'top gun 1986'],
      ['Dirty Dancing', '1987', 'Romance · Música', 'dirty dancing'],
      ['Batman', '1989', 'Ação · Heróis', 'batman 1989']
    ]},
    { title: 'Clássicos dos anos 90', subtitle: 'Histórias que viraram parte da cultura pop', items: [
      ['Titanic', '1997', 'Romance · Drama', 'titanic 1997'],
      ['Matrix', '1999', 'Ação · Ficção científica', 'the matrix 1999'],
      ['Jurassic Park', '1993', 'Aventura · Ficção científica', 'jurassic park 1993'],
      ['Uma Linda Mulher', '1990', 'Romance · Comédia', 'pretty woman 1990'],
      ['O Rei Leão', '1994', 'Animação · Família', 'the lion king 1994'],
      ['Forrest Gump', '1994', 'Drama · Romance', 'forrest gump 1994']
    ]},
    { title: 'Anos 2000: uma nova geração', subtitle: 'Sucessos que marcaram o começo do milênio', items: [
      ['Harry Potter e a Pedra Filosofal', '2001', 'Fantasia · Aventura', 'harry potter philosopher stone'],
      ['O Senhor dos Anéis', '2001', 'Fantasia · Aventura', 'lord of the rings fellowship'],
      ['Procurando Nemo', '2003', 'Animação · Família', 'finding nemo 2003'],
      ['Shrek', '2001', 'Animação · Comédia', 'shrek 2001'],
      ['Homem-Aranha', '2002', 'Ação · Heróis', 'spider man 2002'],
      ['Piratas do Caribe', '2003', 'Aventura · Fantasia', 'pirates of the caribbean 2003']
    ]},
    { title: 'Cinema brasileiro', subtitle: 'Produções nacionais para descobrir e rever', items: [
      ['O Auto da Compadecida', '2000', 'Comédia · Drama', 'o auto da compadecida'],
      ['Central do Brasil', '1998', 'Drama', 'central do brasil'],
      ['Cidade de Deus', '2002', 'Drama · Crime', 'cidade de deus'],
      ['Lisbela e o Prisioneiro', '2003', 'Comédia · Romance', 'lisbela e o prisioneiro'],
      ['Tropa de Elite', '2007', 'Ação · Drama', 'tropa de elite'],
      ['Meu Tio Matou um Cara', '2004', 'Comédia · Drama', 'meu tio matou um cara']
    ]},
    { title: 'Animações que marcaram época', subtitle: 'Aventuras para assistir em família e recordar', items: [
      ['A Bela e a Fera', '1991', 'Animação · Romance', 'beauty and the beast 1991'],
      ['Aladdin', '1992', 'Animação · Aventura', 'aladdin 1992'],
      ['Toy Story', '1995', 'Animação · Família', 'toy story 1995'],
      ['O Rei Leão', '1994', 'Animação · Família', 'the lion king 1994'],
      ['Mulan', '1998', 'Animação · Aventura', 'mulan 1998'],
      ['Monstros S.A.', '2001', 'Animação · Comédia', 'monsters inc 2001'],
      ['Os Incríveis', '2004', 'Animação · Ação', 'the incredibles 2004']
    ]}
  ];

  function renderStreamingRails() {
    if (!streamingRails) return;
    streamingRails.replaceChildren();
    featuredCollections.forEach((collection, rowIndex) => {
      const section = document.createElement('section'); section.className = 'streaming-rail';
      const heading = document.createElement('div'); heading.className = 'streaming-rail-heading';
      const copy = document.createElement('div'); const title = document.createElement('h3'); title.textContent = collection.title;
      const subtitle = document.createElement('p'); subtitle.textContent = collection.subtitle; copy.append(title, subtitle);
      const count = document.createElement('span'); count.textContent = `${collection.items.length} títulos`; heading.append(copy, count);
      const track = document.createElement('div'); track.className = 'streaming-track'; track.setAttribute('aria-label', collection.title);
      collection.items.forEach((item, index) => {
        const card = document.createElement('button'); card.type = 'button'; card.className = 'streaming-card';
        card.setAttribute('aria-label', `Consultar ${item[0]} no catálogo aberto`);
        const art = document.createElement('span'); art.className = `streaming-art art-${(rowIndex + index) % 8}`;
        const number = document.createElement('small'); number.textContent = item[1];
        const name = document.createElement('strong'); name.textContent = item[0];
        const genre = document.createElement('span'); genre.className = 'streaming-genre'; genre.textContent = item[2];
        const action = document.createElement('span'); action.className = 'streaming-card-action'; action.textContent = '⌕ Consultar catálogo';
        art.append(number, name, genre); card.append(art, action);
        card.addEventListener('click', () => {
          if (searchInput) searchInput.value = item[3];
          load('movie', false, item[3], 'all');
          document.getElementById('openCatalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        track.append(card);
      });
      section.append(heading, track); streamingRails.append(section);
    });
  }

  const searches = {
    all: '(title:(film) OR title:(movie) OR subject:(motion pictures) OR subject:(short films) OR title:(cartoon) OR subject:(animation) OR title:(television))',
    movie: '(title:(film) OR title:(movie) OR subject:(motion pictures))',
    animation: '(subject:(animation) OR subject:(cartoons) OR title:(animated))',
    series: '(subject:(television) OR title:(television) OR title:(tv))',
    anime: '(subject:(anime) OR title:(anime) OR subject:(japanese animation))'
  };
  const acceptedLicense = value => {
    const s = String(value || '').toLowerCase().trim();
    if (!s) return false;
    if (s.includes('publicdomain') || s.includes('creativecommons.org/publicdomain')) return true;
    // Creative Commons 1.0/2.0/2.5/3.0/4.0: licenças abertas que permitem
    // redistribuição/streaming sob suas condições (atribuição, share-alike etc.).
    return /creativecommons\.org\/licenses\/(zero|by|by-sa|by-nc|by-nc-sa|by-nd|by-nc-nd)\/(1\.0|2\.0|2\.5|3\.0|4\.0)(\/|$)/.test(s);
  };

  let current = 'all';
  let currentTerm = '';
  let currentDecade = 'all';
  let currentPage = 1;
  let totalFound = 0;
  let requestSerial = 0;
  let searchTimer = null;
  let showingFavorites = false;
  const FAVORITES_KEY = 'vop-open-catalog-favorites-v1';
  function readFavorites() {
    try { const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); return Array.isArray(value) ? value.filter(item => item && item.identifier) : []; }
    catch (_) { return []; }
  }
  function saveFavorites(items) {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(items)); return true; }
    catch (_) { setStatus('Não foi possível salvar os favoritos neste aparelho. Verifique o espaço disponível.'); return false; }
  }
  function isFavorite(identifier) { return readFavorites().some(item => item.identifier === identifier); }
  function setFavoritesButtonState() { if (favoritesButton) { favoritesButton.textContent = showingFavorites ? 'Voltar ao catálogo' : `♥ Meus favoritos (${readFavorites().length})`; favoritesButton.setAttribute('aria-pressed', String(showingFavorites)); } }
  function showFavorites() {
    showingFavorites = true; setFavoritesButtonState();
    tabs.forEach(tab => tab.classList.remove('active')); decadeTabs.forEach(tab => tab.classList.remove('active'));
    if (moreButton) moreButton.hidden = true;
    const items = readFavorites(); totalFound = items.length;
    if (!items.length) { grid.replaceChildren(); setStatus('Você ainda não salvou títulos. Abra um título no catálogo e toque em “Adicionar aos favoritos”.'); return; }
    render(items); setStatus(`${items.length} título(s) salvo(s) nos seus favoritos. Os dados ficam armazenados neste aparelho.`);
  }
  const pageSize = 30;
  const cache = new Map();
  const totalCache = new Map();
  const metadataCache = new Map();
  const cacheKey = (category, term, decade) => `${category}::${term.toLowerCase()}::${decade}`;
  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const itemPage = id => `https://archive.org/details/${encodeURIComponent(id)}`;
  const posterUrl = id => `https://archive.org/services/img/${encodeURIComponent(id)}`;
  const escapeFile = name => String(name).split('/').map(encodeURIComponent).join('/');
  const escapeSearch = value => value.replace(/[+\-&|!(){}\[\]^"~*?:\\/]/g, ' ').replace(/\s+/g, ' ').trim();

  function setStatus(message) { status.textContent = message; }
  function getPlayerElements() {
    if (!video || !playerDialog) { setStatus('O player não foi encontrado nesta versão do aplicativo.'); return false; }
    return true;
  }
  function updateMoreButton(listLength) {
    if (!moreButton) return;
    moreButton.hidden = listLength >= totalFound || listLength % pageSize !== 0;
  }
  function render(list, append = false) {
    if (!append) grid.replaceChildren();
    if (!list.length && !append) {
      setStatus(currentTerm ? `Nenhum resultado encontrado para “${currentTerm}”. Tente outros termos.` : 'Nenhum título encontrado nesta categoria. Tente outra categoria ou atualize o catálogo.');
      if (moreButton) moreButton.hidden = true;
      return;
    }
    const count = grid.querySelectorAll('.open-card').length + list.length;
    setStatus(`${count} títulos encontrados${totalFound ? ` de ${totalFound}` : ''}. Abra um título para conferir a licença e a disponibilidade do vídeo.`);
    list.forEach(item => {
      const card = document.createElement('article');
      card.className = 'open-card'; card.tabIndex = 0; card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Verificar e reproduzir ${clean(item.title)}`);
      const poster = document.createElement('div'); poster.className = 'open-poster'; poster.textContent = '▶';
      const img = document.createElement('img'); img.loading = 'lazy'; img.alt = ''; img.src = posterUrl(item.identifier); img.onerror = () => img.remove(); poster.append(img);
      const info = document.createElement('div'); info.className = 'open-card-info';
      const title = document.createElement('b'); title.textContent = clean(item.title) || 'Título sem nome';
      const small = document.createElement('small');
      const licenseLabel = item.licenseurl ? (acceptedLicense(item.licenseurl) ? 'Licença aberta declarada' : 'Licença a conferir') : 'Licença pendente de verificação';
      small.textContent = [item.year || '', licenseLabel].filter(Boolean).join(' · ');
      info.append(title, small); card.append(poster, info);
      if (isFavorite(item.identifier)) { const badge = document.createElement('span'); badge.className = 'favorite-badge'; badge.textContent = '♥ Salvo'; info.append(badge); }
      const open = () => showItemDetails(item, card);
      card.addEventListener('click', open);
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
      grid.append(card);
    });
  }

  function appendDetailLine(parent, label, value) {
    const text = clean(value);
    if (!text) return;
    const row = document.createElement('p');
    row.className = 'detail-meta-line';
    const strong = document.createElement('strong'); strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(text)); parent.append(row);
  }

  function metadataText(value) {
    if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ');
    return clean(value);
  }

  async function showItemDetails(item, card) {
    if (!detailDialog || !detailContent) { setStatus('A tela de detalhes não está disponível nesta versão.'); return; }
    if (card?.dataset.loading === 'true') return;
    if (card) card.dataset.loading = 'true';
    detailContent.replaceChildren();
    const heading = document.createElement('h2'); heading.className = 'detail-title'; heading.textContent = clean(item.title) || 'Título sem nome';
    const loading = document.createElement('p'); loading.className = 'detail-loading'; loading.textContent = 'Carregando informações e conferindo a licença…';
    detailContent.append(heading, loading);
    if (!detailDialog.open) detailDialog.showModal();
    try {
      const data = await getItemMetadata(item.identifier);
      const metadata = data.metadata || {};
      const title = clean(metadata.title || item.title);
      heading.textContent = title;
      loading.remove();
      const poster = document.createElement('img'); poster.className = 'detail-poster'; poster.src = posterUrl(item.identifier); poster.alt = `Capa de ${title}`; poster.onerror = () => poster.remove();
      detailContent.append(poster);
      appendDetailLine(detailContent, 'Ano', metadata.year || item.year || metadata.date);
      appendDetailLine(detailContent, 'Categoria', metadata.mediatype || 'Vídeo');
      appendDetailLine(detailContent, 'Criador', metadataText(metadata.creator));
      appendDetailLine(detailContent, 'Coleção', metadataText(metadata.collection));
      const description = document.createElement('div'); description.className = 'detail-description';
      const descLabel = document.createElement('h3'); descLabel.textContent = 'Sinopse / descrição'; description.append(descLabel);
      const descText = document.createElement('p');
      let rawDescription = metadata.description || 'O Internet Archive não forneceu uma descrição para este título.';
      if (Array.isArray(rawDescription)) rawDescription = rawDescription.join('\n');
      // Descrições do catálogo são exibidas como texto, sem interpretar HTML remoto.
      descText.textContent = String(rawDescription).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      description.append(descText); detailContent.append(description);
      const license = metadata.licenseurl || item.licenseurl || '';
      const licenseOk = acceptedLicense(license);
      appendDetailLine(detailContent, 'Licença declarada', licenseOk ? (String(license).toLowerCase().includes('publicdomain') ? 'Domínio público' : 'Creative Commons') : 'Não confirmada nos metadados');
      const actions = document.createElement('div'); actions.className = 'detail-actions';
      const favoriteButton = document.createElement('button'); favoriteButton.type = 'button'; favoriteButton.className = 'btn ghost';
      const updateFavoriteButton = () => { favoriteButton.textContent = isFavorite(item.identifier) ? '♥ Remover dos favoritos' : '♡ Adicionar aos favoritos'; };
      updateFavoriteButton();
      favoriteButton.addEventListener('click', () => {
        const favorites = readFavorites(); const exists = favorites.some(entry => entry.identifier === item.identifier);
        const updated = exists ? favorites.filter(entry => entry.identifier !== item.identifier) : favorites.concat([{ identifier: item.identifier, title: clean(metadata.title || item.title), year: metadata.year || item.year || '', licenseurl: license }]);
        if (saveFavorites(updated)) { updateFavoriteButton(); setFavoritesButtonState(); if (showingFavorites) showFavorites(); }
      });
      const playButton = document.createElement('button'); playButton.type = 'button'; playButton.className = 'btn primary'; playButton.textContent = '▶ Verificar vídeo e reproduzir';
      playButton.disabled = !licenseOk;
      playButton.addEventListener('click', () => { detailDialog.close(); playArchiveItem(item, card || { dataset: {} }); });
      const sourceLink = document.createElement('a'); sourceLink.className = 'btn ghost'; sourceLink.href = itemPage(item.identifier); sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; sourceLink.textContent = 'Consultar página original';
      actions.append(favoriteButton, playButton, sourceLink); detailContent.append(actions);
      if (!licenseOk) {
        const warning = document.createElement('p'); warning.className = 'detail-warning'; warning.textContent = 'A licença aberta não pôde ser confirmada. Consulte a página original antes de utilizar este conteúdo.'; detailContent.append(warning);
      }
    } catch (error) {
      loading.textContent = 'Não foi possível carregar os detalhes deste título. Consulte a página original no Internet Archive.';
      const link = document.createElement('a'); link.href = itemPage(item.identifier); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'btn ghost'; link.textContent = 'Abrir página original'; detailContent.append(link);
    } finally { if (card) delete card.dataset.loading; }
  }

  detailClose?.addEventListener('click', () => detailDialog?.close());

  function buildQuery(category, term, decade) {
    // Não filtre por licenseurl na busca avançada: esse campo nem sempre está indexado.
    // A licença é verificada com os metadados completos antes de habilitar a reprodução.
    let query = `mediatype:movies AND ${searches[category] || searches.all}`;
    const safe = escapeSearch(term);
    if (safe) query += ` AND (title:(${safe}) OR subject:(${safe}) OR description:(${safe}))`;
    const ranges = { '1970': [1970, 1979], '1980': [1980, 1989], '1990': [1990, 1999], '2000': [2000, 2009] };
    if (ranges[decade]) query += ` AND year:[${ranges[decade][0]} TO ${ranges[decade][1]}]`;
    return query;
  }
  function buildSearchUrl(category, term, decade, page) {
    const params = new URLSearchParams();
    params.set('q', buildQuery(category, term, decade));
    ['identifier', 'title', 'year', 'licenseurl'].forEach(field => params.append('fl[]', field));
    params.set('rows', String(pageSize)); params.set('page', String(page)); params.set('output', 'json');
    params.append('sort[]', 'downloads desc');
    return `https://archive.org/advancedsearch.php?${params.toString()}`;
  }

  async function load(category = current, force = false, term = currentTerm, decade = currentDecade) {
    showingFavorites = false; setFavoritesButtonState();
    current = category; currentTerm = clean(term); currentDecade = decade; currentPage = 1; totalFound = 0;
    const serial = ++requestSerial;
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.openCategory === category));
    decadeTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.openDecade === decade));
    if (searchInput && searchInput.value !== currentTerm) searchInput.value = currentTerm;
    if (clearSearch) clearSearch.hidden = !currentTerm;
    const key = cacheKey(category, currentTerm, currentDecade);
    if (cache.has(key) && !force) {
      const cached = cache.get(key);
      totalFound = totalCache.get(key) || cached.length;
      currentPage = Math.max(1, Math.ceil(cached.length / pageSize));
      render(cached); updateMoreButton(cached.length); return;
    }
    grid.replaceChildren(); if (moreButton) moreButton.hidden = true;
    setStatus(currentTerm ? `Buscando “${currentTerm}” no catálogo de vídeos…` : 'Descobrindo filmes, animações e programas no catálogo…');
    try {
      const response = await fetch(buildSearchUrl(category, currentTerm, currentDecade, 1), { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (serial !== requestSerial) return;
      const docs = (data.response?.docs || []).filter(item => item.identifier && item.title);
      totalFound = Number(data.response?.numFound || docs.length);
      cache.set(key, docs); totalCache.set(key, totalFound);
      render(docs); updateMoreButton(docs.length);
    } catch (error) {
      if (serial !== requestSerial) return;
      console.warn('Catálogo aberto indisponível:', error);
      setStatus('Não foi possível consultar o catálogo agora. Verifique a internet e tente novamente.');
      const link = document.createElement('a'); link.href = 'https://archive.org/details/movies'; link.target = '_blank'; link.rel = 'noopener'; link.className = 'text-button'; link.textContent = 'Consultar filmes no Internet Archive'; grid.append(link);
    }
  }

  async function loadMore() {
    if (moreButton?.disabled) return;
    const category = current, term = currentTerm, decade = currentDecade, key = cacheKey(category, term, decade), serial = requestSerial;
    const existing = cache.get(key) || [];
    const nextPage = currentPage + 1;
    moreButton.disabled = true; moreButton.textContent = 'Carregando…';
    try {
      const response = await fetch(buildSearchUrl(category, term, decade, nextPage), { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (serial !== requestSerial || category !== current || term !== currentTerm || decade !== currentDecade) return;
      const docs = (data.response?.docs || []).filter(item => item.identifier && item.title);
      const seen = new Set(existing.map(item => item.identifier));
      const fresh = docs.filter(item => !seen.has(item.identifier));
      currentPage = nextPage; cache.set(key, existing.concat(fresh));
      totalFound = Number(data.response?.numFound || totalFound); totalCache.set(key, totalFound);
      render(fresh, true); updateMoreButton(cache.get(key).length);
      if (!fresh.length && docs.length) setStatus('Esta página não trouxe títulos novos. Você pode tentar atualizar o catálogo.');
    } catch (error) {
      if (serial === requestSerial) setStatus('Não foi possível carregar mais títulos. Verifique a internet e tente novamente.');
    } finally {
      if (moreButton) { moreButton.disabled = false; moreButton.textContent = 'Carregar mais títulos'; }
    }
  }

  function findPlayableVideo(files) {
    if (!Array.isArray(files)) return null;
    const candidates = files.filter(file => {
      const name = String(file.name || '').toLowerCase(), format = String(file.format || '').toLowerCase();
      if (!name || /(_thumb\.jpg|\.jpe?g|\.png|\.gif)$/i.test(name)) return false;
      const extension = /\.(mp4|m4v|webm|ogv|ogg)$/i.test(name);
      const videoFormat = format.includes('mpeg4') || format.includes('h.264') || format.includes('ogg video') || format.includes('webm');
      return (extension || videoFormat) && !String(file.source || '').includes('metadata');
    });
    candidates.sort((a, b) => {
      const score = file => { const name = String(file.name || '').toLowerCase(), format = String(file.format || '').toLowerCase();
        return (name.endsWith('.mp4') ? 100 : 0) + (format.includes('mpeg4') || format.includes('h.264') ? 40 : 0) + (name.includes('_512kb') ? 10 : 0) - (name.endsWith('.ogv') || name.endsWith('.ogg') ? 20 : 0); };
      return score(b) - score(a);
    });
    return candidates[0] || null;
  }
  async function getItemMetadata(identifier) {
    if (metadataCache.has(identifier)) return metadataCache.get(identifier);
    const promise = fetch(`https://archive.org/metadata/${encodeURIComponent(identifier)}`, { headers: { Accept: 'application/json' } }).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json();
    });
    metadataCache.set(identifier, promise);
    try { return await promise; } catch (error) { metadataCache.delete(identifier); throw error; }
  }
  async function playArchiveItem(item, card) {
    if (!getPlayerElements() || card.dataset.loading === 'true') return;
    card.dataset.loading = 'true'; setStatus(`Verificando os arquivos de “${clean(item.title)}”…`);
    try {
      const data = await getItemMetadata(item.identifier), metadata = data.metadata || {};
      const declaredLicense = metadata.licenseurl || item.licenseurl || '';
      if (!acceptedLicense(declaredLicense)) throw new Error('A licença aberta não pôde ser confirmada nos metadados da obra.');
      const file = findPlayableVideo(data.files);
      if (!file) throw new Error('Este título não possui um arquivo de vídeo compatível identificado.');
      const source = `https://archive.org/download/${encodeURIComponent(item.identifier)}/${escapeFile(file.name)}`;
      playerCaption.textContent = clean(metadata.title || item.title);
      video.pause(); video.removeAttribute('src'); video.load(); video.src = source; playerDialog.showModal();
      video.onerror = () => setStatus('O arquivo foi encontrado, mas o player não conseguiu reproduzi-lo. Tente outro título.');
      video.play().then(() => setStatus(`Reproduzindo: ${clean(metadata.title || item.title)}.`)).catch(() => setStatus('Vídeo localizado. Toque no botão ▶ do player para iniciar a reprodução.'));
    } catch (error) {
      console.warn('Não foi possível reproduzir o item:', item.identifier, error);
      setStatus(`${clean(item.title)}: ${error.message || 'não foi possível localizar um vídeo reproduzível.'}`);
      const link = document.createElement('a'); link.href = itemPage(item.identifier); link.target = '_blank'; link.rel = 'noopener'; link.className = 'text-button'; link.textContent = 'Ver detalhes e licença no Internet Archive'; grid.append(link);
    } finally { delete card.dataset.loading; }
  }

  favoritesButton?.addEventListener('click', () => { if (showingFavorites) load(current, false, currentTerm, currentDecade); else showFavorites(); });
  tabs.forEach(tab => tab.addEventListener('click', () => load(tab.dataset.openCategory, false, currentTerm, currentDecade)));
  decadeTabs.forEach(tab => tab.addEventListener('click', () => load(current, false, currentTerm, tab.dataset.openDecade)));
  refreshButton?.addEventListener('click', () => load(current, true, currentTerm, currentDecade));
  moreButton?.addEventListener('click', loadMore);
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer); searchTimer = setTimeout(() => load(current, false, searchInput.value, currentDecade), 450);
  });
  clearSearch?.addEventListener('click', () => { if (searchInput) searchInput.value = ''; load(current, false, '', currentDecade); });
  specialButtons.forEach(button => button.addEventListener('click', () => {
    const term = button.dataset.specialTerm || '';
    const category = button.dataset.specialCategory || 'all';
    const decade = button.dataset.specialDecade || 'all';
    if (searchInput) searchInput.value = term;
    load(category, false, term, decade);
    document.getElementById('openCatalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  async function togglePlayerFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (playerDialog?.requestFullscreen) await playerDialog.requestFullscreen();
      else if (video?.requestFullscreen) await video.requestFullscreen();
      if (playerFullscreen) playerFullscreen.textContent = document.fullscreenElement ? '⛶ Sair da tela cheia' : '⛶ Tela cheia';
    } catch (_) { setStatus('A tela cheia não está disponível neste aparelho. Use o player na horizontal.'); }
  }
  playerFullscreen?.addEventListener('click', togglePlayerFullscreen);
  playerClose?.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); playerDialog?.close(); });
  document.addEventListener('fullscreenchange', () => { if (playerFullscreen) playerFullscreen.textContent = document.fullscreenElement ? '⛶ Sair da tela cheia' : '⛶ Tela cheia'; });
  playerDialog?.addEventListener('close', () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); if (video) { video.pause(); video.removeAttribute('src'); video.load(); } });
  renderStreamingRails();
  setFavoritesButtonState();
  load('all');
})();
