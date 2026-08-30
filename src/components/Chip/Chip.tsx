import type { ReactNode } from 'react';
import './Chip.css';

/**
 * Two chips, identical in shape, opposite in meaning.
 *
 * ⭐ `meta` STATES A FACT and is not interactive — a duration, a date, a
 * speaker count. `action` ACCEPTS A VALUE and is — assign a person, add a tag.
 * They were one component in the Figma file until Aug 23, which meant a
 * read-only fact rendered with a hover state and invited a click that did
 * nothing. Same pixels, different element: `meta` is a span, `action` is a
 * button. The type enforces it.
 */

interface Common { children: ReactNode; className?: string }

export function ChipMeta(
  { children, tone = 'default', className = '' }: Common & { tone?: 'default' | 'low-confidence' },
) {
  return <span className={`mb-chip is-meta is-${tone} ${className}`.trim()}>{children}</span>;
}

export function ChipAction(
  { children, onClick, className = '' }: Common & { onClick: () => void },
) {
  return (
    <button type="button" className={`mb-chip is-action ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}
