/*
 * jserizay.com's own behaviours, after chromokit's (themes/chromokit/static/chromokit/chromokit.js):
 * the home page's sequence background, and the {{< fish >}} shortcode's picture.
 */
;(() => {
  const ready = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn())

  ready(() => {
    // ---- The sequence behind the home page (layouts/partials/atgc-background.html)
    const container = document.getElementById('atgc-background')
    const tooltip = document.getElementById('atgc-tooltip')
    if (container && tooltip) {
      const K = 5 // length of the k-mer highlighted around the hovered letter

      const render = (text) => {
        // One span per letter, inserted in a single DOM operation
        const fragment = document.createDocumentFragment()
        const spans = []
        for (const letter of text) {
          const span = document.createElement('span')
          span.className = `atgc-letter ${letter.toLowerCase()}`
          span.textContent = letter
          spans.push(span)
          fragment.appendChild(span)
        }
        container.appendChild(fragment)
        requestAnimationFrame(() => container.classList.add('is-ready'))

        // Index the start positions of every k-mer once, so that hovering is a lookup
        const positions = new Map()
        for (let i = 0; i + K <= text.length; i++) {
          const kmer = text.substring(i, i + K)
          if (!positions.has(kmer)) positions.set(kmer, [])
          positions.get(kmer).push(i)
        }
        const indexOf = new Map(spans.map((span, i) => [span, i]))
        let highlighted = []
        const clear = () => {
          for (const span of highlighted) span.classList.remove('highlight')
          highlighted = []
          tooltip.hidden = true
        }

        // Hovering a letter highlights all occurrences of the k-mer centred on it
        container.addEventListener('mouseover', (event) => {
          const index = indexOf.get(event.target)
          if (index === undefined) return
          clear()
          const start = index - Math.floor(K / 2)
          if (start < 0 || start + K > text.length) return
          const kmer = text.substring(start, start + K)
          const occurrences = positions.get(kmer)
          for (const p of occurrences) {
            for (let j = p; j < p + K; j++) {
              spans[j].classList.add('highlight')
              highlighted.push(spans[j])
            }
          }
          // Label the k-mer above the hovered letter
          const rect = event.target.getBoundingClientRect()
          tooltip.textContent = `${kmer} · ${occurrences.length}×`
          tooltip.style.left = `${rect.left + rect.width / 2}px`
          tooltip.style.top = `${rect.top}px`
          tooltip.hidden = false
        })
        container.addEventListener('mouseout', (event) => {
          if (indexOf.has(event.target)) clear()
        })
      }

      // The FASTA file: header lines dropped, sequence lines joined
      fetch(container.dataset.fasta)
        .then((response) => {
          if (!response.ok) throw new Error('FASTA file not found')
          return response.text()
        })
        .then((fasta) =>
          render(
            fasta
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line && !line.startsWith('>'))
              .join('')
              .toUpperCase(),
          ),
        )
        .catch(() => {
          // Random letters if the file cannot be loaded
          let text = ''
          for (let i = 0; i < 5000; i++) text += 'ATGC'[Math.floor(Math.random() * 4)]
          render(text)
        })
    }

    // ---- {{< fish image="…" >}}: the picture beside the pointer, or under the phrase when focused
    let popup = null
    const close = () => {
      popup?.remove()
      popup = null
    }
    const place = (x, y) => {
      if (!popup) return
      popup.style.left = `${Math.min(x + 12, window.innerWidth - popup.offsetWidth - 8)}px`
      popup.style.top = `${Math.max(8, y - popup.offsetHeight - 12)}px`
    }
    const open = (span, x, y) => {
      close()
      popup = document.createElement('div')
      popup.className = 'fish-popup'
      const img = document.createElement('img')
      img.src = span.dataset.image
      img.alt = ''
      img.addEventListener('load', () => place(x, y))
      popup.appendChild(img)
      document.body.appendChild(popup)
      place(x, y)
    }
    for (const span of document.querySelectorAll('.fish-hover')) {
      span.addEventListener('mouseenter', (event) => open(span, event.clientX, event.clientY))
      span.addEventListener('mousemove', (event) => place(event.clientX, event.clientY))
      span.addEventListener('mouseleave', close)
      span.addEventListener('focus', () => {
        const rect = span.getBoundingClientRect()
        open(span, rect.left, rect.top)
      })
      span.addEventListener('blur', close)
    }
  })
})()
