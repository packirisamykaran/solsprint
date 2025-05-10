    gsap.registerPlugin(ScrollTrigger);

    const container = document.querySelector('#main');
    const sections = gsap.utils.toArray('.content');
    
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: true,  // key for manual control — tied to scroll
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