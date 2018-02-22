import { supportsPassive } from './helpers';

const header = document.querySelector('.header');

if (header != null) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset === 0) {
      header.classList.remove('header--scrolled');
    } else {
      header.classList.add('header--scrolled');
    }
  }, supportsPassive ? { passive: true } : false);
}
