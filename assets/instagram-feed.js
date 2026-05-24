(function () {
  const sections = document.querySelectorAll('[data-instagram-feed]');

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(value));
    } catch (error) {
      return value || '';
    }
  }

  function mediaLabel(type) {
    if (type === 'VIDEO' || type === 'REELS') return 'Reel';
    if (type === 'CAROUSEL_ALBUM') return 'Carousel';
    return 'Post';
  }

  function createMediaMarkup(item, autoplay) {
    const isVideo = item.media_type === 'VIDEO' || item.media_type === 'REELS';
    const thumb = item.thumbnail_url || item.media_url;

    return `
      <article class="instagram-feed-card" tabindex="0" data-instagram-card='${JSON.stringify(item)}'>
        <div class="instagram-feed-media">
          <span class="instagram-feed-badge">${mediaLabel(item.media_type)}</span>
          ${
            isVideo
              ? `<video ${autoplay ? 'autoplay loop muted playsinline' : 'controls'} preload="metadata" poster="${thumb}">
                  <source src="${item.media_url}">
                 </video>`
              : `<img src="${thumb}" alt="${(item.caption || 'Instagram media').replace(/"/g, '&quot;')}" loading="lazy">`
          }
        </div>
        <div class="instagram-feed-content">
          <p class="instagram-feed-caption">${item.caption ? item.caption.slice(0, 110) : 'Instagram media'}</p>
          <div class="instagram-feed-meta">
            <span>${formatDate(item.timestamp)}</span>
            <span>${mediaLabel(item.media_type)}</span>
          </div>
          <a class="instagram-feed-link" href="${item.permalink}" target="_blank" rel="noopener noreferrer">View on Instagram</a>
        </div>
      </article>
    `;
  }

  sections.forEach(async (section) => {
    const apiBase = (section.dataset.apiBase || '').replace(/\/$/, '');
    const layout = section.dataset.layout || 'grid';
    const desktopColumns = section.dataset.columnsDesktop || '4';
    const mobileColumns = section.dataset.columnsMobile || '1';
    const gap = section.dataset.gap || '18';
    const autoplay = section.dataset.autoplay === 'true';
    const track = section.querySelector('[data-instagram-feed-track]');
    const emptyState = section.querySelector('[data-instagram-feed-empty]');
    const modal = section.querySelector('[data-instagram-feed-modal]');
    const modalContent = section.querySelector('[data-instagram-feed-modal-content]');

    track.style.setProperty('--if-columns-desktop', desktopColumns);
    track.style.setProperty('--if-columns-mobile', mobileColumns);
    track.style.setProperty('--if-gap', `${gap}px`);

    if (layout === 'slider') {
      track.classList.add('is-slider');
    }

    try {
      const response = await fetch(`${apiBase}/api/selected-media`);
      const payload = await response.json();
      const items = Array.isArray(payload.data) ? payload.data : [];

      if (!items.length) {
        emptyState.hidden = false;
        return;
      }

      track.innerHTML = items.map((item) => createMediaMarkup(item, autoplay)).join('');

      const cards = track.querySelectorAll('.instagram-feed-card');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.2 }
      );

      cards.forEach((card) => observer.observe(card));

      track.addEventListener('click', (event) => {
        const card = event.target.closest('[data-instagram-card]');
        if (!card) return;

        const item = JSON.parse(card.dataset.instagramCard);
        const isVideo = item.media_type === 'VIDEO' || item.media_type === 'REELS';
        modalContent.innerHTML = isVideo
          ? `<video controls autoplay playsinline poster="${item.thumbnail_url || item.media_url}">
               <source src="${item.media_url}">
             </video>`
          : `<img src="${item.media_url}" alt="${(item.caption || 'Instagram media').replace(/"/g, '&quot;')}">`;
        modal.hidden = false;
      });

      section.querySelectorAll('[data-instagram-feed-close]').forEach((button) => {
        button.addEventListener('click', () => {
          modal.hidden = true;
          modalContent.innerHTML = '';
        });
      });
    } catch (error) {
      emptyState.hidden = false;
      emptyState.innerHTML = '<p>Unable to load Instagram media right now.</p>';
    }
  });
})();