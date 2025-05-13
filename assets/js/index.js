    gsap.registerPlugin(ScrollTrigger);

    const container = document.querySelector('#main');
    const sections = gsap.utils.toArray('.content');
    
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: true,
        end: () => "+=" + (container.offsetWidth * 2)
      }
    });
    window.addEventListener("load", () => {
      setTimeout(() => {
        document.getElementById("popup").classList.add("show");
      }, 3000);
    
      document.getElementById("closePopup").addEventListener("click", () => {
        document.getElementById("popup").classList.remove("show");
      });
    });
    // let scrollSpeed = 0.1; 
    // window.addEventListener("wheel", function(e) {
    //   e.preventDefault();
    //   window.scrollBy({
    //     top: e.deltaY * scrollSpeed,
    //     behavior: "auto"
    //   });
    // }, { passive: false });
     
    let isScrolling = false;
    let scrollSpeed = 0.1;
    
    window.addEventListener("wheel", function(e) {
      e.preventDefault();
    
      if (!isScrolling) {
        window.requestAnimationFrame(function() {
          window.scrollBy({
            top: e.deltaY * scrollSpeed,
            behavior: "auto"
          });
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, { passive: false });
    
    document.getElementById('connect-wallet').addEventListener('click', async function (event) {
      event.preventDefault();
  
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect();
          console.log("Connected wallet address:", response.publicKey.toString());
          alert("Connected: " + response.publicKey.toString());
        } catch (err) {
          console.error("Connection failed:", err.message);
          alert("Connection rejected.");
        }
      } else {
        alert("Phantom Wallet not found. Please install it: https://phantom.app");
      }
    });

    