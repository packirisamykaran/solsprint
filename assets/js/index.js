window.addEventListener('click', () => {
  const music = document.getElementById('bgMusic');
  music.muted = false;
  music.play();
});

const popupSound = document.getElementById('popupSound');
const popup = document.getElementById('popup');

// // Wait for first user interaction before playing popup sound
// function playPopupSoundOnce() {

//   document.removeEventListener('click', playPopupSoundOnce);
//   document.removeEventListener('mousemove', playPopupSoundOnce);
//   document.removeEventListener('keydown', playPopupSoundOnce);
// }

// // Attach listeners for first interaction
// document.addEventListener('click', playPopupSoundOnce);
// document.addEventListener('mousemove', playPopupSoundOnce);
// document.addEventListener('keydown', playPopupSoundOnce);




// -------------------------------
// Horizontal Scroll Setup Section
// -------------------------------

gsap.registerPlugin(ScrollTrigger);
(function setupHorizontalScroll() {
  const container = document.querySelector('#main');
  const sections = gsap.utils.toArray('.content');
  const scrollSpeedFactor = 15;

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
})();


// ----------------------
// Delayed Popup Handling
// ----------------------
(function setupPopup() {
  window.addEventListener('load', () => {
    // Show popup 3 seconds after page load
    setTimeout(() => {
      document.getElementById('popup')?.classList.add('show');
    }, 1000);

    

    popupSound.play();

    // Hide popup when close button is clicked
    document.getElementById('closePopup')?.addEventListener('click', () => {
      document.getElementById('popup')?.classList.remove('show');
    });
  });
})();

// // -------------------------------------------
// // Custom Scroll Speed Control (Mouse Wheel)
// // -------------------------------------------
// (function setupCustomScrollSpeed() {
//   const scrollSpeed = 0.4; // Adjust this to make scrolling faster or slower
//   let isScrolling = false;

//   // Overrides default wheel behavior to control scroll speed manually
//   window.addEventListener('wheel', (e) => {
//     e.preventDefault();

//     if (!isScrolling) {
//       requestAnimationFrame(() => {
//         window.scrollBy({
//           top: e.deltaY * scrollSpeed, // Multiply delta for custom speed
//           behavior: 'auto'
//         });
//         isScrolling = false;
//       });
//       isScrolling = true;
//     }
//   }, { passive: false });
// })();


// ------------------------------
// Phantom Wallet Connect Handler
// ------------------------------
(function setupWalletConnection() {
  const connectButton = document.getElementById('connect-wallet');
  const walletImage = document.getElementById('wallet');
  const walletAddress = document.getElementById('phantom-connect');
  const phantomName = document.getElementById('phantom-name');

  let isConnected = false;
  let currentPublicKey = null;

  const updateUIOnConnect = (publicKey) => {
    currentPublicKey = publicKey;
    walletImage.src = "assets/img/Profile icon.png";
    walletImage.alt = "Connected Wallet";
    walletAddress.textContent = publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4);
    walletAddress.style.fontSize = "1rem";
    phantomName.textContent = "";
    isConnected = true;
  };

  const updateUIOnDisconnect = () => {
    walletImage.src = "assets/img/wallet.png";
    walletImage.alt = "Phantom Logo";
    walletAddress.textContent = "CONNECT";
    walletAddress.style.fontSize = "";
    phantomName.textContent = "phantom";
    isConnected = false;
    currentPublicKey = null;
  };

  connectButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // Disconnect if already connected
    if (isConnected) {
      try {
        await window.solana.disconnect();
        updateUIOnDisconnect();
        console.log("Disconnected wallet.");
        // alert("Wallet disconnected.");
      } catch (err) {
        console.error("Disconnection failed:", err.message);
      }
      return;
    }

    // Connect if Phantom is available
    if (window.solana?.isPhantom) {
      try {
        const { publicKey } = await window.solana.connect();
        console.log("Connected wallet address:", publicKey.toString());
        // alert("Connected: " + publicKey.toString());
        updateUIOnConnect(publicKey);
      } catch (err) {
        console.error("Connection failed:", err.message);
        alert("Connection rejected.");
      }
    } else {
      alert("Phantom Wallet not found. Please install it: https://phantom.app");
    }
  });
})();