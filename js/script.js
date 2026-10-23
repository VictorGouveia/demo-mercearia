/* ============================================================
   CONFIGURAÇÃO — trocar antes de publicar
   ============================================================ */
const WA_CONFIG = {
  numero: "5521999999999",      // número de WhatsApp em formato internacional, só dígitos
  horaFechamento: 20             // hora (24h) usada no contador da seção final, ex.: 20 = 20h00
};

/* ----------------------------------------------------------
   Monta os links de WhatsApp com mensagem pré-preenchida
   ---------------------------------------------------------- */
document.querySelectorAll('.wa-link').forEach(link => {
  const msg = link.getAttribute('data-msg') || 'Oi! Vim pelo site do Empório Vizinho.';
  link.href = `https://wa.me/${WA_CONFIG.numero}?text=${encodeURIComponent(msg)}`;
  link.target = '_blank';
  link.rel = 'noopener';
});

/* ----------------------------------------------------------
   Navbar: encolhe ao rolar
   ---------------------------------------------------------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ----------------------------------------------------------
   Menu mobile (hambúrguer)
   ---------------------------------------------------------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ----------------------------------------------------------
   Scroll reveal via IntersectionObserver
   ---------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal, .produto-row');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ----------------------------------------------------------
   Contador regressivo até o horário de fechamento,
   persistido em localStorage para não "piscar" entre visitas
   no mesmo dia.
   ---------------------------------------------------------- */
function getFechamentoHoje() {
  const agora = new Date();
  const fechamento = new Date(agora);
  fechamento.setHours(WA_CONFIG.horaFechamento, 0, 0, 0);
  // Se já passou do horário de fechamento hoje, mira no fechamento de amanhã
  if (agora.getTime() >= fechamento.getTime()) {
    fechamento.setDate(fechamento.getDate() + 1);
  }
  return fechamento;
}

function atualizarContador() {
  const chave = 'ev_fechamento_alvo';
  let alvo = localStorage.getItem(chave);
  const agora = new Date();

  if (!alvo || new Date(parseInt(alvo, 10)).getTime() <= agora.getTime()) {
    alvo = getFechamentoHoje().getTime();
    localStorage.setItem(chave, String(alvo));
  } else {
    alvo = parseInt(alvo, 10);
  }

  const diff = Math.max(0, alvo - agora.getTime());
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const pad = n => String(n).padStart(2, '0');
  const elH = document.getElementById('cd-h');
  const elM = document.getElementById('cd-m');
  const elS = document.getElementById('cd-s');
  if (elH && elM && elS) {
    elH.textContent = pad(h);
    elM.textContent = pad(m);
    elS.textContent = pad(s);
  }

  if (diff <= 0) {
    localStorage.removeItem(chave);
  }
}
atualizarContador();
setInterval(atualizarContador, 1000);
