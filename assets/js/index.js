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
// Phantom Wallet Connect Handler
// -------------------------------------------
(function setupWalletConnection() {
  try {
    const connectButton = document.getElementById('connect-wallet');
    const walletImage   = document.getElementById('wallet');
    const walletAddress = document.getElementById('phantom-connect');
    const phantomName   = document.getElementById('phantom-name');
    const dropdownBefore = document.getElementById('dropdown-before');
    const dropdownAfter = document.getElementById('dropdown-after');

    let isConnected      = false;
    let currentPublicKey = null;

    function updateUIOnConnect(publicKey) {
      try {
        currentPublicKey = publicKey;
        walletImage.src  = "assets/img/Profile icon.png";
        walletImage.alt  = "Connected Wallet";
        walletAddress.textContent =
          publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4);
        walletAddress.style.fontSize = "1rem";
        phantomName.textContent = "";
        isConnected = true;
        dropdownBefore.style.display = "none";
        dropdownAfter.style.display = "block";
      } catch (err) {
        console.error("Error updating UI on connect:", err);
      }
    }

    function updateUIOnDisconnect() {
      try {
        walletImage.src  = "assets/img/wallet.png";
        walletImage.alt  = "Phantom Logo";
        walletAddress.textContent = "CONNECT";
        walletAddress.style.fontSize = "";
        phantomName.textContent = "phantom";
        isConnected = false;
        currentPublicKey = null;
        dropdownBefore.style.display = "block";
        dropdownAfter.style.display = "none";
      } catch (err) {
        console.error("Error updating UI on disconnect:", err);
      }
    }

    connectButton?.addEventListener('click', async e => {
      e.preventDefault();
      try {
        if (isConnected) {
          await window.solana.disconnect();
          updateUIOnDisconnect();
          console.log("Disconnected wallet.");
          return;
        }
        if (window.solana?.isPhantom) {
          const { publicKey } = await window.solana.connect();
          console.log("Connected wallet address:", publicKey.toString());
          updateUIOnConnect(publicKey);
        } else {
          alert("Phantom Wallet not found. Please install it: https://phantom.app");
        }
      } catch (err) {
        console.error("Wallet connection failed:", err.message);
        alert("Connection failed or rejected.");
      }
    });
  } catch (err) {
    console.error("Error in wallet setup:", err);
  }
})();

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
