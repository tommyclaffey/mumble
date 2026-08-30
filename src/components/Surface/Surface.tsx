import type { ReactNode } from 'react';
import './Surface.css';

/**
 * A background, and nothing else.
 *
 * ⭐ Surface has no content of its own. The screens position content as
 * siblings over a background, so a component that bakes in its children cannot
 * be swapped into them — which is exactly why the Figma file's `Card` and
 * `AI block` ended up with zero instances each and were deleted. A component
 * nobody can use is not a component.
 *
 * `ai` is a distinct tone rather than a tint of `card` because everything the
 * model produced has to stay visually separable from everything the user said.
 * That separation is the product's transparency claim; an opacity value can be
 * quietly changed, a named tone cannot.
 */
export type SurfaceTone = 'card' | 'ai' | 'sunken';

export interface SurfaceProps {
  tone?: SurfaceTone;
  children?: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
}

export function Surface({ tone = 'card', children, className = '', as: Tag = 'div' }: SurfaceProps) {
  return <Tag className={`mb-surface is-${tone} ${className}`.trim()}>{children}</Tag>;
}
