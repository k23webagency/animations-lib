function initAnimations() {
  // Оптимизация для Mac/iOS: включение аппаратного ускорения
  gsap.config({ force3D: true });

  // --- 12. Follow Image Reveal ---
  const hoverReveals = document.querySelectorAll('[data-hover-reveal]');
  if (hoverReveals.length > 0) {
    const cursorImg = document.createElement('img');
    cursorImg.className = 'hover-reveal-img';
    document.body.appendChild(cursorImg);
    
    let xTo = gsap.quickTo(cursorImg, "x", {duration: 0.4, ease: "power3"}),
        yTo = gsap.quickTo(cursorImg, "y", {duration: 0.4, ease: "power3"});

    let isHovering = false;

    hoverReveals.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        isHovering = true;
        cursorImg.src = el.getAttribute('data-hover-reveal');
        gsap.set(cursorImg, { x: e.clientX, y: e.clientY });
        xTo(e.clientX);
        yTo(e.clientY);
        gsap.to(cursorImg, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(1.2)", overwrite: "auto" });
      });
      
      el.addEventListener('mouseleave', () => {
        isHovering = false;
        gsap.to(cursorImg, { opacity: 0, scale: 0.5, rotate: 5, duration: 0.3, overwrite: "auto" });
      });
      
      el.addEventListener('mousemove', (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      });
    });

    window.addEventListener('scroll', () => {
      if (isHovering) {
         gsap.to(cursorImg, { opacity: 0, scale: 0.5, rotate: 5, duration: 0.3, overwrite: "auto" });
         isHovering = false;
      }
    }, { passive: true });
  }

  // --- 1. Обработка анимаций появления (Reveal) ---
  // Функция-помощник для разбивки текста (без сторонних библиотек)
  function customTextSplit(element, splitBy = 'chars') {
    const text = element.innerText.trim();
    element.innerHTML = '';
    const fragments = splitBy === 'words' ? text.split(' ') : text.split('');
    const spans = [];
    fragments.forEach((frag, i) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity, filter';
      if (splitBy === 'words') {
        span.innerText = frag;
        if (i < fragments.length - 1) {
          const space = document.createTextNode(' ');
          element.appendChild(span);
          element.appendChild(space);
        } else {
          element.appendChild(span);
        }
      } else {
        span.innerHTML = frag === ' ' ? '&nbsp;' : frag;
        element.appendChild(span);
      }
      spans.push(span);
    });
    return spans;
  }

  const animateElements = document.querySelectorAll('[data-animate]');

  animateElements.forEach((el) => {
    const animationType = el.dataset.animate;
    const delay = parseFloat(el.dataset.delay || '0');
    const duration = parseFloat(el.dataset.duration || '1');
    
    const scrollConfig = {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    };

    switch (animationType) {
      // --- FADES ---
      case 'fade-up':
        gsap.fromTo(el, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration, delay, ease: 'power3.out', scrollTrigger: scrollConfig });
        break;
      case 'fade-down':
        gsap.fromTo(el, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration, delay, ease: 'power3.out', scrollTrigger: scrollConfig });
        break;
      case 'fade-left':
        gsap.fromTo(el, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration, delay, ease: 'power3.out', scrollTrigger: scrollConfig });
        break;
      case 'fade-right':
        gsap.fromTo(el, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration, delay, ease: 'power3.out', scrollTrigger: scrollConfig });
        break;

      // --- ZOOMS ---
      case 'zoom-in':
        gsap.fromTo(el, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration, delay, ease: 'back.out(1.5)', scrollTrigger: scrollConfig });
        break;
      case 'zoom-out':
        gsap.fromTo(el, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration, delay, ease: 'power3.out', scrollTrigger: scrollConfig });
        break;

      // --- FLIPS (3D) ---
      case 'flip-up':
        gsap.fromTo(el, { rotateX: -90, opacity: 0 }, { rotateX: 0, opacity: 1, duration, delay, ease: 'back.out(1.5)', scrollTrigger: scrollConfig });
        break;
      case 'flip-down':
        gsap.fromTo(el, { rotateX: 90, opacity: 0 }, { rotateX: 0, opacity: 1, duration, delay, ease: 'back.out(1.5)', scrollTrigger: scrollConfig });
        break;
      case 'flip-left':
        gsap.fromTo(el, { rotateY: -90, opacity: 0 }, { rotateY: 0, opacity: 1, duration, delay, ease: 'back.out(1.5)', scrollTrigger: scrollConfig });
        break;
      case 'flip-right':
        gsap.fromTo(el, { rotateY: 90, opacity: 0 }, { rotateY: 0, opacity: 1, duration, delay, ease: 'back.out(1.5)', scrollTrigger: scrollConfig });
        break;

      // --- SKEWS & SPINS & BOUNCES ---
      case 'skew-up':
        gsap.fromTo(el, { skewY: 15, y: 100, opacity: 0 }, { skewY: 0, y: 0, opacity: 1, duration, delay, ease: 'power4.out', scrollTrigger: scrollConfig });
        break;
      case 'spin-in':
        gsap.fromTo(el, { rotation: -180, scale: 0, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration, delay, ease: 'back.out(1.2)', scrollTrigger: scrollConfig });
        break;
      case 'bounce-in':
        gsap.fromTo(el, { y: -150, opacity: 0 }, { y: 0, opacity: 1, duration: duration * 1.5, delay, ease: 'bounce.out', scrollTrigger: scrollConfig });
        break;

      // --- ПРЕМИАЛЬНЫЕ ТЕКСТОВЫЕ ЭФФЕКТЫ (НОВЫЕ) ---
      case 'slot-machine': {
        const chars = customTextSplit(el, 'chars');
        const inners = [];
        chars.forEach(char => {
          // Фиксируем размеры перед изменением контента
          const rect = char.getBoundingClientRect();
          char.style.width = `${rect.width}px`;
          char.style.height = `${rect.height}px`;
          char.style.overflow = 'hidden';
          char.style.verticalAlign = 'bottom';
          const inner = document.createElement('span');
          inner.style.display = 'inline-flex';
          inner.style.flexDirection = 'column';
          inner.style.width = '100%';
          // Имитируем прокрутку (3 случайных символа перед реальной буквой)
          inner.innerHTML = `
            <span style="opacity:0.2; height:${rect.height}px; display:flex; align-items:center; justify-content:center;">#</span>
            <span style="opacity:0.4; height:${rect.height}px; display:flex; align-items:center; justify-content:center;">%</span>
            <span style="opacity:0.6; height:${rect.height}px; display:flex; align-items:center; justify-content:center;">@</span>
            <span style="height:${rect.height}px; display:flex; align-items:center; justify-content:center;">${char.innerHTML}</span>
          `;
          char.innerHTML = '';
          char.appendChild(inner);
          inners.push(inner);
        });
        gsap.fromTo(inners, 
          { yPercent: 0 },
          { yPercent: -75, duration: 1.5, ease: 'power4.out', stagger: 0.05, scrollTrigger: scrollConfig }
        );
        break;
      }

      case 'elastic-snap': {
        const chars = customTextSplit(el, 'chars');
        gsap.from(chars, {
          scaleX: 4,
          opacity: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.3)',
          stagger: 0.03,
          scrollTrigger: scrollConfig
        });
        break;
      }

      case 'block-highlight': {
        el.style.position = 'relative';
        el.style.display = 'inline-block';
        const textSpan = document.createElement('span');
        textSpan.innerHTML = el.innerHTML;
        textSpan.style.opacity = 0;
        el.innerHTML = '';
        el.appendChild(textSpan);
        
        const block = document.createElement('div');
        block.style.position = 'absolute';
        block.style.top = '0'; block.style.left = '0';
        block.style.width = '100%'; block.style.height = '100%';
        block.style.backgroundColor = 'var(--accent-color)';
        block.style.transformOrigin = 'left';
        el.appendChild(block);
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.fromTo(block, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' })
          .set(textSpan, { opacity: 1 })
          .set(block, { transformOrigin: 'right' })
          .to(block, { scaleX: 0, duration: 0.5, ease: 'power2.inOut' });
        break;
      }

      case 'cinematic-blur': {
        const words = customTextSplit(el, 'words');
        gsap.from(words, {
          filter: 'blur(12px)',
          scale: 1.2,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: scrollConfig
        });
        break;
      }

      case 'text-split-reveal': {
        const text = el.innerText;
        el.innerHTML = '';
        el.style.position = 'relative';
        el.style.display = 'inline-block';
        const hiddenText = el.dataset.hiddenText || '';
        
        const topPart = document.createElement('span');
        topPart.innerText = text;
        topPart.style.display = 'block';
        topPart.style.clipPath = 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)';
        topPart.style.webkitClipPath = 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)';
        
        const bottomPart = document.createElement('span');
        bottomPart.innerText = text;
        bottomPart.style.display = 'block';
        bottomPart.style.position = 'absolute';
        bottomPart.style.top = '0';
        bottomPart.style.left = '0';
        bottomPart.style.clipPath = 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)';
        bottomPart.style.webkitClipPath = 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)';
        
        const middlePart = document.createElement('span');
        middlePart.innerText = hiddenText;
        middlePart.style.position = 'absolute';
        middlePart.style.top = '50%';
        middlePart.style.left = '50%';
        middlePart.style.transform = 'translate(-50%, -50%)';
        middlePart.style.fontSize = '0.3em';
        middlePart.style.letterSpacing = '0.5em';
        middlePart.style.opacity = '0';
        middlePart.style.whiteSpace = 'nowrap';
        middlePart.style.color = 'var(--accent)';
        
        el.appendChild(topPart);
        el.appendChild(bottomPart);
        el.appendChild(middlePart);
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.to(topPart, { yPercent: -15, duration: 1, ease: 'power3.inOut' }, 0)
          .to(bottomPart, { yPercent: 15, duration: 1, ease: 'power3.inOut' }, 0)
          .to(middlePart, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.5);
        break;
      }

      case 'media-text-parallax': {
        el.style.backgroundClip = 'text';
        el.style.webkitBackgroundClip = 'text';
        el.style.color = 'transparent';
        el.style.webkitTextFillColor = 'transparent';
        el.style.backgroundPosition = '50% 50%';
        el.style.backgroundSize = '100%';
        
        gsap.to(el, {
          backgroundSize: '150%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
        break;
      }

      case 'ghost-echo': {
        const text = el.innerText;
        el.innerHTML = '';
        el.style.position = 'relative';
        
        const original = document.createElement('span');
        original.innerText = text;
        original.style.position = 'relative';
        original.style.zIndex = '2';
        el.appendChild(original);
        
        const ghosts = [];
        for(let i=0; i<3; i++) {
          const ghost = document.createElement('span');
          ghost.innerText = text;
          ghost.style.position = 'absolute';
          ghost.style.top = '0';
          ghost.style.left = '0';
          ghost.style.zIndex = '1';
          ghost.style.opacity = '0';
          ghost.style.pointerEvents = 'none';
          el.appendChild(ghost);
          ghosts.push(ghost);
        }
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        
        ghosts.forEach((ghost, i) => {
          tl.fromTo(ghost, 
            { scale: 1, opacity: 0.5 - (i*0.15) },
            { scale: 1 + ((i+1)*0.2), opacity: 0, duration: 1.5, ease: 'power2.out' },
            i * 0.1 // небольшая задержка между эхо
          );
        });
        break;
      }

      case '3d-paper-fold': {
        const chars = customTextSplit(el, 'chars');
        el.style.perspective = '1000px';
        chars.forEach(char => {
          char.style.transformOrigin = 'bottom center';
          char.style.display = 'inline-block';
        });
        gsap.fromTo(chars, 
          { rotateX: 90, opacity: 0 },
          { rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'back.out(1.7)', scrollTrigger: scrollConfig }
        );
        break;
      }

      // --- ПРЕМИАЛЬНЫЕ ЭФФЕКТЫ ---
      case 'blur-reveal':
        gsap.fromTo(el, 
          { filter: 'blur(30px)', opacity: 0, scale: 1.1 }, 
          { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 1.5, delay, ease: 'power3.out', scrollTrigger: scrollConfig }
        );
        break;

      case 'decode': {
        const originalText = el.textContent.trim();
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
        const obj = { p: 0 };
        
        const tlDecode = gsap.timeline({
          scrollTrigger: scrollConfig
        });
        
        tlDecode.to(obj, {
          p: 100,
          duration: 1.5,
          ease: 'none',
          delay,
          onUpdate: () => {
            let progress = obj.p / 100;
            let revealedLength = Math.floor(originalText.length * progress);
            let currentText = '';
            for (let i = 0; i < originalText.length; i++) {
              if (i < revealedLength || originalText[i] === ' ') {
                currentText += originalText[i];
              } else {
                currentText += chars[Math.floor(Math.random() * chars.length)];
              }
            }
            el.textContent = currentText;
          }
        });
        break;
      }

      case 'stroke-fill': {
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el,
            { '--fill': '0%' },
            { '--fill': '100%', duration: 1.5, delay, ease: 'power2.out' }
          );
        break;
      }

      case 'cinematic-reveal': {
        const img = el.querySelector('img');
        if (img) {
          const tl = gsap.timeline({ scrollTrigger: scrollConfig });
          tl.fromTo(el, 
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', delay },
            0
          ).fromTo(img,
            { scale: 1.5 },
            { scale: 1, duration: 1.5, ease: 'power4.inOut', delay },
            0
          );
        }
        break;
      }

      case 'cards-fan': {
        const cards = el.querySelectorAll('img');
        if (cards.length > 0) {
          const tlFan = gsap.timeline({ scrollTrigger: scrollConfig });
          
          tlFan.fromTo(cards,
            { y: 150, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay }
          );
          
          cards.forEach((card, i) => {
            const offset = i - (cards.length - 1) / 2;
            tlFan.to(card, {
              rotation: offset * 12,
              x: offset * 40,
              duration: 0.8,
              ease: 'back.out(1.5)'
            }, "-=0.4");
          });
        }
        break;
      }

      case 'text-split':
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = '';
        words.forEach(word => {
          const spanWrapper = document.createElement('span');
          spanWrapper.style.display = 'inline-block';
          spanWrapper.style.overflow = 'hidden';
          spanWrapper.style.verticalAlign = 'top';
          spanWrapper.style.marginRight = '0.25em';
          
          const innerSpan = document.createElement('span');
          innerSpan.style.display = 'inline-block';
          innerSpan.textContent = word;
          
          spanWrapper.appendChild(innerSpan);
          el.appendChild(spanWrapper);
        });
        
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.querySelectorAll('span > span'), 
            { y: '100%', rotation: 5, opacity: 0 }, 
            { y: '0%', rotation: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', delay }
          );
        break;

      // --- SPLITTYPE.JS ANIMATIONS ---
      case 'split-lines': {
        if (typeof SplitType !== 'undefined') {
          // Чтобы предотвратить FOUC, временно показываем элемент перед сплитом,
          // но делаем его прозрачным, чтобы SplitType мог рассчитать размеры
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'lines' });
          // Оборачиваем каждую строку в контейнер с overflow:hidden
          split.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'block'; // Убеждаемся, что блочный
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          gsap.fromTo(split.lines,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'split-words': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'words' });
          gsap.fromTo(split.words,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'back.out(1.5)', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'split-chars': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'chars' });
          gsap.fromTo(split.chars,
            { opacity: 0, scale: 0, rotationX: 90 },
            { opacity: 1, scale: 1, rotationX: 0, duration: 0.8, stagger: 0.02, ease: 'power3.out', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'split-rotate-words': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'words' });
          // Оборачиваем слова для скрытия переполнения
          split.words.forEach(word => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'inline-block';
            wrapper.style.verticalAlign = 'top';
            // Добавляем небольшой отступ, чтобы слова не слипались
            wrapper.style.marginRight = '0.2em';
            word.parentNode.insertBefore(wrapper, word);
            wrapper.appendChild(word);
          });

          gsap.fromTo(split.words,
            { y: '100%', rotationX: -90, opacity: 0 },
            { y: '0%', rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'back.out(1.5)', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'split-glitch': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'chars' });
          gsap.fromTo(split.chars,
            { opacity: 0, x: () => gsap.utils.random(-20, 20), y: () => gsap.utils.random(-20, 20), skewX: () => gsap.utils.random(-20, 20) },
            { opacity: 1, x: 0, y: 0, skewX: 0, duration: 0.5, stagger: { amount: 1, from: "random" }, ease: 'power4.out', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'split-skew-lines': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'lines' });
          split.lines.forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            wrapper.style.display = 'block';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
          });

          gsap.fromTo(split.lines,
            { y: '100%', skewY: 10, opacity: 0 },
            { y: '0%', skewY: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'text-scale-up': {
        gsap.fromTo(el,
          { scale: 1.5, filter: 'blur(20px)', opacity: 0 },
          { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: scrollConfig }
        );
        break;
      }

      case 'typewriter': {
        const text = el.textContent.trim();
        el.textContent = '';
        
        // Добавляем класс для мигающей каретки
        el.classList.add('typewriter-active');

        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        const obj = { length: 0 };
        
        tl.to(obj, {
          length: text.length,
          duration: text.length * 0.05, // скорость печати
          ease: 'none',
          delay,
          onUpdate: () => {
            el.textContent = text.substring(0, Math.floor(obj.length));
          }
        });
        break;
      }

      case 'split-snap': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          
          const split = new SplitType(el, { types: 'chars' });
          gsap.fromTo(split.chars,
            { opacity: 0, filter: 'blur(20px)', scale: 1.5, x: (i) => (i % 2 === 0 ? -100 : 100) },
            { opacity: 1, filter: 'blur(0px)', scale: 1, x: 0, duration: 1.5, ease: 'power4.out', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'split-unfold': {
        if (typeof SplitType !== 'undefined') {
          el.style.opacity = 1;
          el.style.visibility = 'visible';
          el.style.perspective = '1000px';
          
          const split = new SplitType(el, { types: 'lines' });
          gsap.fromTo(split.lines,
            { opacity: 0, rotationX: -90, transformOrigin: '50% 100%' },
            { opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.2, ease: 'back.out(1.2)', scrollTrigger: scrollConfig }
          );
        }
        break;
      }

      case 'block-reveal': {
        const color = el.dataset.blockColor || 'var(--accent-color)';
        const block = document.createElement('div');
        block.style.cssText = `position:absolute; top:0; left:0; width:100%; height:100%; background:${color}; transform-origin:left; z-index:10;`;
        
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const targetImg = el.querySelector('img');
        if(targetImg) gsap.set(targetImg, {opacity: 0, scale: 1.2});
        
        el.appendChild(block);
        
        const tlBlock = gsap.timeline({ scrollTrigger: scrollConfig });
        tlBlock.fromTo(block, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power4.inOut', delay })
               .set(targetImg, { opacity: 1 })
               .to(targetImg, { scale: 1, duration: 1.2, ease: 'power3.out' }, '>')
               .to(block, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.inOut' }, '<');
        break;
      }

      case 'image-slices': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        
        origImg.style.opacity = 0;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const direction = el.dataset.sliceDirection || 'up'; // up, down, left, right
        const sliceSpeed = parseFloat(el.dataset.sliceSpeed || '1.2'); // Скорость анимации
        const slicesCount = 5;
        const slices = [];
        
        for(let i=0; i<slicesCount; i++) {
          const clone = origImg.cloneNode();
          clone.style.opacity = 1;
          clone.style.position = 'absolute';
          clone.style.top = '0';
          clone.style.left = '0';
          clone.style.width = '100%';
          clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          clone.style.willChange = 'transform';
          
          if (direction === 'up' || direction === 'down') {
            const left = i * (100 / slicesCount);
            const right = 100 - ((i + 1) * (100 / slicesCount));
            clone.style.clipPath = `inset(0% ${right}% 0% ${left}%)`;
          } else {
            const top = i * (100 / slicesCount);
            const bottom = 100 - ((i + 1) * (100 / slicesCount));
            clone.style.clipPath = `inset(${top}% 0% ${bottom}% 0%)`;
          }
          
          el.appendChild(clone);
          slices.push(clone);
        }
        
        let startConfig = {};
        let endConfig = { duration: sliceSpeed, stagger: 0.1, ease: 'power4.out', delay, scrollTrigger: scrollConfig };
        
        if (direction === 'up') {
          startConfig = { y: '100%' };
          endConfig.y = '0%';
        } else if (direction === 'down') {
          startConfig = { y: '-100%' };
          endConfig.y = '0%';
        } else if (direction === 'left') {
          startConfig = { x: '100%' };
          endConfig.x = '0%';
        } else if (direction === 'right') {
          startConfig = { x: '-100%' };
          endConfig.x = '0%';
        }
        
        gsap.fromTo(slices, startConfig, endConfig);
        break;
      }

      case 'opposing-slices': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        
        origImg.style.opacity = 0;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const sliceSpeed = parseFloat(el.dataset.sliceSpeed || '1.5');
        const slicesCount = 6;
        const slices = [];
        const heightPct = 100 / slicesCount;
        
        for(let i=0; i<slicesCount; i++) {
          const clone = origImg.cloneNode();
          clone.style.opacity = 1;
          clone.style.position = 'absolute';
          clone.style.top = '0';
          clone.style.left = '0';
          clone.style.width = '100%';
          clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          clone.style.willChange = 'transform';
          
          const top = i * heightPct;
          const bottom = 100 - ((i + 1) * heightPct);
          clone.style.clipPath = `inset(${top}% 0% ${bottom}% 0%)`;
          
          // Четные стартуют слева (-100%), нечетные справа (100%)
          gsap.set(clone, { x: i % 2 === 0 ? '-100%' : '100%' });
          
          el.appendChild(clone);
          slices.push(clone);
        }
        
        gsap.to(slices, {
          x: '0%',
          duration: sliceSpeed,
          ease: 'back.out(1.2)',
          scrollTrigger: scrollConfig
        });
        break;
      }

      case 'grid-reveal': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        
        origImg.style.opacity = 0;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const sliceSpeed = parseFloat(el.dataset.sliceSpeed || '0.8');
        const cols = 5;
        const rows = 5;
        const slices = [];
        const widthPct = 100 / cols;
        const heightPct = 100 / rows;
        
        for(let r=0; r<rows; r++) {
          for(let c=0; c<cols; c++) {
            const clone = origImg.cloneNode();
            clone.style.opacity = 1;
            clone.style.position = 'absolute';
            clone.style.top = '0';
            clone.style.left = '0';
            clone.style.width = '100%';
            clone.style.height = '100%';
            clone.style.objectFit = 'cover';
            clone.style.willChange = 'transform, opacity';
            
            const top = r * heightPct;
            const bottom = 100 - ((r + 1) * heightPct);
            const left = c * widthPct;
            const right = 100 - ((c + 1) * widthPct);
            
            clone.style.clipPath = `inset(${top}% ${right}% ${bottom}% ${left}%)`;
            
            el.appendChild(clone);
            slices.push(clone);
          }
        }
        
        gsap.fromTo(slices,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: sliceSpeed,
            stagger: { amount: 1, from: "random" },
            ease: 'power3.out',
            scrollTrigger: scrollConfig
          }
        );
        break;
      }

      case '3d-blinds': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        
        origImg.style.opacity = 0;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.style.perspective = '1200px';
        
        const sliceSpeed = parseFloat(el.dataset.sliceSpeed || '1.2');
        const slicesCount = 7;
        const slices = [];
        const widthPct = 100 / slicesCount;
        
        for(let i=0; i<slicesCount; i++) {
          const clone = origImg.cloneNode();
          clone.style.opacity = 1;
          clone.style.position = 'absolute';
          clone.style.top = '0';
          clone.style.left = '0';
          clone.style.width = '100%';
          clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          clone.style.willChange = 'transform';
          clone.style.transformOrigin = `${(i * widthPct) + (widthPct / 2)}% 50%`;
          
          const left = i * widthPct;
          const right = 100 - ((i + 1) * widthPct);
          clone.style.clipPath = `inset(0% ${right}% 0% ${left}%)`;
          
          el.appendChild(clone);
          slices.push(clone);
        }
        
        gsap.fromTo(slices,
          { rotationY: 90, opacity: 0 },
          {
            rotationY: 0,
            opacity: 1,
            duration: sliceSpeed,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: scrollConfig
          }
        );
        break;
      }

      case 'focus-pull': {
        const front = el.querySelector('.focus-front');
        const back = el.querySelector('.focus-back');
        if (!front || !back) break;
        
        gsap.set(front, { filter: 'blur(0px)', scale: 1 });
        gsap.set(back, { filter: 'blur(10px)', scale: 1.1 });
        
        gsap.to(front, { filter: 'blur(15px)', scale: 1.05, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to(back, { filter: 'blur(0px)', scale: 1, scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
        break;
      }

      case 'vortex': {
        const vImg = el.querySelector('img');
        if(vImg) {
          const vTl = gsap.timeline({ scrollTrigger: scrollConfig });
          vTl.fromTo(el, 
            { clipPath: 'circle(0% at 50% 50%)' }, 
            { clipPath: 'circle(150% at 50% 50%)', duration: 1.8, ease: 'power3.inOut', delay }, 0)
             .fromTo(vImg,
            { scale: 2, rotation: 15 },
            { scale: 1, rotation: 0, duration: 1.8, ease: 'power3.inOut', delay }, 0);
        }
        break;
      }

      // --- ПРЕМИАЛЬНЫЕ ЭФФЕКТЫ ДЛЯ ИЗОБРАЖЕНИЙ (НОВЫЕ) ---
      case 'origami-unfold': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        origImg.style.opacity = 0;
        el.style.position = 'relative';
        el.style.perspective = '1500px';
        
        const slicesCount = 4;
        const slices = [];
        const widthPct = 100 / slicesCount;
        
        for(let i=0; i<slicesCount; i++) {
          const clone = origImg.cloneNode();
          clone.style.opacity = 1;
          clone.style.position = 'absolute';
          clone.style.top = '0'; clone.style.left = '0';
          clone.style.width = '100%'; clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          
          const left = i * widthPct;
          const right = 100 - ((i + 1) * widthPct);
          clone.style.clipPath = `inset(0% ${right}% 0% ${left}%)`;
          clone.style.transformOrigin = i % 2 === 0 ? 'left center' : 'right center';
          clone.style.willChange = 'transform';
          
          el.appendChild(clone);
          slices.push(clone);
        }
        
        gsap.fromTo(slices,
          { rotationY: (i) => i % 2 === 0 ? 90 : -90, opacity: 0 },
          { rotationY: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1, scrollTrigger: scrollConfig }
        );
        break;
      }

      case 'diagonal-shutters': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        origImg.style.opacity = 0;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const slicesCount = 5;
        const slices = [];
        
        // Чтобы покрыть всю диагональ, нам нужно двигаться от отрицательных значений
        // x-координаты до значений, превышающих 100%. 
        // Ширина одной полосы
        const step = (100 + 50) / slicesCount; // 50 - это компенсация наклона (сдвиг низа влево)
        
        for(let i=0; i<slicesCount; i++) {
          const clone = origImg.cloneNode();
          clone.style.opacity = 1;
          clone.style.position = 'absolute';
          clone.style.top = '0'; clone.style.left = '0';
          clone.style.width = '100%'; clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          clone.style.willChange = 'transform, clip-path';
          
          // Точки polygon(x1 y1, x2 y2, x3 y3, x4 y4)
          // Наклон: низ сдвигается влево на 50%
          const startX = (i * step);
          const endX = ((i + 1) * step);
          
          // Немного увеличим endX, чтобы перекрыть стыки (избежать тонких линий)
          const overlap = 0.5;
          
          clone.style.clipPath = `polygon(${startX}% 0%, ${endX + overlap}% 0%, ${endX - 50 + overlap}% 100%, ${startX - 50}% 100%)`;
          
          el.appendChild(clone);
          slices.push(clone);
        }
        
        gsap.fromTo(slices,
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1, scrollTrigger: scrollConfig }
        );
        break;
      }

      case 'glitch-exposure': {
        const origImg = el.querySelector('img');
        if (!origImg) break;
        el.style.position = 'relative';
        
        const glitchSpeed = parseFloat(el.dataset.speed || '0.5');
        
        const clone1 = origImg.cloneNode();
        const clone2 = origImg.cloneNode();
        
        [clone1, clone2].forEach((clone, i) => {
          clone.style.position = 'absolute';
          clone.style.top = '0'; clone.style.left = '0';
          clone.style.width = '100%'; clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          clone.style.mixBlendMode = 'screen';
          clone.style.opacity = 0.8;
          clone.style.filter = i === 0 ? 'drop-shadow(5px 0 0 rgba(255,0,0,0.5))' : 'drop-shadow(-5px 0 0 rgba(0,255,255,0.5))';
          clone.style.willChange = 'transform, opacity';
          el.appendChild(clone);
        });
        
        origImg.style.opacity = 0;
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.fromTo(clone1, { x: -30 }, { x: 0, duration: glitchSpeed, ease: 'power4.out' }, 0)
          .fromTo(clone2, { x: 30 }, { x: 0, duration: glitchSpeed, ease: 'power4.out' }, 0)
          .set([clone1, clone2], { opacity: 0 })
          .set(origImg, { opacity: 1 });
        break;
      }

      case 'ken-burns': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.overflow = 'hidden';
        img.style.willChange = 'transform';
        
        const speed = parseFloat(el.dataset.speed || '1.5');
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.fromTo(el, 
          { clipPath: 'circle(10% at 50% 50%)' }, 
          { clipPath: 'circle(150% at 50% 50%)', duration: speed, ease: 'power2.inOut' }
        );
        
        gsap.fromTo(img, 
          { scale: 1 }, 
          { scale: 1.15, duration: 15, ease: 'none', repeat: -1, yoyo: true }
        );
        break;
      }

      case 'clip-reveal':
        const direction = el.dataset.clipDirection || 'top';
        // inset(top right bottom left)
        let clipStart = 'inset(100% 0 0 0)'; // По умолчанию: открывается снизу вверх
        
        if (direction === 'top') clipStart = 'inset(0 0 100% 0)';      // Открывается сверху вниз
        else if (direction === 'bottom') clipStart = 'inset(100% 0 0 0)'; // Открывается снизу вверх
        else if (direction === 'left') clipStart = 'inset(0 100% 0 0)';   // Открывается слева направо
        else if (direction === 'right') clipStart = 'inset(0 0 0 100%)';  // Открывается справа налево

        gsap.fromTo(el,
          { clipPath: clipStart },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', delay, scrollTrigger: scrollConfig }
        );
        break;

      // --- TEXT SCRUB ---
      case 'text-scrub':
        const scrubWords = el.textContent.trim().split(/\s+/);
        el.innerHTML = '';
        scrubWords.forEach(word => {
          const span = document.createElement('span');
          span.className = 'text-scrub-word';
          span.textContent = word + ' ';
          el.appendChild(span);
        });
        
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: true
          }
        }).to(el.querySelectorAll('.text-scrub-word'), {
          opacity: 1,
          stagger: 0.1,
          ease: 'none'
        });
        break;

      case 'expanding-slit': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.overflow = 'hidden';
        
        const speed = parseFloat(el.dataset.speed || '1.2');
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.fromTo(el, 
          { clipPath: 'inset(50% 0 50% 0)' },
          { clipPath: 'inset(0% 0 0% 0)', duration: speed, ease: 'power4.inOut', delay }
        );
        gsap.fromTo(img, 
          { scale: 1.3 },
          { scale: 1, duration: speed * 1.25, ease: 'power3.out', delay }
        );
        break;
      }

      case 'sine-wave-slices': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const speed = parseFloat(el.dataset.speed || '1.2');
        const slicesCount = 20;
        const slices = [];
        for (let i = 0; i < slicesCount; i++) {
          const slice = document.createElement('div');
          slice.style.position = 'absolute';
          slice.style.top = '0';
          slice.style.left = `${(i / slicesCount) * 100}%`;
          slice.style.width = `${100 / slicesCount}%`;
          slice.style.height = '100%';
          slice.style.overflow = 'hidden';
          
          const imgClone = img.cloneNode();
          imgClone.style.position = 'absolute';
          imgClone.style.top = '0';
          imgClone.style.left = `-${i * 100}%`;
          imgClone.style.width = `${slicesCount * 100}%`;
          imgClone.style.height = '100%';
          imgClone.style.objectFit = 'cover';
          
          slice.appendChild(imgClone);
          el.appendChild(slice);
          slices.push(slice);
        }
        
        img.style.opacity = 0; // Сразу скрываем оригинал до начала анимации
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.fromTo(slices, 
            { y: '100%' },
            { 
              y: '0%', 
              duration: speed, 
              ease: 'power3.out', 
              stagger: { amount: speed * 0.66, ease: 'sine.inOut' }
            }
          )
          .set(img, { opacity: 1 });
        break;
      }

      case 'scrapbook-build': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const speed = parseFloat(el.dataset.speed || '1.2');
        
        const pieces = [
          { clip: 'polygon(0% 0%, 50% 0%, 45% 50%, 0% 45%)', x: -50, y: -50, r: -15 },
          { clip: 'polygon(50% 0%, 100% 0%, 100% 55%, 45% 50%)', x: 50, y: -50, r: 10 },
          { clip: 'polygon(0% 45%, 45% 50%, 55% 100%, 0% 100%)', x: -50, y: 50, r: 15 },
          { clip: 'polygon(45% 50%, 100% 55%, 100% 100%, 55% 100%)', x: 50, y: 50, r: -10 }
        ];
        
        const frags = [];
        pieces.forEach(p => {
          const frag = img.cloneNode();
          frag.style.position = 'absolute';
          frag.style.top = '0';
          frag.style.left = '0';
          frag.style.width = '100%';
          frag.style.height = '100%';
          frag.style.clipPath = p.clip;
          frag.style.webkitClipPath = p.clip;
          el.appendChild(frag);
          frags.push({ el: frag, ...p });
        });
        
        img.style.opacity = 0; // Сразу скрываем оригинал до начала анимации
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        
        frags.forEach(f => {
          tl.fromTo(f.el, 
            { xPercent: f.x, yPercent: f.y, rotation: f.r, opacity: 0 },
            { xPercent: 0, yPercent: 0, rotation: 0, opacity: 1, duration: speed, ease: 'back.out(1.2)' },
            0
          );
        });
        
        tl.set(img, { opacity: 1 }, speed);
        break;
      }

      case 'diagonal-mirror-split': {
        const imgs = el.querySelectorAll('img');
        if (imgs.length < 2) break;
        const topImg = imgs[1];
        
        el.style.position = 'relative';
        
        const topHalf = topImg.cloneNode();
        topHalf.style.clipPath = 'polygon(0% 0%, 100% 0%, 0% 100%)';
        topHalf.style.webkitClipPath = 'polygon(0% 0%, 100% 0%, 0% 100%)';
        
        const bottomHalf = topImg.cloneNode();
        bottomHalf.style.clipPath = 'polygon(100% 0%, 100% 100%, 0% 100%)';
        bottomHalf.style.webkitClipPath = 'polygon(100% 0%, 100% 100%, 0% 100%)';
        
        el.appendChild(topHalf);
        el.appendChild(bottomHalf);
        topImg.style.display = 'none';
        
        gsap.to(topHalf, {
          xPercent: -100,
          yPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          }
        });
        
        gsap.to(bottomHalf, {
          xPercent: 100,
          yPercent: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          }
        });
        break;
      }

      case 'pixel-grid-dissolve': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.position = 'relative';
        
        const speed = parseFloat(el.dataset.speed || '0.6');
        
        const cols = 8;
        const rows = 8;
        const grid = document.createElement('div');
        grid.style.position = 'absolute';
        grid.style.top = '0';
        grid.style.left = '0';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        grid.style.pointerEvents = 'none';
        
        const pixels = [];
        for (let i = 0; i < cols * rows; i++) {
          const px = document.createElement('div');
          px.style.backgroundColor = 'var(--bg-color)';
          px.style.width = '101%'; // avoid anti-aliasing gaps
          px.style.height = '101%';
          grid.appendChild(px);
          pixels.push(px);
        }
        
        el.appendChild(grid);
        
        gsap.to(pixels, {
          scale: 0,
          opacity: 0,
          duration: speed,
          ease: 'power1.inOut',
          stagger: {
            amount: speed * 1.6,
            from: 'random'
          },
          scrollTrigger: scrollConfig
        });
        break;
      }

      // --- NEW TYPOGRAPHY EFFECTS ---
      case 'tracking-slam': {
        const text = el.innerText;
        el.innerHTML = '';
        el.style.display = 'inline-block';
        const spans = [];
        text.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          el.appendChild(span);
          spans.push(span);
        });
        
        gsap.fromTo(spans,
          { x: (i) => (i - spans.length/2) * 80, opacity: 0, filter: 'blur(10px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'elastic.out(1, 0.5)', stagger: 0.05, scrollTrigger: scrollConfig }
        );
        break;
      }

      case 'apple-shimmer': {
        el.style.backgroundImage = 'linear-gradient(60deg, rgba(255,255,255,0.1) 20%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(255,255,255,0.1) 80%)';
        el.style.backgroundSize = '200% auto';
        el.style.color = 'transparent';
        el.style.webkitBackgroundClip = 'text';
        el.style.backgroundClip = 'text';
        el.style.webkitTextFillColor = 'transparent';
        
        gsap.to(el, {
          backgroundPosition: '200% center',
          duration: 3,
          repeat: -1,
          ease: 'none'
        });
        break;
      }

      case 'elastic-hover-spread': {
        const text = el.innerText;
        el.innerHTML = '';
        el.style.display = 'inline-block';
        const spans = [];
        text.split('').forEach(char => {
          const span = document.createElement('span');
          span.innerText = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          span.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
          el.appendChild(span);
          spans.push(span);
        });
        
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          spans.forEach(span => {
            const spanRect = span.getBoundingClientRect();
            const spanX = spanRect.left - rect.left + spanRect.width / 2;
            const dist = mouseX - spanX;
            if(Math.abs(dist) < 150) {
              const push = dist > 0 ? -20 : 20;
              const factor = 1 - Math.abs(dist) / 150;
              span.style.transform = `translateX(${push * factor}px)`;
            } else {
              span.style.transform = 'translateX(0)';
            }
          });
        });
        el.addEventListener('mouseleave', () => {
          spans.forEach(span => span.style.transform = 'translateX(0)');
        });
        break;
      }

      case 'focus-morph': {
        const words = (el.dataset.words || 'FOCUS,MORPH').split(',');
        if(words.length < 2) break;
        el.innerHTML = '';
        el.style.position = 'relative';
        el.style.display = 'inline-block';
        el.style.height = '1em';
        el.style.width = '100%';
        
        const w1 = document.createElement('span');
        w1.innerText = words[0];
        w1.style.position = 'absolute';
        w1.style.left = '50%';
        w1.style.top = '50%';
        w1.style.transform = 'translate(-50%, -50%)';
        
        const w2 = document.createElement('span');
        w2.innerText = words[1];
        w2.style.position = 'absolute';
        w2.style.left = '50%';
        w2.style.top = '50%';
        w2.style.transform = 'translate(-50%, -50%)';
        
        el.appendChild(w1);
        el.appendChild(w2);
        
        const tl = gsap.timeline({ repeat: -1 });
        tl.fromTo(w1, { filter: 'blur(0px)', scale: 1, opacity: 1 }, { filter: 'blur(20px)', scale: 1.5, opacity: 0, duration: 1.5, ease: 'power2.inOut', delay: 1 })
          .fromTo(w2, { filter: 'blur(20px)', scale: 0.5, opacity: 0 }, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 1.5, ease: 'power2.inOut' }, '<')
          .to(w2, { filter: 'blur(20px)', scale: 1.5, opacity: 0, duration: 1.5, ease: 'power2.inOut', delay: 1 })
          .fromTo(w1, { filter: 'blur(20px)', scale: 0.5, opacity: 0 }, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: 1.5, ease: 'power2.inOut' }, '<');
        break;
      }

      // --- NEW IMAGE EFFECTS ---
      case 'vertical-film-strips': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const speed = parseFloat(el.dataset.speed || '1.2');
        const cols = 5;
        const strips = [];
        for (let i = 0; i < cols; i++) {
          const strip = document.createElement('div');
          strip.style.position = 'absolute';
          strip.style.top = '0';
          strip.style.left = `${(i / cols) * 100}%`;
          strip.style.width = `${100 / cols}%`;
          strip.style.height = '100%';
          strip.style.overflow = 'hidden';
          
          const clone = img.cloneNode();
          clone.style.position = 'absolute';
          clone.style.top = '0';
          clone.style.left = `-${i * 100}%`;
          clone.style.width = `${cols * 100}%`;
          clone.style.height = '100%';
          clone.style.objectFit = 'cover';
          
          strip.appendChild(clone);
          el.appendChild(strip);
          strips.push({ el: strip, index: i });
        }
        
        img.style.opacity = 0;
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        strips.forEach(strip => {
          const yStart = strip.index % 2 === 0 ? '-100%' : '100%';
          tl.fromTo(strip.el, { y: yStart }, { y: '0%', duration: speed, ease: 'power3.out' }, 0);
        });
        tl.set(img, { opacity: 1 });
        break;
      }

      case 'exposure-flash': {
        const img = el.querySelector('img');
        if (!img) break;
        
        const speed = parseFloat(el.dataset.speed || '1.5');
        gsap.fromTo(img, 
          { filter: 'brightness(5) contrast(0.2) saturate(0)' },
          { filter: 'brightness(1) contrast(1) saturate(1)', duration: speed, ease: 'power2.out', scrollTrigger: scrollConfig }
        );
        break;
      }

      case 'elevator-doors': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const speed = parseFloat(el.dataset.speed || '1.2');
        
        const doorLeft = document.createElement('div');
        const doorRight = document.createElement('div');
        [doorLeft, doorRight].forEach(door => {
          door.style.position = 'absolute';
          door.style.top = '0';
          door.style.width = '50.1%';
          door.style.height = '100%';
          door.style.backgroundColor = 'var(--bg-color)';
          door.style.zIndex = '10';
        });
        doorLeft.style.left = '0';
        doorRight.style.right = '0';
        
        el.appendChild(doorLeft);
        el.appendChild(doorRight);
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        tl.fromTo(doorLeft, { xPercent: 0 }, { xPercent: -100, duration: speed, ease: 'power3.inOut' }, 0)
          .fromTo(doorRight, { xPercent: 0 }, { xPercent: 100, duration: speed, ease: 'power3.inOut' }, 0)
          .fromTo(img, { scale: 1.2 }, { scale: 1, duration: speed * 1.25, ease: 'power2.out' }, 0);
        break;
      }

      case 'glitch-blocks-reveal': {
        const img = el.querySelector('img');
        if (!img) break;
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        
        const speed = parseFloat(el.dataset.speed || '1.0');
        const cols = 10;
        const rows = 10;
        const grid = document.createElement('div');
        grid.style.position = 'absolute';
        grid.style.top = '0';
        grid.style.left = '0';
        grid.style.width = '100%';
        grid.style.height = '100%';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        grid.style.zIndex = '10';
        
        const blocks = [];
        for(let i=0; i<cols*rows; i++) {
          const b = document.createElement('div');
          b.style.backgroundColor = 'var(--bg-color)';
          b.style.width = '101%';
          b.style.height = '101%';
          grid.appendChild(b);
          blocks.push(b);
        }
        el.appendChild(grid);
        
        const tl = gsap.timeline({ scrollTrigger: scrollConfig });
        
        blocks.forEach(b => {
          tl.to(b, { opacity: 0, duration: 0.1, delay: Math.random() * (speed * 0.5) }, 0);
          tl.to(b, { opacity: 1, duration: 0.1 }, ">");
        });
        
        tl.to(blocks, { opacity: 0, duration: speed * 0.3, stagger: { amount: speed * 0.5, from: 'random' } }, speed * 0.5);
        tl.set(grid, { display: 'none' });
        break;
      }

      // --- АНИМАЦИЯ СПИСКОВ ---
      case 'list-fade':
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.children,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay }
          );
        break;

      case 'list-flip':
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.children,
            { rotationX: -90, opacity: 0, transformOrigin: "50% 0%" },
            { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.5)', delay }
          );
        break;

      case 'list-slide-mask':
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.children,
            { clipPath: 'inset(0% 100% 0% 0%)', x: -30, opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0%)', x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay }
          );
        break;

      case 'list-pop':
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.children,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)', delay }
          );
        break;

      case 'list-skew':
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.children,
            { skewY: 10, y: 50, opacity: 0 },
            { skewY: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power4.out', delay }
          );
        break;

      case 'list-blur':
        gsap.timeline({ scrollTrigger: scrollConfig })
          .fromTo(el.children,
            { filter: 'blur(15px)', y: 20, opacity: 0 },
            { filter: 'blur(0px)', y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay }
          );
        break;

      // --- NEW: LISTS, CARDS, NEWS ---
      case 'list-accordion':
        gsap.fromTo(el.children,
          { clipPath: 'inset(0 0 100% 0)', opacity: 0, y: -20 },
          { clipPath: 'inset(0 0 0% 0)', opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: scrollConfig }
        );
        break;

      case 'list-zigzag':
        gsap.fromTo(el.children,
          { x: (i) => i % 2 === 0 ? -50 : 50, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: scrollConfig }
        );
        break;

      case 'list-stripe-mask':
        gsap.fromTo(el.children,
          { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
          { clipPath: 'inset(0% 0 0% 0)', opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: scrollConfig }
        );
        break;

      case 'cards-unpack':
        gsap.fromTo(el.children,
          { x: (i) => (1 - (i % 3)) * 150, y: 50, rotation: (i) => ((i % 3) - 1) * 15, scale: 0.8, opacity: 0 },
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, stagger: 0.1, duration: 1, ease: 'back.out(1.2)', scrollTrigger: scrollConfig }
        );
        break;

      case 'grid-3d-flip':
        gsap.fromTo(el.children,
          { rotateX: -90, opacity: 0, transformOrigin: 'bottom center' },
          { rotateX: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)', scrollTrigger: scrollConfig }
        );
        break;

      case 'news-split-merge':
        const tlSplit = gsap.timeline({ scrollTrigger: scrollConfig });
        Array.from(el.children).forEach((news, idx) => {
           const img = news.querySelector('[data-anim-img]') || news.querySelector('.photo-card-img img');
           const text = news.querySelector('[data-anim-text]') || news.querySelector('.photo-card-title');
           const offset = idx * 0.2;
           if(img && text) {
             tlSplit.fromTo(img, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, offset)
                    .fromTo(text, { yPercent: -50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, offset);
           }
        });
        break;

      case 'news-focus':
        gsap.fromTo(el.children,
          { scale: 1.2, filter: 'blur(15px)', opacity: 0 },
          { scale: 1, filter: 'blur(0px)', opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: scrollConfig }
        );
        break;

      case 'card-spec-cascade':
        const tlCascade = gsap.timeline({ scrollTrigger: scrollConfig });
        Array.from(el.children).forEach((card, i) => {
          const img = card.querySelector('[data-anim-img]') || card.querySelector('img');
          const title = card.querySelector('[data-anim-title]') || card.querySelector('h1, h2, h3, h4, h5, h6');
          let specs = card.querySelectorAll('[data-anim-list-item]');
          if (!specs.length) specs = card.querySelectorAll('li');
          
          const offset = i * 0.3;
          tlCascade.fromTo(card, {y: 50, opacity: 0}, {y: 0, opacity: 1, duration: 0.6}, offset);
          if (img) tlCascade.fromTo(img, {scale: 1.2}, {scale: 1, duration: 0.8, ease: 'power2.out'}, offset);
          if (title) tlCascade.fromTo(title, {x: -20, opacity: 0}, {x: 0, opacity: 1, duration: 0.4}, offset + 0.2);
          if (specs.length) {
            tlCascade.fromTo(specs, {x: 20, opacity: 0}, {x: 0, opacity: 1, duration: 0.4, stagger: 0.1}, offset + 0.3);
          }
        });
        break;

      case 'card-service-pop':
        const tlService = gsap.timeline({ scrollTrigger: scrollConfig });
        Array.from(el.children).forEach((card, i) => {
          const title = card.querySelector('[data-anim-title]') || card.querySelector('h1, h2, h3, h4, h5, h6');
          const desc = card.querySelector('[data-anim-desc]') || card.querySelector('p');
          const btn = card.querySelector('[data-anim-btn]') || card.querySelector('button, a, svg');
          
          const offset = i * 0.2;
          tlService.fromTo(card, {scale: 0.9, opacity: 0}, {scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)'}, offset);
          
          const texts = [];
          if (title) texts.push(title);
          if (desc) texts.push(desc);
          if (texts.length) {
            tlService.fromTo(texts, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.4, stagger: 0.1}, offset + 0.2);
          }
          if (btn) {
            tlService.fromTo(btn, {scale: 0, rotation: -90}, {scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)'}, offset + 0.4);
          }
        });
        break;

      case 'card-img-expand':
        const tlExpand = gsap.timeline({ scrollTrigger: scrollConfig });
        Array.from(el.children).forEach((card, i) => {
          const img = card.querySelector('[data-anim-img]') || card.querySelector('img');
          const imgWrap = card.querySelector('[data-anim-wrap]') || (img ? img.parentElement : null);
          
          const offset = i * 0.3;
          tlExpand.fromTo(card, {opacity: 0, y: 50}, {opacity: 1, y: 0, duration: 0.6}, offset);
          if (imgWrap) {
            tlExpand.fromTo(imgWrap, {clipPath: 'inset(0 0 100% 0)'}, {clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut'}, offset + 0.2);
          }
          if (img) {
            tlExpand.fromTo(img, {scale: 1.2}, {scale: 1, duration: 0.8, ease: 'power3.out'}, offset + 0.2);
          }
        });
        break;
    }
  });

  // --- 2. Улучшенная система параллаксов ---
  const parallaxElements = document.querySelectorAll('[data-parallax], [data-parallax-x], [data-parallax-scale], [data-parallax-rotate], [data-parallax-opacity]');
  
  parallaxElements.forEach((el) => {
    const pY = parseFloat(el.dataset.parallax || '0');
    const pX = parseFloat(el.dataset.parallaxX || '0');
    const pScale = el.hasAttribute('data-parallax-scale') ? parseFloat(el.dataset.parallaxScale) : null;
    const pRotate = parseFloat(el.dataset.parallaxRotate || '0');
    const pOpacity = el.hasAttribute('data-parallax-opacity') ? parseFloat(el.dataset.parallaxOpacity) : null;

    const config = {
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el.parentElement || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    };

    if (pY) config.y = pY;
    if (pX) config.x = pX;
    if (pScale !== null) config.scale = pScale;
    if (pRotate) config.rotation = pRotate;
    if (pOpacity !== null) config.opacity = pOpacity;

    gsap.to(el, config);
  });

  // --- 3. Параллакс изображений внутри блока (Image Parallax) ---
  const imageParallaxElements = document.querySelectorAll('[data-parallax-image]');
  imageParallaxElements.forEach(el => {
    const speed = parseFloat(el.dataset.parallaxImage || '15');
    
    gsap.fromTo(el,
      { yPercent: -speed },
      {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement, // Контейнер изображения
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // --- 4. Horizontal Scroll (Pinned) ---
  const horizontalSections = document.querySelectorAll('[data-pin="horizontal"]');
  horizontalSections.forEach(sec => {
    const wrapper = sec.querySelector('.horizontal-wrapper');
    if (wrapper) {
      const scrollWidth = wrapper.scrollWidth - window.innerWidth;
      gsap.to(wrapper, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          pin: true,
          scrub: 1,
          start: "top top",
          end: `+=${scrollWidth}`,
          refreshPriority: 1
        }
      });
    }
  });

  // --- 5. Magnetic UI ---
  const magnetics = document.querySelectorAll('[data-magnetic="true"]');
  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
  });

  // --- 6. Spotlight Hover ---
  const spotlights = document.querySelectorAll('[data-spotlight="true"]');
  spotlights.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--x', `${x}px`);
      el.style.setProperty('--y', `${y}px`);
    });
  });



  // --- 8. Scroll Skew (Trail) ---
  let proxy = { skew: 0 };
  const skewSetter = gsap.quickSetter(".skew-elem", "skewY", "deg");
  const clamp = gsap.utils.clamp(-15, 15);

  if (document.querySelector('.skew-elem')) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -300);
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew;
          gsap.to(proxy, {
            skew: 0, 
            duration: 0.8, 
            ease: "power3", 
            overwrite: true, 
            onUpdate: () => skewSetter(proxy.skew)
          });
        }
      }
    });
  }

  // --- 9. Continuous Float ---
  const floatElements = document.querySelectorAll('[data-float]');
  floatElements.forEach(el => {
    let duration = 2;
    if (el.dataset.float === 'slow') duration = 3;
    if (el.dataset.float === 'fast') duration = 1;
    
    gsap.to(el, {
      y: -15,
      duration: duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  });

  // --- 10. Section Curtain & Stacking Cards ---
  const curtainSections = document.querySelectorAll('[data-curtain="true"]');
  curtainSections.forEach((sec) => {
    gsap.to(sec, {
      scale: 0.9,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        pinSpacing: false
      }
    });
  });

  const stackingCards = document.querySelectorAll('.stacking-card');
  stackingCards.forEach((card, i) => {
    gsap.to(card, {
      scale: 1 - (stackingCards.length - i) * 0.05,
      filter: `brightness(${100 - (stackingCards.length - i) * 15}%)`,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top 100px",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true
      }
    });
  });

  // --- 11. 2D Physics (Matter.js) ---
  const physicsContainer = document.querySelector('[data-physics="gravity"]');
  if (physicsContainer && typeof Matter !== 'undefined') {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          Composite = Matter.Composite,
          Bodies = Matter.Bodies;

    const engine = Engine.create();
    
    // Теги для физики
    const domBodies = [];
    const tagElements = physicsContainer.querySelectorAll('.physics-tag');

    // Добавляем DOM-элементы
    tagElements.forEach((el, i) => {
      // Ждем пока браузер отрендерит элемент, чтобы получить его ширину
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      
      // Создаем физическое тело (раскидываем случайно по ширине контейнера)
      const x = Math.random() * (physicsContainer.offsetWidth - width) + width/2;
      const y = -100 - (Math.random() * 500); // Спавним выше контейнера
      
      const body = Bodies.rectangle(x, y, width, height, { 
        restitution: 0.6, // Упругость (прыгучесть)
        chamfer: { radius: height / 2 } // Закругление углов для правильного отскока
      });
      
      domBodies.push({ el, body, width, height });
      Composite.add(engine.world, body);
    });

    // Создаем границы (пол, стены)
    let cw = physicsContainer.offsetWidth;
    let ch = physicsContainer.offsetHeight;
    const wallOptions = { isStatic: true, render: { visible: false } };
    
    // Увеличили толщину стен до 200px для защиты от проваливания на высоких скоростях
    const floor = Bodies.rectangle(cw/2, ch + 100, cw * 5, 200, wallOptions); 
    const ceiling = Bodies.rectangle(cw/2, -1000, cw * 5, 200, wallOptions);
    const leftWall = Bodies.rectangle(-100, ch/2, 200, ch * 5, wallOptions);
    const rightWall = Bodies.rectangle(cw + 100, ch/2, 200, ch * 5, wallOptions);

    // Убраны угловые круги (leftCorner, rightCorner), так как они создавали невидимые барьеры внутри контейнера
    Composite.add(engine.world, [floor, ceiling, leftWall, rightWall]);

    // Обновляем границы при ресайзе
    window.addEventListener('resize', () => {
      cw = physicsContainer.offsetWidth;
      ch = physicsContainer.offsetHeight;
      Matter.Body.setPosition(floor, { x: cw / 2, y: ch + 100 });
      Matter.Body.setPosition(ceiling, { x: cw / 2, y: -1000 });
      Matter.Body.setPosition(leftWall, { x: -100, y: ch / 2 });
      Matter.Body.setPosition(rightWall, { x: cw + 100, y: ch / 2 });
    });

    // Добавляем возможность хватать мышкой
    const mouse = Mouse.create(physicsContainer);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(engine.world, mouseConstraint);

    // Оптимизация: запускаем физику только когда секция видна
    let physicsRunning = false;
    const runner = Runner.create();
    
    ScrollTrigger.create({
      trigger: physicsContainer,
      start: "top bottom",
      onEnter: () => {
        if (!physicsRunning) {
          Runner.run(runner, engine);
          physicsRunning = true;
          // Цикл обновления DOM
          gsap.ticker.add(updateDOMPhysics);
        }
      }
    });

    function updateDOMPhysics() {
      domBodies.forEach(obj => {
        // Синхронизируем позицию и угол DOM-элемента с физическим телом
        const { x, y } = obj.body.position;
        gsap.set(obj.el, {
          x: x - obj.width / 2,
          y: y - obj.height / 2,
          rotation: obj.body.angle * (180 / Math.PI)
        });
      });
    }
  } // Закрываем блок if (physicsContainer...)

  // --- 13. Новые Hover эффекты и Inline Image ---
  
  // 13.1 Inline Image Reveal
  document.querySelectorAll('[data-inline-image]').forEach(el => {
    const url = el.dataset.inlineImage;
    el.innerHTML = `<span class="inline-image-wrapper"><img src="${url}" alt=""></span>${el.innerHTML}`;
    
    gsap.to(el.querySelector('.inline-image-wrapper'), {
      width: '3em', // ширина раскрывающегося изображения
      ease: 'power3.out',
      duration: 1.2,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // 13.2 Hover Pan Effect (Окно)
  document.querySelectorAll('[data-hover="pan"]').forEach(el => {
    const img = el.querySelector('img');
    if(!img) return;
    
    el.style.overflow = 'hidden';
    el.style.position = 'relative';
    // Увеличиваем изображение, чтобы было куда двигать
    gsap.set(img, { scale: 1.15, transformOrigin: 'center', willChange: 'transform' });
    
    let xTo = gsap.quickTo(img, "x", {duration: 0.6, ease: "power3.out"}),
        yTo = gsap.quickTo(img, "y", {duration: 0.6, ease: "power3.out"});
        
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      // нормализованные координаты от -0.5 до 0.5
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Двигаем изображение в противоположную сторону (эффект параллакса окна)
      xTo(x * -50); 
      yTo(y * -50);
    });
    
    el.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });

  // 13.3 Hover Slice Spread
  document.querySelectorAll('[data-hover="slice-spread"]').forEach(el => {
    const origImg = el.querySelector('img');
    if(!origImg) return;
    
    origImg.style.opacity = 0;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.backgroundColor = '#000'; // Задний фон, который будет просвечивать
    
    const slicesCount = 5;
    const slices = [];
    const widthPct = 100 / slicesCount;
    
    for(let i=0; i<slicesCount; i++) {
      const clone = origImg.cloneNode();
      clone.style.opacity = 1;
      clone.style.position = 'absolute';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.width = '100%';
      clone.style.height = '100%';
      clone.style.objectFit = 'cover';
      clone.style.willChange = 'transform';
      clone.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      
      const left = i * widthPct;
      const right = 100 - ((i + 1) * widthPct);
      clone.style.clipPath = `inset(0% ${right}% 0% ${left}%)`;
      
      el.appendChild(clone);
      slices.push({ el: clone, index: i });
    }
    
    el.addEventListener('mouseenter', () => {
      slices.forEach(slice => {
        // Вычисляем сдвиг от центра. Центральный слайс (index 2) стоит на месте.
        // Индексы: 0, 1, 2, 3, 4 -> сдвиги: -20px, -10px, 0, 10px, 20px
        const offset = (slice.index - Math.floor(slicesCount / 2)) * 15;
        slice.el.style.transform = `translateX(${offset}px) scale(1.05)`;
      });
    });
    
    el.addEventListener('mouseleave', () => {
      slices.forEach(slice => {
        slice.el.style.transform = `translateX(0px) scale(1)`;
      });
    });
  });

  // 13.4 Flashlight Mask
  document.querySelectorAll('[data-interactive="flashlight"]').forEach(el => {
    const overlay = el.querySelector('.flashlight-overlay');
    if (!overlay) return;

    // Регистрация CSS-переменной не всегда работает во всех браузерах, 
    // поэтому анимируем через прокси-объект GSAP
    let proxy = { radius: 0 };
    
    el.addEventListener('mouseenter', () => {
      gsap.to(proxy, { 
        radius: 150, 
        duration: 0.3, 
        onUpdate: () => overlay.style.setProperty('--radius', `${proxy.radius}px`)
      });
    });

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlay.style.setProperty('--x', `${x}px`);
      overlay.style.setProperty('--y', `${y}px`);
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(proxy, { 
        radius: 0, 
        duration: 0.3, 
        onUpdate: () => overlay.style.setProperty('--radius', `${proxy.radius}px`)
      });
    });
  });

  // 13.5 Mouse Trail
  const trailContainers = document.querySelectorAll('[data-interactive="mouse-trail"]');
  trailContainers.forEach(container => {
    let images = [];
    try {
      images = JSON.parse(container.dataset.images || '[]');
    } catch(e) { return; }
    
    if (images.length === 0) return;
    
    let globalIndex = 0;
    let lastPoint = { x: 0, y: 0 };
    let distanceThreshold = 80;
    
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const distance = Math.hypot(x - lastPoint.x, y - lastPoint.y);
      if (distance > distanceThreshold) {
        lastPoint = { x, y };
        
        const img = document.createElement('img');
        img.src = images[globalIndex % images.length];
        img.className = 'trail-img';
        img.style.left = `${x - 75}px`;
        img.style.top = `${y - 100}px`;
        img.style.width = '150px';
        img.style.height = '200px';
        
        container.appendChild(img);
        globalIndex++;
        
        gsap.fromTo(img, 
          { scale: 0.5, rotation: gsap.utils.random(-15, 15) },
          { 
            scale: 1, 
            opacity: 0, 
            y: "+=100", 
            duration: 1.5, 
            ease: "power2.out", 
            onComplete: () => img.remove() 
          }
        );
      }
    });
  });

  // 13.6 Elastic String
  document.querySelectorAll('[data-interactive="elastic"]').forEach(el => {
    const path = el.querySelector('path');
    if (!path) return;
    
    const startY = 150; // Центр SVG viewBox (viewBox="0 0 1000 300")
    let controlY = startY;
    let isDragging = false;
    
    // Начальное состояние
    gsap.set(path, { attr: { d: `M 0 ${startY} Q 500 ${controlY} 1000 ${startY}` } });
    
    el.addEventListener('mousedown', () => { isDragging = true; });
    
    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // Эффект вибрации струны
        gsap.to(path, {
          attr: { d: `M 0 ${startY} Q 500 ${startY} 1000 ${startY}` },
          duration: 1.5,
          ease: "elastic.out(1, 0.15)"
        });
      }
    });
    
    el.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Динамически вычисляем rect, чтобы учитывать скролл и ресайз
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      
      // Маппинг координат мыши (контейнер) в координаты SVG
      // rect.height соответствует 300 в viewBox
      const mappedY = y * (300 / rect.height);
      
      controlY = gsap.utils.clamp(startY - 150, startY + 150, mappedY);
      
      gsap.to(path, {
        attr: { d: `M 0 ${startY} Q 500 ${controlY} 1000 ${startY}` },
        duration: 0.1,
        ease: "none"
      });
    });
  });

  // 13.7 Repelling Grid (Matter.js)
  document.querySelectorAll('[data-interactive="repel"]').forEach(container => {
    // Ждем, пока контейнер получит размеры
    const rect = container.getBoundingClientRect();
    if (rect.width === 0) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Constraint = Matter.Constraint;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    const dots = [];
    
    // Сетка 15x8
    const cols = 15;
    const rows = 8;
    const spacingX = rect.width / cols;
    const spacingY = rect.height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) * spacingX;
        const y = (r + 0.5) * spacingY;

        // Физическое тело (точка)
        const body = Bodies.circle(x, y, 4, {
          frictionAir: 0.15,
          restitution: 0.8,
          density: 0.05
        });

        // Пружина, возвращающая точку на исходную позицию
        const constraint = Constraint.create({
          pointA: { x, y },
          bodyB: body,
          pointB: { x: 0, y: 0 },
          stiffness: 0.015,
          damping: 0.1
        });

        Composite.add(engine.world, [body, constraint]);

        // DOM-элемент
        const dotEl = document.createElement('div');
        dotEl.className = 'repelling-dot';
        // Устанавливаем начальную позицию (margin в CSS центрирует)
        dotEl.style.transform = `translate(${x}px, ${y}px)`;
        container.appendChild(dotEl);

        dots.push({ body, el: dotEl, startX: x, startY: y });
      }
    }

    let mousePos = { x: -1000, y: -1000 };
    
    container.addEventListener('mousemove', (e) => {
      const cRect = container.getBoundingClientRect();
      mousePos.x = e.clientX - cRect.left;
      mousePos.y = e.clientY - cRect.top;
    });
    
    container.addEventListener('mouseleave', () => {
      mousePos = { x: -1000, y: -1000 };
    });

    // Применяем силы отталкивания перед каждым шагом физики
    Matter.Events.on(engine, 'beforeUpdate', () => {
      dots.forEach(dot => {
        const dx = dot.body.position.x - mousePos.x;
        const dy = dot.body.position.y - mousePos.y;
        const dist = Math.hypot(dx, dy);
        
        const radius = 120; // Радиус отталкивания
        if (dist < radius && dist > 0) {
          const forceMag = (radius - dist) * 0.0001;
          Matter.Body.applyForce(dot.body, dot.body.position, {
            x: (dx / dist) * forceMag,
            y: (dy / dist) * forceMag
          });
        }
        
        // Синхронизация DOM
        dot.el.style.transform = `translate(${dot.body.position.x}px, ${dot.body.position.y}px)`;
      });
    });

    // Запускаем движок
    const runner = Runner.create();
    Runner.run(runner, engine);
  });

  // --- 14. Обновление ScrollTrigger после загрузки картинок ---
  // Проверяем, загружена ли уже страница
  if (document.readyState === 'complete') {
    ScrollTrigger.refresh();
  } else {
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  // Показываем элементы после инициализации GSAP (предотвращение FOUC)
  document.documentElement.classList.remove('js-loading');
};

// --- КОПИРОВАНИЕ ЯКОРЯ ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.copy-anchor-btn');
  if (btn) {
    const anchor = btn.getAttribute('data-anchor');
    if (anchor) {
      const url = new URL(window.location.href);
      url.hash = anchor;
      navigator.clipboard.writeText(url.toString()).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Скопировано`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2000);
      });
    }
  }
});