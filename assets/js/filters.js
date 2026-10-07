// Filter chips: see layouts/partials/filter-chips.html
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-filter-root]').forEach(root => {
    const chips = root.querySelector('.filter-chips');
    if (!chips) return;

    const buttons = Array.from(chips.querySelectorAll('.filter-chip'));
    const items = Array.from(root.querySelectorAll('[data-tags]'));
    const groups = Array.from(root.querySelectorAll('[data-filter-group]'));

    function applyFilter(filter) {
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
      items.forEach(item => {
        item.hidden = filter !== 'all' && !item.dataset.tags.split(' ').includes(filter);
      });
      // Hide groups left empty, and elements that only make sense for a complete group
      groups.forEach(group => {
        group.hidden = !group.querySelector('[data-tags]:not([hidden])');
        const incomplete = !!group.querySelector('[data-tags][hidden]');
        group.querySelectorAll('[data-filter-whole]').forEach(el => { el.hidden = incomplete; });
      });
      // Flag the first group still shown (e.g. the latest year of a timeline)
      const firstShown = groups.find(group => !group.hidden);
      groups.forEach(group => group.toggleAttribute('data-filter-first', group === firstShown));
    }

    chips.hidden = false;
    chips.addEventListener('click', e => {
      const button = e.target.closest('.filter-chip');
      if (button) applyFilter(button.dataset.filter);
    });
  });
});
