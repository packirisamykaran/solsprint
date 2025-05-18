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
// Delayed Popup and Popup Sound
// ------------------------------------
(function setupPopup() {
  window.addEventListener('load', () => {
    try {
      setTimeout(() => {
        try {
          document.getElementById('popup')?.classList.add('show');
          document.getElementById('popupSound')?.play().catch(err => console.warn("popupSound play error:", err));
        } catch (err) {
          console.error("Popup show/play error:", err);
        }
      }, 1000);

      document.getElementById('closePopup')?.addEventListener('click', () => {
        try {
          document.getElementById('popup')?.classList.remove('show');
        } catch (err) {
          console.error("Error closing popup:", err);
        }
      });
    } catch (err) {
      console.error("Error setting up popup:", err);
    }
  });
})();

// -------------------------------------------
// GSAP Horizontal Scroll Setup
// -------------------------------------------
gsap.registerPlugin(ScrollTrigger);
(function setupHorizontalScroll() {
  try {
    const container = document.querySelector('#main');
    const sections = gsap.utils.toArray('.content');
    const scrollSpeedFactor = 15;

    if (container && sections.length) {
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          end: () => `+=${container.offsetWidth * scrollSpeedFactor}`
        }
      });
    }
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
    const walletImage = document.getElementById('wallet');
    const walletAddress = document.getElementById('phantom-connect');
    const phantomName = document.getElementById('phantom-name');

    let isConnected = false;
    let currentPublicKey = null;

    const updateUIOnConnect = (publicKey) => {
      try {
        currentPublicKey = publicKey;
        walletImage.src = "assets/img/Profile icon.png";
        walletImage.alt = "Connected Wallet";
        walletAddress.textContent = publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4);
        walletAddress.style.fontSize = "1rem";
        phantomName.textContent = "";
        isConnected = true;
      } catch (err) {
        console.error("Error updating UI on connect:", err);
      }
    };

    const updateUIOnDisconnect = () => {
      try {
        walletImage.src = "assets/img/wallet.png";
        walletImage.alt = "Phantom Logo";
        walletAddress.textContent = "CONNECT";
        walletAddress.style.fontSize = "";
        phantomName.textContent = "phantom";
        isConnected = false;
        currentPublicKey = null;
      } catch (err) {
        console.error("Error updating UI on disconnect:", err);
      }
    };

    connectButton?.addEventListener('click', async (e) => {
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