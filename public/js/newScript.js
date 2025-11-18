(function () {
  const $ = (s, r=document) => r.querySelector(s);
  const listing = document.getElementById("listing") || $(".bz_listing");
  const btnGrid  = document.getElementById("viewGrid") || $('[data-view="grid"]');
  const btnList  = document.getElementById("viewList") || $('[data-view="list"]');

  if (!listing || !btnGrid || !btnList) return;

  const STORE_KEY = "bz:view";

  // Restore the saved view mode or default to 'list'
  const saved = localStorage.getItem(STORE_KEY) || "list";
  applyView(saved, false);

  // Handle button clicks
  btnGrid.addEventListener("click", () => applyView("grid"));
  btnList.addEventListener("click", () => applyView("list"));

  // Keyboard accessibility
  [btnGrid, btnList].forEach(btn => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const mode = btn === btnGrid ? "grid" : "list";
        applyView(mode);
      }
    });
  });

  // Core view toggle function
  function applyView(mode, save = true) {
    const isGrid = mode === "grid";

    // Apply class toggles
    listing.classList.toggle("grid", isGrid);
    listing.classList.toggle("list", !isGrid);

    // Button active state
    btnGrid.classList.toggle("active", isGrid);
    btnList.classList.toggle("active", !isGrid);

    // Accessibility attributes
    btnGrid.setAttribute("aria-pressed", String(isGrid));
    btnList.setAttribute("aria-pressed", String(!isGrid));

    // Persist view choice
    if (save) localStorage.setItem(STORE_KEY, mode);
  }

  // Reapply view mode on screen resize (handles mobile orientation changes)
  window.addEventListener("resize", () => {
    const current = localStorage.getItem(STORE_KEY) || "list";
    applyView(current, false);
  });
})();




// Product slider JS
(function(){
  const viewport = document.getElementById('miniViewport');
  const track    = document.getElementById('miniTrack');
  const prev     = document.getElementById('prevBtn');
  const next     = document.getElementById('nextBtn');
  if(!viewport || !track || !prev || !next) return;

  const GAP = 12;
  const firstCard = track.querySelector('.bznew_list_slider-card');
  const step = () => (firstCard ? firstCard.getBoundingClientRect().width : 280) + GAP;

  function updateArrows(){
    const max = viewport.scrollWidth - viewport.clientWidth;
    const atStart = viewport.scrollLeft <= 2;
    const atEnd   = viewport.scrollLeft >= max - 2;
    prev.classList.toggle('hidden', atStart);
    next.classList.toggle('hidden', atEnd);
  }
  function smoothBy(px){
    try{ viewport.scrollBy({left:px, behavior:'smooth'}); }
    catch{ viewport.scrollLeft += px; }
    setTimeout(updateArrows, 240);
  }

  prev.classList.add('hidden');
  next.classList.remove('hidden');
  next.addEventListener('click', () => smoothBy(+step()));
  prev.addEventListener('click', () => smoothBy(-step()));

  // drag / swipe + snap
  let down=false,startX=0,startLeft=0;
  const onDown=e=>{down=true; startX=(e.pageX||e.touches[0].pageX); startLeft=viewport.scrollLeft;};
  const onMove=e=>{if(!down)return; e.preventDefault(); const x=(e.pageX||e.touches[0].pageX); viewport.scrollLeft=startLeft-(x-startX);};
  const onUp=()=>{if(!down)return; down=false; const s=step(); const i=Math.round(viewport.scrollLeft/s); viewport.scrollLeft=i*s; updateArrows();};
  viewport.addEventListener('mousedown', onDown); document.addEventListener('mouseup', onUp); viewport.addEventListener('mousemove', onMove);
  viewport.addEventListener('touchstart', onDown, {passive:true}); viewport.addEventListener('touchmove', onMove, {passive:false}); viewport.addEventListener('touchend', onUp);

  updateArrows();
  window.addEventListener('resize', updateArrows);
})();

// Mobile categories dropdown JS
(function(){
  const btn   = document.getElementById('bz_cat_btn');
  const menu  = document.getElementById('bz_cat_menu');
  if (!btn || !menu) return;

  // start hidden
  menu.classList.add('hidden');
  btn.setAttribute('aria-expanded', 'false');

  const open  = () => { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
  const close = () => { menu.classList.add('hidden');  btn.setAttribute('aria-expanded','false'); };

  // toggle panel
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    menu.classList.contains('hidden') ? open() : close();
  });

  // click outside -> close
  document.addEventListener('click', (e)=>{
    if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close();
  });

  // click on any category item -> close + scroll to top
  menu.addEventListener('click', (e)=>{
    const link = e.target.closest('.bznew_list_catItem');
    if (!link) return;

    // prevent navigation for now (you can route in React)
    e.preventDefault();

    // close the dropdown
    close();

    // smoothly go to top so the new content (or React route) starts from the top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // optional: dispatch an event you can catch in React to navigate
    // window.dispatchEvent(new CustomEvent('bz:cat-select', { detail: link.textContent.trim() }));
  });
})();


