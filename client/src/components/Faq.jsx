/** Accessible accordion built on <details>. `items` is [[question, answer]] or [{q, a}]. */
export default function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((it) => {
        const [q, a] = Array.isArray(it) ? it : [it.q, it.a];
        return (
          <details key={q}>
            <summary>{q}</summary>
            <div className="ans">{a}</div>
          </details>
        );
      })}
    </div>
  );
}
