/* assets/js/index.js – Sol Sprint
   Optimised & modular, ready to drop in. */

/* eslint-env browser */
/* eslint-disable no-console */

if (typeof solanaWeb3 === 'undefined') {
  var solanaWeb3 = window.solanaWeb3;
}

// Your DevNet keypair bytes (pre-decoded base58). ONLY for testing on DevNet!
const secretBytes = new Uint8Array([
  45, 175, 164, 202, 59, 173, 62, 32, 76, 232, 6, 134, 87, 32, 98, 125,
  235, 124, 207, 18, 154, 143, 3, 243, 236, 222, 18, 167, 52, 7, 207, 207,
  227, 12, 49, 191, 210, 46, 170, 5, 127, 118, 202, 74, 192, 169, 82, 232,
  47, 28, 29, 214, 190, 226, 99, 185, 24, 56, 27, 253, 252, 120, 108, 228
]);



(() => {
  'use strict';

  /* ---------- tiny DOM helpers ---------- */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ---------- boot sequence ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initAudioOnFirstClick();
    initAudioOnFirstClickMobile();
    initPopup();
    initHorizontalScroll();
    initWalletConnect();
    initCopyCA();
    initNavigation();
    initCopyCAMob();
    initWalletHoverNotification();
  });

  /* =================================================
     1. Audio – un-mute bg music on first interaction
  ================================================= */
  function initAudioOnFirstClick() {
    const bg = $('#bgMusic');
    const musicToggleBtn = $('#music-bt-ctn');
    const musicIcon = $('#music-btn');

    if (!bg || !musicToggleBtn || !musicIcon) return;

    window.addEventListener(
      'click',
      () => {
        bg.muted = false;
        bg.play().catch(err => console.warn('bgMusic play error:', err));
      },
      { once: true, passive: true }
    );

    musicToggleBtn.addEventListener('click', () => {
      if (bg.paused) {
        bg.play().catch(err => console.warn('bgMusic play error:', err));
        musicIcon.src = 'assets/img/music on.png';
      } else {
        bg.pause();
        musicIcon.src = 'assets/img/music off.png';
      }
    });
  }


  function initAudioOnFirstClickMobile() {
    const bg = $('#bgMusic');

    const musicIcon = $('#music-btn-m');

    if (!bg || !musicIcon) return;

    window.addEventListener(
      'touchstart',
      () => {
        bg.muted = false;
        bg.play().catch(err => console.warn('bgMusic play error:', err));
      },
      { once: true, passive: true }
    );

    musicIcon.addEventListener('click', () => {
      if (bg.paused) {
        bg.play().catch(err => console.warn('bgMusic play error:', err));
        musicIcon.src = 'assets/img/music on m.png';
      } else {
        bg.pause();
        musicIcon.src = 'assets/img/music off m.png';
      }
    });
  }


  /* ================================================
     2. Landing popup – locks scroll & disables GSAP
  ================================================ */
  function initPopup() {
    window.addEventListener('load', () => {
      const popup = $('#popup');
      const close = $('#closePopup');
      const tone = $('#popupSound');
      if (!popup || !close) return;

      document.documentElement.style.overflow = 'hidden';

      setTimeout(() => {
        popup.classList.add('show');
        tone?.play().catch(err => console.warn('popupSound error:', err));
        window.ScrollTrigger?.getAll().forEach(t => t.disable());
      }, 500);

      close.addEventListener('click', () => {
        popup.classList.remove('show');
        document.documentElement.style.overflow = '';
        window.ScrollTrigger?.getAll().forEach(t => t.enable());
      });
    });
  }

  /* ================================================
     3. GSAP horizontal scroll (desktop)
  ================================================ */
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);
  function initHorizontalScroll() {
    try {
      const container = document.querySelector('#main');
      const sections = gsap.utils.toArray('.section');
      const scrollSpeedFactor = 30;

      if (!container || !sections.length) return;


      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => `+=${container.offsetWidth * scrollSpeedFactor}`
        }
      });
    } catch (err) {
      console.error("Error in horizontal scroll setup:", err);
    }
  }


  /* ================================================
     4. Wallet connect & DevNet airdrop
  ================================================ */
  function initWalletConnect() {
    const connectBtn = $('#connect-wallet');
    const beforeDropdown = $('#dropdown-before');
    const afterDropdown = $('#dropdown-after');
    const addrField = $('#phantom-connect');
    const walletImg = $('#wallet');
    if (!connectBtn || !beforeDropdown || !afterDropdown || !addrField) return;

    const [phantomBtn, solflareBtn, backpackBtn, metamaskBtn] = $$('#dropdown-before button');
    const disconnectBtn = $('#dropdown-after button');
    let isConnected = false;

    connectBtn.addEventListener('click', () => {
      if (isConnected) afterDropdown.style.display = afterDropdown.style.display === 'block' ? 'none' : 'block';
      else beforeDropdown.style.display = beforeDropdown.style.display === 'block' ? 'none' : 'block';
    });

    phantomBtn?.addEventListener('click', async () => {
      if (!window.solana?.isPhantom) return alert('Phantom Wallet not installed.');
      try {
        const { publicKey } = await window.solana.connect();
        onConnect(publicKey.toString(), 'Phantom');
      } catch (e) {
        console.error('Phantom connect error:', e);
      }
    });

    solflareBtn?.addEventListener('click', async () => {
      if (!window.solflare?.connect) return alert('Solflare Wallet not installed');
      try {
        const res = await window.solflare;
        await res.connect();
        const addr = res.publicKey.toString();
        onConnect(addr, 'Solflare');
      } catch (e) {
        console.error('Solflare connect error:', e);
      }
    });

    backpackBtn?.addEventListener('click', async () => {
      if (!window.backpack?.solana?.connect) return alert('Backpack Wallet not installed');
      try {
        const res = await window.backpack.solana.connect();
        const addr = res.publicKey.toString();
        onConnect(addr, 'Backpack');
      } catch (e) {
        console.error('Backpack connect error:', e);
      }
    });

    metamaskBtn?.addEventListener('click', async () => {
      if (!window.ethereum) return alert('MetaMask not installed.');
      try {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        onConnect(account, 'MetaMask');
      } catch (e) {
        console.error('MetaMask connect error:', e);
      }
    });

    disconnectBtn?.addEventListener('click', onDisconnect);

    async function onConnect(addr, provider) {
      isConnected = true;
      addrField.textContent = `${addr.slice(0, 4)}…${addr.slice(-4)}`;
      addrField.style.fontSize = '1rem';
      walletImg && (walletImg.src = 'assets/img/Profile icon.png');
      beforeDropdown.style.display = 'none';
      console.info(`Connected to ${provider}: ${addr}`);

      // DevNet airdrop 0.01 SOL
      (async () => {
        try {
          const connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');
          const fromWallet = solanaWeb3.Keypair.fromSecretKey(secretBytes);
          const toPubkey = new solanaWeb3.PublicKey(addr);
          const tx = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
              fromPubkey: fromWallet.publicKey,
              toPubkey,
              lamports: 0.001 * solanaWeb3.LAMPORTS_PER_SOL
            })
          );
          const sig = await solanaWeb3.sendAndConfirmTransaction(connection, tx, [fromWallet]);
          console.log('DevNet transfer signature:', sig);
        } catch (e) {
          console.error('DevNet transfer error:', e);
        }
      })();

    }

    function onDisconnect() {
      isConnected = false;
      addrField.textContent = ' 🪙 Connect ▾';
      addrField.style.fontSize = '';
      walletImg && (walletImg.src = 'assets/img/wallet.png');
      afterDropdown.style.display = beforeDropdown.style.display = 'none';
    }
  }

  /* ================================================
     5. Copy CA to clipboard
  ================================================ */
  function initCopyCA() {
    const copyBox = $('#copy-ca');
    const caText = $('#ca-text');
    const pop = $('#copied-popup');
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


  function initCopyCAMob() {
    const copyBox = $('#mobile-ca');
    const caText = $('#ca-text-m');
    const pop = $('#copied-popup-m');
    if (!copyBox || !caText || !pop) return;

    copyBox.addEventListener('click', () => {
      navigator.clipboard
        .writeText("test")
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
    const caBtn = $('#ca-address');
    const iframe = $('#unity-frame');
    const overlay = $('#overlay');

    const scrollTo = id => {
      const sec = $(`#${id}`);
      if (!sec) return;

      // Calculate the ScrollTrigger scroll position based on section index
      const sections = $$('.section');
      const index = [...sections].indexOf(sec);
      const y = index * window.innerWidth * 3;

      gsap.to(window, {
        scrollTo: y,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    };

    navBtns.forEach(btn =>
      btn.addEventListener('click', e => {
        e.preventDefault();
        scrollTo(btn.dataset.target);
      })
    );

    caBtn?.addEventListener('click', () => scrollTo('section-5'));

    if (iframe && overlay) {
      overlay.addEventListener('click', () => {
        iframe.classList.add('active');
        overlay.style.display = 'none';

        const bg = $('#bgMusic');
        const musicIcon = $('#music-btn');

        if (!bg.paused) {
          bg.pause();
          musicIcon.src = 'assets/img/music off.png';
        }
      });
    }
  }

  /* ================================================
     7. Wallet hover notification
  ================================================ */
  function initWalletHoverNotification() {
    const connectWallet = $('#connect-wallet');
    const walletNotification = $('#wallet-notification');

    if (!connectWallet || !walletNotification) return;

    connectWallet.addEventListener('mouseenter', () => {
      walletNotification.style.display = 'block';
    });

    connectWallet.addEventListener('mouseleave', () => {
      walletNotification.style.display = 'none';
    });
  }
})();