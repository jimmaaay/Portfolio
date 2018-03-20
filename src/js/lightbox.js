import { domBuilder } from './helpers';

export const lightbox = () => {
  const { body } = document;
  const lightbox = (
    <div className="lightbox">
      <div className="lightbox__inner">
        <button className="lightbox__close">Close</button>
        <div className="lightbox__content"></div>
      </div>
    </div>
  );

  const close = lightbox.querySelector('.lightbox__close');
  const inner = lightbox.querySelector('.lightbox__inner');
  const content = lightbox.querySelector('.lightbox__content');

  let state = 'CLOSED'; // CLOSED, CLOSING, OPENING, OPEN

  const openLightbox = () => {
    state = 'OPENING';
    lightbox.classList.add('lightbox--open');
  };

  const closeLightbox = () => {
    state = 'CLOSING';
    lightbox.classList.remove('lightbox--open');
  };

  const changeContent = (html) => {
    content.innerHTML = html.replace(/href/g, 'target="_blank" rel="noopener" href');
  };

  inner.addEventListener('transitionend', (e) => {
    if (state === 'OPENING') {
      state = 'OPEN';
      body.style.overflow = 'hidden';
    }
    else { 
      state = 'CLOSED';
      body.style.overflow = '';
    }
  });

  lightbox.addEventListener('click', ({target}) => {
    if (target === close || target === lightbox || target === inner) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (state === 'OPEN' && e.code === 'Escape' || e.keyCode === 27) {
      closeLightbox();
    }
  });

  body.appendChild(lightbox);

  return {
    changeContent,
    open: openLightbox,
    close: closeLightbox,
  };

};

