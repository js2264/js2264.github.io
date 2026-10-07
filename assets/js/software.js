document.addEventListener('DOMContentLoaded', function () {
  const root = document.querySelector('.software');
  if (!root) return;

  // Copy install commands
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (e) { }
    textarea.remove();
    return copied;
  }

  root.querySelectorAll('.software-install').forEach(install => {
    const code = install.querySelector('code');
    const button = install.querySelector('.software-copy');
    let timer;

    function copyingDone() {
      button.textContent = 'copied!';
      button.classList.add('is-copied');
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.textContent = 'copy';
        button.classList.remove('is-copied');
      }, 2000);
    }

    button.hidden = false;
    install.addEventListener('click', () => {
      const text = code.textContent.trim();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(copyingDone, () => fallbackCopy(text) && copyingDone());
      } else if (fallbackCopy(text)) {
        copyingDone();
      }
    });
  });

  // Briefly highlight the card a workflow link points to
  root.querySelectorAll('.software-flow a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const card = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!card) return;
      card.classList.remove('is-flashed');
      void card.offsetWidth; // restart the animation
      card.classList.add('is-flashed');
    });
  });
});
