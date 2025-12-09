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
    // e.preventDefault();

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

// Product Detail Start
/* ======= Simple helpers ======= */
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const toast = (msg='Done')=>{
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 1600);
}

/* ======= Gallery switching ======= */
if ($('#thumbRow')) {
  $('#thumbRow').addEventListener('click', (e)=>{
    const img = e.target.closest('img'); if(!img) return;
    $('#mainImg').src = img.dataset.large;
    $$('.thumb').forEach(x=>x.classList.remove('active'));
    e.target.closest('.thumb').classList.add('active');
  });
}

/* ======= Variant pricing ======= */
const base = { // MRP & offer by size (₹)
  250:{mrp:160, offer:120, stock:true},
  500:{mrp:300, offer:215, stock:true},
  1000:{mrp:560, offer:399, stock:true}
};
let selectedSize = 250;
const updatePrice = ()=>{
  const {mrp, offer, stock} = base[selectedSize];
  $('#offerPrice').textContent = '₹'+offer;
  $('#mrpPrice').textContent = '₹'+mrp;
  const pct = Math.round((1 - offer/mrp)*100);
  $('#savePct').textContent = `Save ${pct}%`;
  const st = $('#stockText');
  st.textContent = stock ? 'In stock' : 'Out of stock';
  st.previousElementSibling.className = 'dot ' + (stock?'ok':'no');
  $('#addCart').disabled = !stock;
  $('#buyNow').disabled = !stock;
};
if ($('#sizes')) {
  $('#sizes').addEventListener('click', e=>{
    const sw = e.target.closest('.swatch'); if(!sw) return;
    selectedSize = Number(sw.dataset.size);
    $$('#sizes .swatch').forEach(x=>x.classList.remove('active'));
    sw.classList.add('active');
    updatePrice();
  });
  updatePrice();
}

/* color pick just visual */
if ($('#colors')) {
  $('#colors').addEventListener('click', e=>{
    const sw = e.target.closest('.swatch'); if(!sw) return;
    $$('#colors .swatch').forEach(x=>x.classList.remove('active'));
    sw.classList.add('active');
  });

}

/* ======= Qty stepper ======= */
const qty = $('#qty');
const clamp = v => Math.max(1, Math.min(99, v|0));
if ($('#inc')) {
  $('#inc').onclick=()=>{qty.value = clamp(+qty.value+1)}
}
if ($('#dec')) {
  $('#dec').onclick=()=>{qty.value = clamp(+qty.value-1)}
}
if (qty) {
  qty.oninput=()=>{qty.value = qty.value.replace(/[^0-9]/g,'')}
}

/* ======= Pincode check (mock) ======= */
if ($('#checkPin')) {
  $('#checkPin').onclick=()=>{
    const p = $('#pincode').value.trim();
    if(!/^\d{6}$/.test(p)) { $('#pinMsg').textContent='Enter a valid 6-digit pincode'; return; }
    const eta = ['2-3 days','3-5 days','5-7 days'][Math.floor((+p)%3)];
    $('#pinMsg').textContent = `Delivery to ${p}: ETA ${eta}`;
  }
}

/* ======= Tabs ======= */
$$('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    $$('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['desc','spec','rev','faq'].forEach(id=>{
      $('#tab-'+id).hidden = id !== btn.dataset.tab;
    });
  });
});

/* ======= Wishlist/Cart buttons ======= */
const addToCart = src => toast(src?`Added ${qty.value} item(s) from ${src}`:'Added to cart');
if ($('#addCart')) {
  $('#addCart').onclick=()=>addToCart('detail');
}

if ($('#stickyAdd')) {
  $('#stickyAdd').onclick=()=>addToCart('sticky');
}

if ($('#buyNow')) {
  $('#buyNow').onclick=()=>toast('Proceeding to checkout…');
}

if ($('#stickyBuy')) {
  $('#stickyBuy').onclick=()=>toast('Proceeding to checkout…');
}

if ($('#wishBtn')) {
  $('#wishBtn').onclick=()=>toast('Saved to wishlist');
}

if ($('#stickyWish')) {
  $('#stickyWish').onclick=()=>toast('Saved to wishlist');
}

/* ======= Copy link ======= */
if ($('#copyLink')) {
  $('#copyLink').onclick=async ()=>{
    try{ await navigator.clipboard.writeText(location.href); toast('Link copied'); }
    catch{ toast('Copy failed'); }
  };
}

// Product Detail End



// Customer Login Page Start

