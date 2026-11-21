const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const DB_NAME='vivendo-passado-db', STORE='videos';
let items=[], activeFilter='all', activeItem=null, toastTimer;
const catalog=$('#catalog'), addDialog=$('#addDialog'), detailDialog=$('#detailDialog'), playerDialog=$('#playerDialog'), video=$('#videoPlayer');

function notify(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800)}
function readMeta(){try{return JSON.parse(localStorage.getItem('vp_items')||'[]')}catch{return []}}
function saveMeta(){localStorage.setItem('vp_items',JSON.stringify(items.map(({blob,...m})=>m)))}
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE,{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function putBlob(id,blob){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({id,blob});tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
async function getBlob(id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>res(r.result?.blob);r.onerror=()=>rej(r.error)})}
async function delBlob(id){const db=await openDB();db.transaction(STORE,'readwrite').objectStore(STORE).delete(id)}
function load(){items=readMeta();render()}
function matches(it){if(activeFilter==='all')return true;if(activeFilter==='favorites')return it.favorite;if(['1970','1980','1990','2000'].includes(activeFilter))return String(it.decade||'')===activeFilter;return (it.category||'').toLowerCase().includes(activeFilter.toLowerCase())}
function render(){
 const q=$('#searchInput').value.trim().toLowerCase();
 const shown=items.filter(matches).filter(x=>(x.title+' '+(x.category||'')+' '+(x.decade||'')).toLowerCase().includes(q));
 $('#itemCount').textContent=`${shown.length} ${shown.length===1?'título':'títulos'}`;
 $('#sectionTitle').textContent=activeFilter==='favorites'?'Meus favoritos':activeFilter==='all'?'Minha coleção':activeFilter==='1970'?'Clássicos dos anos 70':activeFilter==='1980'?'Clássicos dos anos 80':activeFilter==='1990'?'Clássicos dos anos 90':activeFilter==='2000'?'Clássicos dos anos 2000':activeFilter;
 $('#emptyState').hidden=shown.length>0;
 catalog.querySelectorAll('.card').forEach(e=>e.remove());
 shown.forEach(it=>{
  const card=document.createElement('article');
  card.className='card';card.tabIndex=0;card.setAttribute('role','button');
  card.setAttribute('aria-label',`Detalhes de ${it.title}`);
  card.innerHTML=`<button class="fav ${it.favorite?'on':''}" aria-label="Favoritar">${it.favorite?'♥':'♡'}</button><div class="poster"><div class="disc"><span>▶</span></div></div><div class="card-title"></div><div class="card-meta"></div>${it.duration&&it.duration>0?`<div class="progress-track"><span style="width:${Math.min(100,Math.round((it.position||0)/it.duration*100))}%"></span></div>`:''}`;
  if(it.poster){
    const p=card.querySelector('.poster');
    const img=document.createElement('img');img.src=it.poster;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';
    p.classList.add('has-poster');p.querySelector('.disc').hidden=true;p.append(img);
  }
  card.querySelector('.card-title').textContent=it.title;
  card.querySelector('.card-meta').textContent=[it.decade?`Anos ${String(it.decade).slice(2)}`:'',it.category||'Minha coleção'].filter(Boolean).join(' · ');
  card.querySelector('.fav').onclick=e=>{e.stopPropagation();it.favorite=!it.favorite;saveMeta();render()};
  card.onclick=()=>showDetails(it);
  card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showDetails(it)}};
  catalog.append(card);
});
 const recent=items.filter(x=>x.lastPlayed).sort((a,b)=>b.lastPlayed-a.lastPlayed).slice(0,10);
 const favorites=items.filter(x=>x.favorite).sort((a,b)=>(b.created||0)-(a.created||0)).slice(0,10);
 const added=items.slice().sort((a,b)=>(b.created||0)-(a.created||0)).slice(0,10);
 renderRail('continueList',recent,'continue');
 renderRail('favoritesList',favorites,'details');
 renderRail('recentList',added,'details');
 $('#continueSection').hidden=!recent.length;
 $('#favoritesSection').hidden=!favorites.length;
 $('#recentSection').hidden=!added.length;
}
function renderRail(targetId, list, mode){
 const target=$('#'+targetId);target.innerHTML='';
 list.forEach(it=>{
  const el=document.createElement('button');el.type='button';el.className='continue-item rail-card';
  const art=document.createElement('span');art.className='rail-art';
  if(it.poster){const img=document.createElement('img');img.src=it.poster;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';art.append(img)}
  else art.textContent='📀';
  const info=document.createElement('span');info.className='rail-info';
  const title=document.createElement('b');title.textContent=it.title;
  const small=document.createElement('small');small.textContent=mode==='continue'?(it.position>0?'Retomar reprodução':'Reproduzido recentemente'):[it.decade?`Anos ${String(it.decade).slice(2)}`:'',it.category||'Coleção pessoal'].filter(Boolean).join(' · ');
  info.append(title,small);el.append(art,info);
  el.onclick=()=>mode==='continue'?playItem(it):showDetails(it);
  el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();mode==='continue'?playItem(it):showDetails(it)}};
  target.append(el);
 });
}
function showDetails(it){activeItem=it;$('#detailContent').innerHTML=`<div class="detail-art">📀</div><h2></h2><div class="detail-meta"></div><p class="detail-desc"></p><div class="hero-actions"><button class="btn primary" id="detailPlay">▶ ${it.position>0?'Continuar':'Reproduzir'}</button><button class="btn ghost" id="detailFav">♡ Favoritar</button><button class="btn ghost" id="detailDelete">Remover</button></div>`;if(it.poster){const art=$('#detailContent .detail-art');const img=document.createElement('img');img.src=it.poster;img.alt='';img.referrerPolicy='no-referrer';art.textContent='';art.append(img)}$('#detailContent h2').textContent=it.title;$('#detailContent .detail-meta').textContent=[it.decade?`Década: ${it.decade}`:'',it.category||'Coleção pessoal',it.kind==='url'?'Fonte online':'Arquivo local'].filter(Boolean).join(' · ');$('#detailContent .detail-desc').textContent=it.description||'Adicionado à sua coleção pessoal.';$('#detailPlay').onclick=()=>playItem(it);$('#detailFav').textContent=it.favorite?'♥ Favorito':'♡ Favoritar';$('#detailFav').onclick=()=>{it.favorite=!it.favorite;saveMeta();$('#detailFav').textContent=it.favorite?'♥ Favorito':'♡ Favoritar';render()};$('#detailDelete').onclick=async()=>{if(confirm(`Remover "${it.title}" da coleção?`)){items=items.filter(x=>x.id!==it.id);if(it.kind==='file')await delBlob(it.id);saveMeta();detailDialog.close();render()}};detailDialog.showModal()}
async function playItem(it){let src=it.url;if(it.kind==='file'){const blob=await getBlob(it.id);if(!blob){notify('Arquivo não encontrado neste navegador. Adicione-o novamente.');return}src=URL.createObjectURL(blob)}if(!src){notify('Este item não possui uma fonte reproduzível.');return}activeItem=it;detailDialog.close();$('#playerCaption').textContent=it.title;video.src=src;playerDialog.showModal();video.onloadedmetadata=()=>{if(it.position>5&&it.duration&&it.position<it.duration-10)video.currentTime=it.position};video.play().catch(()=>notify('Toque em reproduzir no player para iniciar.'));it.lastPlayed=Date.now();saveMeta();render();video.ontimeupdate=()=>{if(video.duration&&Number.isFinite(video.duration)){it.position=video.currentTime;it.duration=video.duration;saveMeta()}};video.onended=()=>{it.position=0;saveMeta();if(src.startsWith('blob:'))URL.revokeObjectURL(src)}}
function addMeta(data){items.unshift({id:crypto.randomUUID(),favorite:false,created:Date.now(),...data});saveMeta();render()}
$('#addOpen').onclick=$('#heroAdd').onclick=$('#emptyAdd').onclick=()=>addDialog.showModal();
$$('.tab').forEach(b=>b.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===b));$$('.pane').forEach(x=>x.classList.toggle('active',x.id===b.dataset.tab))});
$('#fileInput').addEventListener('change',async e=>{const files=[...e.target.files];for(const f of files){if(!f.type.startsWith('video/'))continue;const id=crypto.randomUUID();try{await putBlob(id,f);items.unshift({id,title:f.name.replace(/\.[^.]+$/,''),category:$('#itemCategory').value,decade:$('#itemDecade').value,kind:'file',favorite:false,created:Date.now(),fileName:f.name});}catch(err){notify('Não foi possível guardar o arquivo. Verifique o espaço disponível.');console.error(err)}}saveMeta();render();addDialog.close();e.target.value='';if(files.length)notify(`${files.length} arquivo(s) processado(s).`)});
$('#saveUrl').onclick=()=>{const title=$('#urlTitle').value.trim(),url=$('#urlValue').value.trim();if(!title||!url){notify('Informe o título e o endereço.');return}try{const u=new URL(url);if(u.protocol!=='https:')throw Error()}catch{notify('Informe um endereço HTTPS válido.');return}const poster=$('#urlPoster').value.trim(),description=$('#urlDescription').value.trim();if(poster){try{if(new URL(poster).protocol!=='https:')throw Error()}catch{notify('O endereço da capa precisa ser HTTPS.');return}}addMeta({title,url,poster,description,kind:'url',category:$('#itemCategory').value,decade:$('#itemDecade').value});$('#urlTitle').value=$('#urlValue').value=$('#urlPoster').value=$('#urlDescription').value='';addDialog.close();notify('Conteúdo adicionado. A reprodução depende do link e do formato.')}
$$('.chip').forEach(b=>b.onclick=()=>{$$('.chip').forEach(x=>x.classList.toggle('active',x===b));activeFilter=b.dataset.filter;render()});
$('#searchInput').addEventListener('input',render);$('#browseBtn').onclick=()=>$('#collection').scrollIntoView({behavior:'smooth'});$('#detailClose').onclick=()=>detailDialog.close();$('#playerClose').onclick=()=>{video.pause();video.removeAttribute('src');video.load();playerDialog.close()};playerDialog.addEventListener('close',()=>{video.pause();video.removeAttribute('src');video.load()});
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
load();
if(navigator.storage?.persist){navigator.storage.persist().catch(()=>{});}

