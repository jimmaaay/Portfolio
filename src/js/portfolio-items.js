import lazyLoad from './lazyload';
import { parents, domBuilder } from './helpers';

export default (observer) => {

  const INITIAL_NO_SHOWING = 3;
  let noShowing = INITIAL_NO_SHOWING;

  // Read comment on domBuilder fn about JSX
  const makeItem = ({ url, imgSrc, imgAlt, title}) => {
    return (
      <li class="portfolio__item">
        <a href={url} class="portfolio__item__a a-reset">
          <div class="loader"></div>
          <img data-src={imgSrc} alt={imgAlt} class="portfolio__item__image"/>
          <div class="portfolio__item__overlay">
            <h3>{title}</h3>
          </div>
        </a>
      </li>
    );
  };

  const items = document.querySelector('.portfolio__items');
  if (items == null) return;
  const total = parseInt(items.getAttribute('data-total'), 10);
  const loadMoreButton = document.querySelector('.portfolio__load-more');

  // TODO: load 3 at a time instead of 1
  // TODO: Split portfolio items into custom post types in hugo
  // TODO: Generate a json/yaml file with hugo for all the portfolio items

  if (total > INITIAL_NO_SHOWING) {
    const loadClick = () => {
      const item = items.appendChild(makeItem({
        url: 'https://google.com',
        imgSrc: '/img/crime-map.jpg',
        imgAlt: '',
        title: 'Jim test',
      }));

      noShowing++;

      observer.observe(item.querySelector('img'));

      if (noShowing === total) {
        loadMoreButton.removeEventListener('click', loadClick);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
      }

    };
    loadMoreButton.style.display = '';
    loadMoreButton.addEventListener('click', loadClick);
  }

  document.addEventListener('lazyload:loaded', (e) => {
    const { target } = e;
    const item = parents(target, '.portfolio__item');
    if (item === false) return;
    const loader = item.querySelector('.loader');
    if (loader == null) return;
    loader.parentElement.removeChild(loader);
  });


}