(function(){
  const KEY = 'cart:count';
  const badge = document.getElementById('menuCartCount');
  if(!badge) return;

  function setCount(n){
    const c = Math.max(0, Number(n||0));
    badge.textContent = c > 99 ? '99+' : String(c);
    badge.style.display = c > 0 ? 'inline-block' : 'none';
    try{ localStorage.setItem(KEY, String(c)); }catch(e){}
  }

  // init from storage
  let initial = 0;
  try{ initial = Number(localStorage.getItem(KEY) || 0); }catch(e){}
  setCount(initial);

  // expose helper so you can update from anywhere
  window.updateHeaderCartCount = function(n){ setCount(n); };

  // if other scripts dispatch this event, we’ll react
  window.addEventListener('cart:changed', (e)=>{
    const count = e.detail && typeof e.detail.count !== 'undefined' ? e.detail.count : initial;
    setCount(count);
  });
})();



/* ====== Minimal, demo-only logic (scoped to #bzAuth) ====== */
(function(){
  const root = document.getElementById('bzAuth');
  if(!root) return;

  const emailStep = root.querySelector('.step-email');
  const otpStep   = root.querySelector('.step-otp');
  const emailInp  = root.querySelector('#authEmail');
  const btnGetOtp = root.querySelector('#btnGetOtp');
  const btnBack   = root.querySelector('#btnBack');
  const btnResend = root.querySelector('#btnResend');
  const timerSpan = root.querySelector('#resendTimer');
  const otpEcho   = root.querySelector('#otpEmailEcho');
  const otpCells  = [...root.querySelectorAll('.otp-cell')];
  const otpForm   = root.querySelector('#otpForm');
  const msgOk     = root.querySelector('#otpDemoMsg');
  const msgErr    = root.querySelector('#otpErr');
  const btnGoogle = root.querySelector('#btnGoogle');
  const btnFacebook = root.querySelector('#btnFacebook');

  let demoOTP = "";      // generated 6-digit (demo)
  let timer = 0, tId;

  function startResend(seconds=60){
    btnResend.disabled = true;
    timer = seconds;
    timerSpan.textContent = timer;
    clearInterval(tId);
    tId = setInterval(()=>{
      timer--; timerSpan.textContent = timer;
      if(timer<=0){
        clearInterval(tId);
        btnResend.disabled = false;
        btnResend.textContent = 'Resend code';
      } else {
        btnResend.disabled = true;
        btnResend.innerHTML = `Resend code in <span id="resendTimer">${timer}</span>s`;
      }
    },1000);
  }


  // function generateDemoOtp(){
  //   demoOTP = String(Math.floor(100000 + Math.random() * 900000));
  //   msgOk.hidden = false;
  //   msgOk.textContent = `Demo OTP (for testing): ${demoOTP}`;
  // }

  function switchToOtp(){
    otpEcho.textContent = emailInp.value.trim();
    emailStep.hidden = true;
    otpStep.hidden = false;
    // generateDemoOtp();
    startResend(60);
    otpCells[0].focus();
  }

  function switchToEmail(){
    emailStep.hidden = false;
    otpStep.hidden = true;
    // msgOk.hidden = true;
    // msgErr.hidden = true;
    otpCells.forEach(c=>c.value="");
    clearInterval(tId);
  }

  // Email → Get OTP
  btnGetOtp.addEventListener('click', ()=>{
    if(!emailInp.checkValidity()){
      emailInp.reportValidity();
      return;
    }
    switchToOtp();
  });

  // Back to edit email
  btnBack.addEventListener('click', switchToEmail);

  // Resend
  btnResend.addEventListener('click', ()=>{
    if(btnResend.disabled) return;
    // generateDemoOtp();
    startResend(60);
    otpCells.forEach(c=>c.value="");
    otpCells[0].focus();
  });

  // OTP input behavior
  otpCells.forEach((cell, idx)=>{
    cell.addEventListener('input', ()=>{
      cell.value = cell.value.replace(/\D/g,'').slice(0,1);
      // msgErr.hidden = true;
      if(cell.value && idx < otpCells.length-1) otpCells[idx+1].focus();
    });
    cell.addEventListener('keydown', (e)=>{
      if(e.key === 'Backspace' && !cell.value && idx>0){ otpCells[idx-1].focus(); }
    });
  });

  // Verify (demo)
  // otpForm.addEventListener('submit', (e)=>{
  //   e.preventDefault();
  //   const userCode = otpCells.map(c=>c.value).join('');
  //   if(userCode.length === 6 && userCode === demoOTP){
  //     msgErr.hidden = true;
  //     msgOk.hidden = false;
  //     msgOk.textContent = 'Success! You are signed in (demo).';
  //     // TODO: Replace this with your real POST /verify-otp handler
  //   }else{
  //     msgErr.hidden = false;
  //   }
  // });

  // Social stubs (wire to your OAuth endpoints)
  btnGoogle.addEventListener('click', ()=> {
    // location.href = '/auth/google';  // Example
    alert('Google Sign-In: wire this button to your OAuth endpoint.');
  });
  btnFacebook.addEventListener('click', ()=> {
    // location.href = '/auth/facebook'; // Example
    alert('Facebook Sign-In: wire this button to your OAuth endpoint.');
  });
})();
// Customer Login Page End