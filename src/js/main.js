import lazyLoad from './lazyload';
import './technology';
import './form';
import './contact';
import portfolioInit from './portfolio-items';
import dCarousel from './vendor/d-carousel';

const header = document.querySelector('.header');
const carousel = document.querySelector('.d-carousel');
const { observer } = lazyLoad(Array.from(document.querySelectorAll('img[data-src]')));

portfolioInit(observer);

if (carousel != null) {
  dCarousel(carousel, {
    paddingLeft: true,
  });
}

if (header != null) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset === 0) {
      header.classList.remove('header--scrolled');
    } else {
      header.classList.add('header--scrolled');
    }
  });
}