// City chip one-line slider
(function(){
  const viewport = document.getElementById('cityViewport');
  const track    = document.getElementById('cityTrack');
  const prev     = document.getElementById('cityPrev');
  const next     = document.getElementById('cityNext');
  if(!viewport || !track || !prev || !next) return;

  const GAP = 8;
  const firstChip = track.querySelector('.bznew_list_citychip');
  const step = ()=> (firstChip ? firstChip.getBoundingClientRect().width : 120) + GAP;

  function updateArrows(){
    const max = viewport.scrollWidth - viewport.clientWidth;
    const atStart = viewport.scrollLeft <= 2;
    const atEnd   = viewport.scrollLeft >= max - 2;
    prev.classList.toggle('hidden', atStart);
    next.classList.toggle('hidden', atEnd);
  }
  function smoothBy(px){
    try{ viewport.scrollBy({ left:px, behavior:'smooth' }); }
    catch{ viewport.scrollLeft += px; }
    setTimeout(updateArrows, 200);
  }

  next.addEventListener('click', ()=> smoothBy(+step()));
  prev.addEventListener('click', ()=> smoothBy(-step()));

  // drag/swipe with snap
  let down=false, startX=0, startLeft=0;
  const onDown = e=>{ down=true; startX=(e.pageX||e.touches[0].pageX); startLeft=viewport.scrollLeft; };
  const onMove = e=>{ if(!down) return; e.preventDefault(); const x=(e.pageX||e.touches[0].pageX); viewport.scrollLeft = startLeft - (x-startX); };
  const onUp   = ()=>{ if(!down) return; down=false; const s=step(); const i=Math.round(viewport.scrollLeft/s); viewport.scrollLeft=i*s; updateArrows(); };

  viewport.addEventListener('mousedown', onDown); document.addEventListener('mouseup', onUp); viewport.addEventListener('mousemove', onMove);
  viewport.addEventListener('touchstart', onDown, {passive:true}); viewport.addEventListener('touchmove', onMove, {passive:false}); viewport.addEventListener('touchend', onUp);

  // init
  updateArrows(); window.addEventListener('resize', updateArrows);
})();


// Add this JS block near your other scripts
(function(){
  const listing   = document.getElementById('listing');
  const btnGrid   = document.getElementById('viewGrid');
  const btnList   = document.getElementById('viewList');

  if(!listing || !btnGrid || !btnList) return;

  // restore last view
  const saved = localStorage.getItem('bz:view') || 'list';
  applyView(saved);

  btnGrid.addEventListener('click', ()=> applyView('grid'));
  btnList.addEventListener('click', ()=> applyView('list'));

  function applyView(mode){
    listing.classList.toggle('grid', mode==='grid');
    listing.classList.toggle('list', mode!=='grid');

    btnGrid.classList.toggle('active', mode==='grid');
    btnList.classList.toggle('active', mode!=='grid');

    btnGrid.setAttribute('aria-pressed', mode==='grid');
    btnList.setAttribute('aria-pressed', mode!=='grid');

    localStorage.setItem('bz:view', mode);
  }
})();


// Add this JS block near your other scripts
(function(){
  const listing   = document.getElementById('listing');
  const btnGrid   = document.getElementById('viewGrid');
  const btnList   = document.getElementById('viewList');

  if(!listing || !btnGrid || !btnList) return;

  // restore last view
  const saved = localStorage.getItem('bz:view') || 'list';
  applyView(saved);

  btnGrid.addEventListener('click', ()=> applyView('grid'));
  btnList.addEventListener('click', ()=> applyView('list'));

  function applyView(mode){
    listing.classList.toggle('grid', mode==='grid');
    listing.classList.toggle('list', mode!=='grid');

    btnGrid.classList.toggle('active', mode==='grid');
    btnList.classList.toggle('active', mode!=='grid');

    btnGrid.setAttribute('aria-pressed', mode==='grid');
    btnList.setAttribute('aria-pressed', mode!=='grid');

    localStorage.setItem('bz:view', mode);
  }
})();



