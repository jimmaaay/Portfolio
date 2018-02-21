import { callbackKey } from './helpers'

export default (observer) => {

  const technology = document.querySelector('.technology');

  if (technology != null) {
    const { techSvgURI } = pageVariables;

    technology[callbackKey] = ({ target, isIntersecting }, observer) => {
      if (! isIntersecting) return;
      const items = Array.from(document.querySelectorAll('.technology__item'));
      items.forEach(el => {
        const icon = el.getAttribute('data-icon');
        const html = `
          <svg viewBox="0 0 190 190">
            <use xlink:href="${techSvgURI}#${icon}" />
          </svg>
        `;

        el.innerHTML = html;
      });
      observer.unobserve(target);
    };

    observer.observe(technology);
  }
}