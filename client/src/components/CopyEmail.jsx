import { useRef, useState } from 'react';
import { SITE } from '../data/site.js';

/** Shows the address as selectable text and copies it, falling back to selecting it when the clipboard is blocked. */
export default function CopyEmail() {
  const addr = useRef(null);
  const [label, setLabel] = useState('Copy address');

  function select() {
    const range = document.createRange();
    range.selectNodeContents(addr.current);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setLabel('Copied');
      setTimeout(() => setLabel('Copy address'), 1600);
    } catch {
      select();
      setLabel('Press Ctrl+C');
      setTimeout(() => setLabel('Copy address'), 2400);
    }
  }

  return (
    <div className="mail">
      <span className="addr" ref={addr}>{SITE.email}</span>
      <button className="btn" type="button" onClick={copy}>{label}</button>
    </div>
  );
}
