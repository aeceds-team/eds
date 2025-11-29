const YOUTUBE_REGEX = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/;

const getYouTubeId = (url) => {
  const match = url && url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
};

const getYouTubeThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const normalizeDriveUrl = (url) => {
  if (!url || !url.includes('drive.google.com')) return url;

  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  const idMatch = fileMatch ? fileMatch[1] : (url.match(/[?&]id=([\w-]+)/) || [])[1];

  if (!idMatch) return url;

  return `https://drive.google.com/uc?export=download&id=${idMatch}`;
};

const fetchYouTubeTitle = async (url) => {
  try {
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.title || null;
  } catch (error) {
    return null;
  }
};

const createModal = () => {
  const modal = document.createElement('div');
  modal.className = 'video-title-modal';
  modal.innerHTML = `
    <div class="video-title-modal-backdrop"></div>
    <div class="video-title-modal-dialog" role="dialog" aria-modal="true" aria-label="Video player">
      <button type="button" class="video-title-modal-close" aria-label="Close video">×</button>
      <div class="video-title-modal-player" role="document"></div>
    </div>
  `;
  return modal;
};

const buildLocalVideo = (item) => {
  const video = document.createElement('video');
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  video.src = item.url;
  if (item.poster) {
    video.poster = item.poster;
  }
  return video;
};

const buildYoutubeIframe = (item) => {
  const iframe = document.createElement('iframe');
  const params = new URLSearchParams({ autoplay: '1', rel: '0' });
  iframe.src = `https://www.youtube.com/embed/${item.videoId}?${params.toString()}`;
  iframe.title = item.title || 'YouTube video player';
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  return iframe;
};

const parseRow = (row, index) => {
  const titleCell = row.children[0];
  const mediaCell = row.children[1];

  if (!mediaCell) return null;

  const explicitTitle = titleCell ? titleCell.textContent.trim() : '';
  const link = mediaCell.querySelector('a[href]');
  const videoEl = mediaCell.querySelector('video, source');
  const picture = mediaCell.querySelector('picture');
  const img = picture ? picture.querySelector('img') : mediaCell.querySelector('img');
  const textUrl = mediaCell.textContent && mediaCell.textContent.trim();
  const isTextUrl = textUrl && /^https?:\/\//i.test(textUrl);

  const mediaUrl = (videoEl && (videoEl.src || videoEl.getAttribute('src')))
    || (link && link.href)
    || (isTextUrl ? textUrl : '')
    || '';

  const normalizedUrl = normalizeDriveUrl(mediaUrl);

  if (!mediaUrl) return null;

  const youtubeId = getYouTubeId(normalizedUrl);
  const thumbnail = (img && (img.src || img.getAttribute('src'))) || (youtubeId ? getYouTubeThumb(youtubeId) : null);

  return {
    type: youtubeId ? 'youtube' : 'upload',
    videoId: youtubeId,
    url: normalizedUrl,
    title: explicitTitle,
    fallbackTitle: explicitTitle || `Video ${index + 1}`,
    thumbnail,
    poster: img && !youtubeId ? img.src || img.getAttribute('src') : null,
  };
};

export default function decorate(block) {
  const rows = [...block.children];
  const videos = rows.map(parseRow).filter(Boolean);

  block.textContent = '';

  if (!videos.length) return;

  const grid = document.createElement('div');
  grid.className = 'video-title-grid';

  const modal = createModal();
  const player = modal.querySelector('.video-title-modal-player');
  const closeButton = modal.querySelector('.video-title-modal-close');
  let lastFocused;

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('video-title-modal-open');
    player.innerHTML = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  const openModal = (content, title) => {
    player.innerHTML = '';
    player.append(content);
    modal.classList.add('is-open');
    document.body.classList.add('video-title-modal-open');
    lastFocused = document.activeElement;
    requestAnimationFrame(() => closeButton.focus());
    if (title) {
      modal.querySelector('.video-title-modal-dialog').setAttribute('aria-label', `Video player for ${title}`);
    }
  };

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('video-title-modal-backdrop')
      || event.target.classList.contains('video-title-modal-close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  document.body.append(modal);

  videos.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'video-title-card';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'video-title-card-trigger';

    const thumb = document.createElement('div');
    thumb.className = 'video-title-card-thumb';

    if (item.thumbnail) {
      const thumbImg = document.createElement('img');
      thumbImg.loading = 'lazy';
      thumbImg.src = item.thumbnail;
      thumbImg.alt = '';
      thumb.append(thumbImg);
    } else {
      thumb.classList.add('is-placeholder');
    }

    const play = document.createElement('span');
    play.className = 'video-title-card-play';
    play.setAttribute('aria-hidden', 'true');
    thumb.append(play);

    const title = document.createElement('p');
    title.className = 'video-title-card-title';
    const initialTitle = item.title || (item.type === 'youtube' ? 'Loading title…' : item.fallbackTitle);
    title.textContent = initialTitle;
    trigger.setAttribute('aria-label', `Play video: ${initialTitle}`);

    const updateTitle = (newTitle) => {
      const safeTitle = newTitle || item.fallbackTitle;
      title.textContent = safeTitle;
      trigger.setAttribute('aria-label', `Play video: ${safeTitle}`);
    };

    if (item.type === 'youtube' && !item.title) {
      fetchYouTubeTitle(item.url).then((fetchedTitle) => {
        updateTitle(fetchedTitle);
      }).catch(() => {
        updateTitle();
      });
    }

    trigger.addEventListener('click', () => {
      let content;
      if (item.type === 'youtube' && item.videoId) {
        content = buildYoutubeIframe({ ...item, title: title.textContent });
      } else {
        content = buildLocalVideo(item);
      }
      openModal(content, title.textContent);
    });

    trigger.append(thumb, title);
    card.append(trigger);
    grid.append(card);
  });

  block.append(grid);
}
