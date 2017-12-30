
export default (els) => {
  const callback = (entries, observer) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (! isIntersecting) return;
      target.src = target.getAttribute('data-src');
      target.removeAttribute('data-src');
      observer.unobserve(target);
    });
  };
  const observer = new IntersectionObserver(callback, {
    threshold: 0.25,
  });

  els.forEach(el => observer.observe(el));
};