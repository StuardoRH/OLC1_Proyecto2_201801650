import React, { useEffect, useMemo, useRef } from 'react';

export default function ConsoleOutput({ text, lines, style }) {
  const ref = useRef(null);
  const value = useMemo(
    () => (Array.isArray(lines) ? lines.join('\n') : (text ?? '')),
    [text, lines]
  );

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [value]);

  return (
    <pre
      ref={ref}
      style={{
        flex: 1,
        margin: 0,
        padding: 10,
        overflow: 'auto',
        background: '#0b1220',
        color: '#e5e7eb',
        border: 'none',
        outline: 'none',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
        fontSize: 14,
        lineHeight: '20px',
        ...style,
      }}
    >
      {value}
    </pre>
  );
}