// Exportação e importação de metadados do catálogo (arquivos de vídeo não são incluídos).
$('#exportBtn').onclick=()=>{
 const payload={app:'Vivendo o Passado',version:'1.4.6',exportedAt:new Date().toISOString(),items:items.map(({blob,...x})=>x)};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='vivendo-o-passado-catalogo.json';a.click();URL.revokeObjectURL(a.href);
 notify('Catálogo exportado. Os vídeos locais permanecem no dispositivo.');
};
$('#importBtn').onclick=()=>$('#importFile').click();
$('#importFile').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  const data=JSON.parse(await file.text());
  if(!Array.isArray(data.items))throw new Error('Formato inválido');
  let added=0;
  for(const raw of data.items){
   if(!raw||typeof raw.title!=='string'||!raw.title.trim())continue;
   const exists=items.some(x=>x.title===raw.title&&x.url===raw.url&&x.fileName===raw.fileName);
   if(exists)continue;
   items.push({id:crypto.randomUUID(),title:raw.title,category:raw.category||'Minha coleção',decade:raw.decade||'',kind:raw.kind==='url'?'url':'file',url:raw.kind==='url'?raw.url:undefined,fileName:raw.fileName||undefined,favorite:!!raw.favorite,created:Date.now(),description:raw.description||'',poster:raw.poster||'',position:Number(raw.position)||0,duration:Number(raw.duration)||0});
   added++;
  }
  saveMeta();render();notify(`${added} item(ns) importado(s). Arquivos de vídeo precisam ser adicionados novamente.`);
 }catch(err){notify('Não foi possível importar: arquivo JSON inválido.');}
 e.target.value='';
});

// Atalhos simples para navegação com teclado/controle remoto em navegadores de TV.
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){if(playerDialog.open){video.pause();playerDialog.close()}return}
 if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#searchInput').focus()}
});
