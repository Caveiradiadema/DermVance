// Arquivo: /depoimentos.js
// (Este é o "Garçom": ele roda no navegador do visitante)

document.addEventListener('DOMContentLoaded', () => {
  // 1. O Garçom sabe o endereço da cozinha
  const apiUrl = '/api/depoimentos';

  // Função para criar o HTML das estrelas (usando ícones do Font Awesome)
  function getStarsHtml(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        starsHtml += `<i class="fa-solid fa-star"></i>`; // Estrela cheia
      } else {
        starsHtml += `<i class="fa-regular fa-star"></i>`; // Estrela vazia
      }
    }
    return `<div class="stars">${starsHtml}</div>`;
  }

  // Função principal que busca e exibe os depoimentos
  async function carregarDepoimentos() {
    try {
      // 2. O Garçom vai até a cozinha e faz o pedido
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Cozinha fechada! Não foi possível buscar os depoimentos.');
      }
      const data = await response.json();
      
      // 3. O Garçom pega o "prato pronto" (os dados)
      const reviews = data.result.reviews;
      const swiperWrapper = document.querySelector('.testimonials-slider .swiper-wrapper');

      if (reviews && reviews.length > 0) {
        
        // 4. Ele monta cada depoimento em um "prato" (card de HTML)
        swiperWrapper.innerHTML = reviews.map(review => `
          <div class="swiper-slide">
            <div class="depoimento-card">
              <div class="depoimento-header">
                <img src="${review.profile_photo_url}" alt="Foto de ${review.author_name}" class="depoimento-foto" loading="lazy">
                <div class="depoimento-info">
                  <span class="nome">${review.author_name}</span>
                  <span class="data">${review.relative_time_description}</span>
                </div>
              </div>
              ${getStarsHtml(review.rating)}
              <p class="depoimento-texto">${review.text}</p>
            </div>
          </div>
        `).join('');

        // 5. Ele organiza a mesa (inicia o carrossel interativo)
        new Swiper('.testimonials-slider', {
          loop: true,
          slidesPerView: 1,
          spaceBetween: 30,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 }
          }
        });

      } else {
         // Se não houver depoimentos, o Garçom esconde a mesa toda
         document.querySelector('.testimonials-section').style.display = 'none';
      }
    } catch (error) {
      console.error("O Garçom tropeçou:", error);
      // Se der erro, o Garçom também esconde a mesa
      document.querySelector('.testimonials-section').style.display = 'none';
    }
  }

  carregarDepoimentos();
});