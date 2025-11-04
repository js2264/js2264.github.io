document.addEventListener('DOMContentLoaded', function() {
  const authorName = 'Jacques Serizay';
  
  function highlightInNode(node) {
    if (node.nodeType === 3) { // Text node
      const text = node.nodeValue;
      if (text.includes(authorName) || text.includes('Serizay')) {
        const parent = node.parentNode;
        parent.innerHTML = parent.innerHTML.replace(
          /([^,]*?Serizay[^,]*?)(?=,)/g,
          `<mark style="display: inline-block; line-height: 0em; background-color: #ffdd00ff; padding-bottom: 1.1em; font-weight: bold;">$1</mark>`
        );
        parent.innerHTML = parent.innerHTML.replace(
          /,\s+([^,<]*?)\s+(\d{4})(?=[<,]|$)/g,
          `, <strong><em>$1 $2</em></strong>`
        );

      }
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT') {
      Array.from(node.childNodes).forEach(child => highlightInNode(child));
    }
  }

  document.querySelectorAll('.entry-content, .post-content, article').forEach(content => {
    highlightInNode(content);
  });
});
