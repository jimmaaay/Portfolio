import { supportsPassive } from './helpers';

const header = document.querySelector('.header');
const headerScroll = () => {
  if (window.pageYOffset === 0) {
    header.classList.remove('header--scrolled');
  } else {
    header.classList.add('header--scrolled');
  }
};

if (header != null) {
  headerScroll();
  window.addEventListener('scroll', headerScroll, supportsPassive ? { passive: true } : false);
}