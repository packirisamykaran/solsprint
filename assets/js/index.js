window.addEventListener('click', () => {
  const music = document.getElementById('bgMusic');
  music.muted = false;
  music.play();
});

const popupSound = document.getElementById('popupSound');
  const buttonSound = document.getElementById('buttonSound');
  const closeBtn = document.getElementById('closePopup');
  const popup = document.getElementById('popup');

  // Wait for first user interaction before playing popup sound
  function playPopupSoundOnce() {
    popupSound.play();
    document.removeEventListener('click', playPopupSoundOnce);
    document.removeEventListener('mousemove', playPopupSoundOnce);
    document.removeEventListener('keydown', playPopupSoundOnce);
  }

  // Attach listeners for first interaction
  document.addEventListener('click', playPopupSoundOnce);
  document.addEventListener('mousemove', playPopupSoundOnce);
  document.addEventListener('keydown', playPopupSoundOnce);

  // Close popup and play button click sound
  closeBtn.addEventListener('click', () => {
    buttonSound.play();
    popup.style.display = 'none';
  });


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
    }, 3000);

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
  if (!connectButton) return;

  connectButton.addEventListener('click', async (e) => {
    e.preventDefault();

    // Check if Phantom is installed
    if (window.solana?.isPhantom) {
      try {
        const { publicKey } = await window.solana.connect();
        console.log("Connected wallet address:", publicKey.toString());
        alert("Connected: " + publicKey.toString());

        // id = "wallet" update src image
        const walletImage = document.getElementById('wallet');
        if (walletImage) {
          walletImage.src = "assets/img/Profile icon.png";
          walletImage.alt = "Connected Wallet";

        }

        // id phantom-connect update text to wallet address
        const walletAddress = document.getElementById('phantom-connect');
        if (walletAddress) {
          walletAddress.textContent = 
  publicKey.toString().slice(0, 4) + "..." + publicKey.toString().slice(-4);
          walletAddress.style.fontSize = "20px";
        }

        const phantomname = document.getElementById('phantom-name');
        if (walletAddress) {
          phantomname.textContent = "";
        }
        


      } catch (err) {
        console.error("Connection failed:", err.message);
        alert("Connection rejected.");
      }
    } else {
      alert("Phantom Wallet not found. Please install it: https://phantom.app");
    }
  });
})();
