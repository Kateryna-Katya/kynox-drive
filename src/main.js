document.addEventListener('DOMContentLoaded', () => {

  // 0. Инициализация иконок
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // 1. Плавный скролл (Lenis)
  const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
  });

  function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Мобильное меню
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.header__link');

  if (burgerBtn && navMenu) {
      burgerBtn.addEventListener('click', () => {
          navMenu.classList.toggle('is-active');

          // Анимация иконки бургера (опционально смена цвета)
          const icon = burgerBtn.querySelector('svg'); // Lucide создает svg
          if (navMenu.classList.contains('is-active')) {
              burgerBtn.style.color = 'var(--color-primary)';
          } else {
              burgerBtn.style.color = 'var(--color-text-main)';
          }
      });

      // Закрытие меню при клике на ссылку
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              navMenu.classList.remove('is-active');
              burgerBtn.style.color = 'var(--color-text-main)';
          });
      });
  }

  // 3. GSAP Setup
  gsap.registerPlugin(ScrollTrigger);

  // 4. Three.js Hero Background (3D Анимация)
  const initThreeJS = () => {
      const canvasContainer = document.getElementById('hero-canvas');
      if (!canvasContainer) return; // Если секции нет (например, на страницах Privacy), выходим

      // Сцена
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xf0f9ff, 10, 50); // Цвет тумана = цвет фона сайта

      // Камера
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;

      // Рендерер
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      canvasContainer.appendChild(renderer.domElement);

      // Объект: Икосаэдр (Кристалл)
      const geometry = new THREE.IcosahedronGeometry(10, 2);
      const material = new THREE.MeshBasicMaterial({
          color: 0x0284c7, // --color-primary
          wireframe: true,
          transparent: true,
          opacity: 0.3
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Частицы вокруг
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 200;
      const posArray = new Float32Array(particlesCount * 3);

      for(let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 60;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
          size: 0.15,
          color: 0x0369a1,
          transparent: true,
          opacity: 0.6
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      // Интерактив с мышью
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      document.addEventListener('mousemove', (event) => {
          mouseX = (event.clientX - windowHalfX);
          mouseY = (event.clientY - windowHalfY);
      });

      // Цикл анимации
      const animate = () => {
          requestAnimationFrame(animate);

          targetX = mouseX * 0.001;
          targetY = mouseY * 0.001;

          sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
          sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

          sphere.rotation.z += 0.002;
          particlesMesh.rotation.y -= 0.001;

          renderer.render(scene, camera);
      };

      animate();

      // Появление канваса
      gsap.to(canvasContainer, { opacity: 1, duration: 2, delay: 0.5 });

      // Ресайз окна
      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
      });
  };

  if (typeof THREE !== 'undefined') {
      initThreeJS();
  }

  // 5. GSAP Animations: Hero Entry
  if (document.querySelector('.hero')) {
      const tlHero = gsap.timeline();
      tlHero.from('.hero__tag', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
            .from('.hero__title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
            .from('.hero__subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .from('.hero__actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
            .from('.hero__scroll', { opacity: 0, duration: 1 }, '-=0.4');
  }

  // 6. GSAP Animations: Sections Reveal
  const sectionTitles = document.querySelectorAll('.section-title');
  if (sectionTitles.length > 0) {
      // Общая анимация для заголовков
      // (Опционально, если хочешь анимировать каждый заголовок отдельно)
  }

  // About Section
  if (document.querySelector('.about')) {
      gsap.from('.about__content > *', {
          scrollTrigger: { trigger: '.about', start: 'top 80%' },
          y: 30, opacity: 0, duration: 0.8, stagger: 0.1
      });
  }

  // Stats Counter
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
      const target = +stat.getAttribute('data-count');
      gsap.to(stat, {
          scrollTrigger: { trigger: '.about__stats', start: 'top 85%' },
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: 'power2.out'
      });
  });

  // Benefits Cards
  if (document.querySelector('.benefits')) {
      gsap.from('.benefit-card', {
          scrollTrigger: { trigger: '.benefits', start: 'top 75%' },
          y: 50, opacity: 0, duration: 0.8, stagger: 0.2
      });
  }

  // 7. Contact Form Logic & Captcha
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMessage');
  const phoneInput = document.getElementById('phone');
  const captchaInput = document.getElementById('captcha');
  const captchaLabel = document.getElementById('captchaLabel');

  if (form) {
      // Генерация примера
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
      const correctAnswer = num1 + num2;

      // Валидация телефона (только цифры)
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9+]/g, '');
      });

      // Обработка отправки
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          let isValid = true;

          // 1. Проверка полей
          const inputs = form.querySelectorAll('input[required]');
          inputs.forEach(input => {
              const parent = input.closest('.form-group');
              if(!input.value.trim()) {
                  parent?.classList.add('error');
                  isValid = false;
              } else {
                  parent?.classList.remove('error');
              }
          });

          // 2. Проверка капчи
          const captchaParent = captchaInput.closest('.form-group');
          if (parseInt(captchaInput.value) !== correctAnswer) {
              captchaParent.classList.add('error');
              captchaParent.querySelector('.form-error').textContent = 'Неверный ответ';
              isValid = false;
          } else {
              captchaParent.classList.remove('error');
          }

          if (isValid) {
              // Имитация отправки
              const btn = form.querySelector('button[type="submit"]');
              const originalText = btn.innerHTML;
              btn.innerHTML = 'Отправка...';
              btn.disabled = true;

              setTimeout(() => {
                  successMsg.classList.add('visible');
                  form.reset();
                  // Сбрасываем кнопку (хотя сообщение перекрывает форму)
                  btn.innerHTML = originalText;
                  btn.disabled = false;
              }, 1500);
          }
      });

      // Убираем ошибку при фокусе
      form.querySelectorAll('input').forEach(input => {
          input.addEventListener('focus', () => {
              input.closest('.form-group')?.classList.remove('error');
          });
      });
  }

  // 8. Cookie Popup
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  if (cookiePopup && acceptBtn) {
      // Показываем через 2 секунды, если нет записи
      setTimeout(() => {
          if (!localStorage.getItem('cookiesAccepted')) {
              cookiePopup.classList.add('is-active');
          }
      }, 2000);

      acceptBtn.addEventListener('click', () => {
          cookiePopup.classList.remove('is-active');
          localStorage.setItem('cookiesAccepted', 'true');
      });
  }
});