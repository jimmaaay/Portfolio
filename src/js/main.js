import lazyLoad from './lazyload';
import './technology';
import './form';
import portfolioInit from './portfolio-items';
import dCarousel from './vendor/d-carousel';

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.pageYOffset === 0) {
    header.classList.remove('header--scrolled');
  } else {
    header.classList.add('header--scrolled');
  }
});

const { observer } = lazyLoad(Array.from(document.querySelectorAll('img[data-src]')));
portfolioInit(observer);
dCarousel(document.querySelector('.d-carousel'), {
  paddingLeft: true,
});