// (function(){
//   // Example dataset: add/replace with your actual list
//   const CITY_DATA = [
//     "Agra, Uttar Pradesh","Ahmedabad, Gujarat","Ajmer, Rajasthan","Alappuzha, Kerala",
//     "All India","Amritsar, Punjab","Aurangabad, Maharashtra","Bengaluru, Karnataka",
//     "Bhopal, Madhya Pradesh","Bhubaneswar, Odisha","Chandigarh","Chennai, Tamil Nadu",
//     "Coimbatore, Tamil Nadu","Cuttack, Odisha","Dehradun, Uttarakhand","Delhi",
//     "Depalpur, Madhya Pradesh","Dhanbad, Jharkhand","Faridabad, Haryana",
//     "Faridkot, Punjab","Farrukhabad, Uttar Pradesh","Fatehabad, Haryana",
//     "Fatehpur, Rajasthan","Ferozepur, Punjab","Firozabad, Uttar Pradesh","Feroke, Kerala",
//     "Gandhinagar, Gujarat","Ghaziabad, Uttar Pradesh","Gurugram, Haryana",
//     "Guwahati, Assam","Gwalior, Madhya Pradesh","Hyderabad, Telangana","Indore, Madhya Pradesh",
//     "Jaipur, Rajasthan","Jodhpur, Rajasthan","Kanpur, Uttar Pradesh",
//     "Kochi, Kerala","Kolkata, West Bengal","Kozhikode, Kerala",
//     "Lucknow, Uttar Pradesh","Madurai, Tamil Nadu","Mumbai, Maharashtra",
//     "Mysuru, Karnataka","Nagpur, Maharashtra","Noida, Uttar Pradesh",
//     "Patna, Bihar","Pune, Maharashtra","Raipur, Chhattisgarh",
//     "Rajkot, Gujarat","Ranchi, Jharkhand","Sonipat, Haryana","Surat, Gujarat",
//     "Thiruvananthapuram, Kerala","Vadodara, Gujarat","Varanasi, Uttar Pradesh"
//   ];

//   const input   = document.getElementById('cityInput');
//   const panel   = document.getElementById('citySuggest');
//   let activeIdx = -1;  // keyboard highlight index

//   function render(list){
//     if(!list.length){ panel.classList.remove('show'); panel.innerHTML=''; return; }
//     const items = list.slice(0,10).map((name,i)=>{
//       // split "City, State" into parts for nicer look
//       const [city, state=''] = name.split(/\s*,\s*/);
//       return `<li role="option" data-value="${name.replace(/"/g,'&quot;')}"
//                   class="${i===activeIdx?'active':''}">
//                 <strong>${city}</strong>${state?`, <span class="dim">${state}</span>`:''}
//               </li>`;
//     }).join('');
//     panel.innerHTML = `<ul>${items}</ul>`;
//     panel.classList.add('show');
//   }

//   function filter(q){
//     if(!q){ activeIdx=-1; render([]); return; }
//     q = q.trim().toLowerCase();
//     const matches = CITY_DATA.filter(n => n.toLowerCase().startsWith(q));
//     activeIdx = -1;
//     render(matches);
//   }

//   input.addEventListener('input', e => filter(e.target.value));

//   // Keyboard navigation
//   input.addEventListener('keydown', e=>{
//     const items = [...panel.querySelectorAll('li')];
//     if(!panel.classList.contains('show') || !items.length) return;

//     if(e.key==='ArrowDown'){ e.preventDefault(); activeIdx = (activeIdx+1) % items.length; items.forEach(li=>li.classList.remove('active')); items[activeIdx].classList.add('active'); }
//     else if(e.key==='ArrowUp'){ e.preventDefault(); activeIdx = (activeIdx-1+items.length) % items.length; items.forEach(li=>li.classList.remove('active')); items[activeIdx].classList.add('active'); }
//     else if(e.key==='Enter'){ e.preventDefault(); if(activeIdx>=0){ choose(items[activeIdx].dataset.value); } }
//     else if(e.key==='Escape'){ panel.classList.remove('show'); }
//   });

//   // Click selection
//   panel.addEventListener('click', e=>{
//     const li = e.target.closest('li[data-value]');
//     if(li) choose(li.dataset.value);
//   });

//   function choose(value){
//     input.value = value;
//     panel.classList.remove('show');
//     panel.innerHTML = '';
//     input.dispatchEvent(new Event('change')); // optional hook
//   }

//   // Close when clicking outside
//   document.addEventListener('click', e=>{
//     if(!panel.contains(e.target) && e.target !== input){
//       panel.classList.remove('show');
//     }
//   });
// })();