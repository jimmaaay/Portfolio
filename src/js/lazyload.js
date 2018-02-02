import { loadImage, callbackKey } from './helpers';

export default (els, observer) => {

  els.forEach(el => el[callbackKey] = ({ target, isIntersecting }) => {
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
  
  els.forEach(el => observer.observe(el));

};