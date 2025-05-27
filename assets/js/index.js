/* assets/js/index.js – Sol Sprint
   Optimised & modular, ready to drop in. */

/* eslint-env browser */
/* eslint-disable no-console */

(() => {
  'use strict';

  /* ---------- tiny DOM helpers ---------- */
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ---------- boot sequence ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initAudioOnFirstClick();
    initPopup();
    initHorizontalScroll();
    initWalletConnect();
    initCopyCA();
    initNavigation();
  });

  /* =================================================
     1. Audio – un-mute bg music on first interaction
  ================================================= */
  function initAudioOnFirstClick() {
    const bg = $('#bgMusic');
    if (!bg) return;
    window.addEventListener(
      'click',
      () => {
        bg.muted = false;
        bg.play().catch(err => console.warn('bgMusic play error:', err));
      },
      { once: true, passive: true }
    );
  }

  /* ================================================
     2. Landing popup – locks scroll & disables GSAP
  ================================================ */
  function initPopup() {
    window.addEventListener('load', () => {
      const popup = $('#popup');
      const close = $('#closePopup');
      const tone  = $('#popupSound');
      if (!popup || !close) return;

      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        popup.classList.add('show');
        tone?.play().catch(err => console.warn('popupSound error:', err));
        window.ScrollTrigger?.getAll().forEach(t => t.disable());
      }, 500);

      close.addEventListener('click', () => {
        popup.classList.remove('show');
        document.body.style.overflow = '';
        window.ScrollTrigger?.getAll().forEach(t => t.enable());
      });
    });
  }

  /* ================================================
     3. GSAP horizontal scroll (desktop)
  ================================================ */
  function initHorizontalScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const container = $('#main');
    const sections  = $$('.content');
    if (!container || !sections.length) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 0.8,
        end: () => `+=${container.offsetWidth * 15}`,
        invalidateOnRefresh: true
      }
    });
  }

  /* ================================================
     4. Wallet connect dropdown logic
  ================================================ */
  function initWalletConnect() {
    const connectBtn     = $('#connect-wallet');
    const dropdownBefore = $('#dropdown-before');
    const dropdownAfter  = $('#dropdown-after');
    const addrField      = $('#phantom-connect');
    const walletImg      = $('#wallet');

    if (!connectBtn || !dropdownBefore || !dropdownAfter || !addrField) return;

    const [phantomBtn, solflareBtn, solletBtn, metamaskBtn] = $$('#dropdown-before button');
    const disconnectBtn = $('#dropdown-after button');

    let isConnected = false;

    connectBtn.addEventListener('click', () => {
      if (isConnected) {
        dropdownAfter.style.display  = dropdownAfter.style.display === 'block' ? 'none' : 'block';
      } else {
        dropdownBefore.style.display = dropdownBefore.style.display === 'block' ? 'none' : 'block';
      }
    });

    phantomBtn?.addEventListener('click', async () => {
      if (!window.solana?.isPhantom) return alert('Phantom Wallet not installed.');
      try {
        const { publicKey } = await window.solana.connect();
        onConnect(publicKey.toString(), 'Phantom');
      } catch (err) {
        console.error('Phantom connect error:', err);
      }
    });

    solflareBtn?.addEventListener('click', () => alert('Solflare connection not implemented.'));
    solletBtn?.addEventListener('click',   () => alert('Sollet connection not implemented.'));

    metamaskBtn?.addEventListener('click', async () => {
      if (!window.ethereum) return alert('MetaMask not installed.');
      try {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        onConnect(account, 'MetaMask');
      } catch (err) {
        console.error('MetaMask connect error:', err);
      }
    });

    disconnectBtn?.addEventListener('click', onDisconnect);

    function onConnect(addr, provider) {
      isConnected = true;
      addrField.textContent     = `${addr.slice(0,4)}…${addr.slice(-4)}`;
      addrField.style.fontSize  = '1rem';
      walletImg && (walletImg.src = 'assets/img/Profile icon.png');
      dropdownBefore.style.display = 'none';
      // dropdownAfter.style.display  = 'block';
      console.info(`Connected to ${provider}: ${addr}`);
    }

    function onDisconnect() {
      isConnected = false;
      addrField.textContent    = ' 🪙 Connect Wallet ▾';
      addrField.style.fontSize = '';
      walletImg && (walletImg.src = 'assets/img/wallet.png');
      dropdownAfter.style.display = dropdownBefore.style.display = 'none';
    }
  }

  /* ================================================
     5. Copy CA to clipboard
  ================================================ */
  function initCopyCA() {
    const copyBox = $('#copy-ca');
    const caText  = $('#ca-text');
    const pop     = $('#copied-popup');
    if (!copyBox || !caText || !pop) return;

    copyBox.addEventListener('click', () => {
      navigator.clipboard
        .writeText(caText.textContent.trim())
        .then(() => {
          pop.style.opacity = '1';
          setTimeout(() => (pop.style.opacity = '0'), 1500);
        })
        .catch(err => {
          console.error('Clipboard copy failed:', err);
          alert('Copy failed – please try again.');
        });
    });
  }

  /* ================================================
     6. Navigation & horizontal scroll helpers
  ================================================ */
  function initNavigation() {
    const container = $('#main');
    if (!container) return;

    const navBtns = $$('.nav-btn');
    const caBtn   = $('#ca-address');
    const iframe  = $('#unity-frame');
    const overlay = $('#overlay');

    const maxLeft = () => container.scrollWidth - container.clientWidth;

    const scrollTo = id => {
      const sec = $(`#${id}`);
      if (!sec) return;
      container.scrollTo({
        left: Math.min(sec.offsetLeft, maxLeft()),
        behavior: 'smooth'
      });
    };

    navBtns.forEach(btn =>
      btn.addEventListener('click', e => {
        e.preventDefault();
        scrollTo(btn.dataset.target);
      })
    );

    caBtn?.addEventListener('click', () => scrollTo('section-5'));

    container.addEventListener(
      'wheel',
      e => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      },
      { passive: false }
    );

    if (iframe && overlay) {
      overlay.addEventListener('click', () => {
        iframe.classList.add('active');
        overlay.style.display = 'none';
      });
    }
  }
})();