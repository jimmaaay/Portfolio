import { loadImage } from './helpers';

export default (els) => {
  const callback = (entries, observer) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (! isIntersecting) return;
      const imgSrc = target.getAttribute('data-src');
      const event = new Event('lazyload:loaded', {
        bubbles: true,
      });
      observer.unobserve(target);
      loadImage(imgSrc)
        .then(() => {
          target.src = imgSrc;
          target.removeAttribute('data-src');
          target.dispatchEvent(event);
        })
        .catch((e) => {
          console.log('Error loading image', e);
        });
    });
  };
  const observer = new IntersectionObserver(callback, {
    threshold: Array.from(new Array(50)).map((_, i) => {
      return i * 0.02;
    })
  });

  els.forEach(el => observer.observe(el));
  return { observer };
};