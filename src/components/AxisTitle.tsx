import type { ReactNode } from 'react';
import { AxisColumnIcon, AxisRowIcon } from './icons';

const AXIS_SUFFIX = /^(.*?)\s*\((row|column)\)$/;

type Props = { title: string; children?: ReactNode };

/**
 * Shows a trailing "(row)" or "(column)" as an arrow. The word stays in the catalogs and for
 * screen readers, so page metadata and search keep working. Other titles render unchanged.
 */
export function AxisTitle({ title, children }: Props) {
  const match = title.match(AXIS_SUFFIX);
  if (!match) return children ?? title;

  const [, text, axis] = match;
  return (
    <>
      {text}{' '}
      <span className="axis-icon">
        {axis === 'row' ? <AxisRowIcon /> : <AxisColumnIcon />}
        <span className="visually-hidden">({axis})</span>
      </span>
    </>
  );
}
