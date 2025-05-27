// ------------------------------------
// Music Playback on First Click
// ------------------------------------
window.addEventListener('click', () => {
  try {
    const music = document.getElementById('bgMusic');
    if (music) {
      music.muted = false;
      music.play().catch(err => console.warn("bgMusic play error:", err));
    }
  } catch (err) {
    console.error("Error in bgMusic setup:", err);
  }
});

// ------------------------------------
// Delayed Popup, Scroll Lock, and Popup Sound
// ------------------------------------
(function setupPopup() {
  window.addEventListener('load', () => {
    const popupEl  = document.getElementById('popup');
    const closeBtn = document.getElementById('closePopup');

    // 1) Lock native scrolling immediately
    document.body.style.overflow = 'hidden';

    // 2) After 1s, show the popup + play its sound + disable GSAP ScrollTriggers
    setTimeout(() => {
      try {
        popupEl?.classList.add('show');
        document.getElementById('popupSound')?.play().catch(err => console.warn("popupSound play error:", err));
        if (window.ScrollTrigger) {
          ScrollTrigger.getAll().forEach(t => t.disable());
        }
      } catch (err) {
        console.error("Error showing popup:", err);
      }
    }, 500);

    // 3) On “GOT IT!”, hide the popup, re-enable native scrolling & GSAP
    closeBtn?.addEventListener('click', () => {
      try {
        popupEl?.classList.remove('show');
        document.body.style.overflow = '';
        if (window.ScrollTrigger) {
          ScrollTrigger.getAll().forEach(t => t.enable());
        }
      } catch (err) {
        console.error("Error closing popup:", err);
      }
    });
  });
})();

// -------------------------------------------
// GSAP Horizontal Scroll Setup
// -------------------------------------------
gsap.registerPlugin(ScrollTrigger);
(function setupHorizontalScroll() {
  try {
    const container = document.querySelector('#main');
    const sections  = gsap.utils.toArray('.content');
    const speed     = 15;

    if (!container || !sections.length) return;

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin:     true,
        scrub:   0.8,
        end:     () => `+=${container.offsetWidth * speed}`,
        invalidateOnRefresh: true,
      }
    });
  } catch (err) {
    console.error("Error in horizontal scroll setup:", err);
  }
})();


// -------------------------------------------
// Wallet Connect Handler (Full Code)
// -------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const connectButton    = document.getElementById('connect-wallet');
  const walletImage      = document.getElementById('wallet');
  const walletAddress    = document.getElementById('phantom-connect');
  const dropdownBefore   = document.getElementById('dropdown-before');
  const dropdownAfter    = document.getElementById('dropdown-after');

  const phantomBtn       = dropdownBefore.querySelectorAll('button')[0];
  const solflareBtn      = dropdownBefore.querySelectorAll('button')[1];
  const solletBtn        = dropdownBefore.querySelectorAll('button')[2];
  const metamaskBtn      = dropdownBefore.querySelectorAll('button')[3];


  const disconnectBtn    = dropdownAfter.querySelectorAll('button')[0];

  let isConnected        = false;
  let currentWallet      = null;
  let currentPublicKey   = null;

  // Toggle dropdownBefore on click
  connectButton?.addEventListener('click', () => {
    if (!isConnected) {
      const isVisible = dropdownBefore.style.display === 'block';
      dropdownBefore.style.display = isVisible ? 'none' : 'block';
    }
    else {
      dropdownAfter.style.display = dropdownAfter.style.display === 'block' ? 'none' : 'block';
    }
  });

  async function connectPhantom() {
    try {
      if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect();
        updateUIOnConnect(resp.publicKey, 'Phantom');
      } else {
        alert('Phantom Wallet not installed.');
      }
    } catch (err) {
      console.error('Phantom connection failed:', err);
    }
  }

  async function connectSolflare() {
    alert('Solflare connection not implemented.');
  }

  async function connectSollet() {
    alert('Sollet connection not implemented.');
  }

  async function connectMetamask() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        updateUIOnConnect(accounts[0], 'MetaMask');
      } else {
        alert('MetaMask not installed.');
      }
    } catch (err) {
      console.error('MetaMask connection failed:', err);
    }
  }

  function updateUIOnConnect(publicKey, walletName) {
    currentWallet = walletName;
    currentPublicKey = publicKey;
    if (walletImage) {
      walletImage.src = 'assets/img/Profile icon.png';
      walletImage.alt = 'Connected Wallet';
    }

    walletAddress.textContent = publicKey.toString().slice(0, 4) + '...' + publicKey.toString().slice(-4);
    walletAddress.style.fontSize = '1rem';

    isConnected = true;
    dropdownBefore.style.display = 'none';
    // dropdownAfter.style.display = 'block';
  }

  function updateUIOnDisconnect() {
    if (walletImage) {
      walletImage.src = 'assets/img/wallet.png';
      walletImage.alt = 'Phantom Logo';
    }

    walletAddress.textContent = ' 🪙  Connect Wallet ▾';
    walletAddress.style.fontSize = '';

    isConnected = false;
    currentPublicKey = null;
    currentWallet = null;
    dropdownBefore.style.display = 'none';
    dropdownAfter.style.display = 'none';
  }

  phantomBtn.addEventListener('click', connectPhantom);
  solflareBtn.addEventListener('click', connectSolflare);
  solletBtn.addEventListener('click', connectSollet);
  metamaskBtn.addEventListener('click', connectMetamask);

  disconnectBtn.addEventListener('click', updateUIOnDisconnect);
  switchBtn.addEventListener('click', () => {
    updateUIOnDisconnect();
    dropdownBefore.style.display = 'block';
  });
});


    



    




  //   connectButton?.addEventListener('click', async e => {
  //     e.preventDefault();
  //     try {
  //       if (isConnected) {
  //         await window.solana.disconnect();
  //         updateUIOnDisconnect();
  //         console.log("Disconnected wallet.");
  //         return;
  //       }
  //       if (window.solana?.isPhantom) {
  //         const { publicKey } = await window.solana.connect();
  //         console.log("Connected wallet address:", publicKey.toString());
  //         updateUIOnConnect(publicKey);
  //       } else {
  //         alert("Phantom Wallet not found. Please install it: https://phantom.app");
  //       }
  //     } catch (err) {
  //       console.error("Wallet connection failed:", err.message);
  //       alert("Connection failed or rejected.");
  //     }
  //   });
  // } catch (err) {
  //   console.error("Error in wallet setup:", err);
  // }
// })();

// -------------------------------------------
// Tokenomics CA ID copier
// -------------------------------------------

document.getElementById('copy-ca').addEventListener('click', function () {
  const textToCopy = document.getElementById('ca-text').textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    // Show popup
    const popup = document.getElementById('copied-popup');
    popup.style.opacity = '1';

    setTimeout(() => {
      popup.style.opacity = '0';
    }, 1500);
  }).catch(err => {
    console.error('Copy failed', err);
  });
});
