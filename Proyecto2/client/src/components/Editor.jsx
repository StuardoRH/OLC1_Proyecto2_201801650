import React, { useMemo, useRef } from 'react';

export default function Editor({
  value,
  onChange,
  readOnly = false,
  placeholder,
  initialCode 
}) {
  const controlled = typeof value === 'string';
  const text = controlled ? value : (initialCode ?? '');
  const gutterRef = useRef(null);
  const areaRef = useRef(null);

  const lines = useMemo(() => {
    const count = (text?.split('\n').length || 1) + 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [text]);

  const onScroll = () => {
    if (gutterRef.current && areaRef.current) {
      gutterRef.current.scrollTop = areaRef.current.scrollTop;
    }
  };

  return (
    <div style={styles.editorWrap}>
      <div ref={gutterRef} style={styles.gutter}>
        {lines.map((n) => (<div key={n}>{n}</div>))}
      </div>
      <textarea
        ref={areaRef}
        value={text}
        onChange={(e) => onChange?.(e.target.value)}
        onScroll={onScroll}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        style={styles.textarea}
      />
    </div>
  );
}

const styles = {
  editorWrap: {
    flex: 1,
    display: 'flex',
    width: '100%',
    background: '#0b1220',
    minHeight: 0,
  },
  gutter: {
    width: 52,
    padding: '10px 8px',
    textAlign: 'right',
    userSelect: 'none',
    color: '#94a3b8',
    background: '#0a0f1a',
    borderRight: '1px solid #1f2937',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
    fontSize: 14,
    lineHeight: '20px',
    overflow: 'hidden',
  },
  textarea: {
    flex: 1,
    width: '100%',
    border: 'none',
    outline: 'none',
    resize: 'none',
    padding: 10,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
    fontSize: 14,
    lineHeight: '20px',
    color: '#ffffff',
    background: '#0b1220',
    caretColor: '#60a5fa',
  },
};
