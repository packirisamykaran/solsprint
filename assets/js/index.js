
    //    gsap.registerPlugin(ScrollTrigger);

    //    const contents = gsap.utils.toArray('#main .content');

    //    gsap.to(contents,{
    //     xPercent: -100 * (contents. length - 1),
    //     ScrollTrigger: {
    //         trigger : '#main',
    //         pin: true,
    //         scrub: 1,
            
    //     }
    //    });

  

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
    