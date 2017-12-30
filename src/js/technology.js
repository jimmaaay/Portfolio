const run = () => {
  const items = Array.from(document.querySelectorAll('.technology__item'));
  items.forEach(el => {
    const icon = el.getAttribute('data-icon');
    const html = `
      <svg viewBox="0 0 190 190">
        <use xlink:href="/img/svgSprites/tech.svg#${icon}"
      </svg>
    `;

    el.innerHTML = html;
  });
};


const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (! isIntersecting) return;
    run();
    observer.unobserve(target);
  });
}, {
  threshold: Array.from(new Array(50)).map((_, i) => {
    return i * 0.02;
  })
});


observer.observe(document.querySelector('.technology'));