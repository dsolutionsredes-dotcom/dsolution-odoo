/** D-Solution photography gallery category filters. No action while Odoo website editor is active. */
(function () {
  'use strict';
  function init() {
    const page = document.querySelector('.dsolution-photo-page');
    if (!page) return;
    const filters = page.querySelectorAll('[data-photo-filter]');
    const tiles = page.querySelectorAll('[data-photo-category]');
    filters.forEach(btn => btn.addEventListener('click', function () {
      if (document.body.classList.contains('editor_enable') || document.body.classList.contains('o_is_editing')) return;
      const value = btn.getAttribute('data-photo-filter');
      filters.forEach(el => el.classList.toggle('is-active', el === btn));
      tiles.forEach(tile => { tile.hidden = value !== 'all' && tile.getAttribute('data-photo-category') !== value; });
    }));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
