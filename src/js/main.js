import lazyLoad from './lazyload';
import './technology';
import './form';

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.pageYOffset === 0) {
    header.classList.remove('header--scrolled');
  } else {
    header.classList.add('header--scrolled');
  }
});

lazyLoad(Array.from(document.querySelectorAll('img[data-src]')));