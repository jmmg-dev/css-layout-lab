'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AxisTitle } from '../AxisTitle';
import { CloseIcon, HeartIcon, MenuIcon } from '../icons';
import styles from './SideNav.module.css';

export type NavGroup = {
  id: string;
  label: string;
  links: { href: string; number: string; label: string }[];
};

type Props = {
  groups: NavGroup[];
  label: string;
  openLabel: string;
  closeLabel: string;
  support: { href: string; label: string };
  compact?: boolean;
};

export function SideNav({ groups, label, openLabel, closeLabel, support, compact = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const activeLink = useRef<HTMLAnchorElement>(null);

  // The menu keeps its scroll between pages; it only moves to bring a hidden active link to the centre.
  useEffect(() => {
    const list = wrapper.current;
    const link = activeLink.current;
    if (!list || !link) return;
    const view = list.getBoundingClientRect();
    const target = link.getBoundingClientRect();
    if (target.top >= view.top && target.bottom <= view.bottom) return;
    list.scrollTop += target.top - view.top - (view.height - target.height) / 2;
  }, [pathname]);

  return (
    <div ref={wrapper} className={styles.wrapper} data-compact={compact}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        {open ? closeLabel : openLabel}
      </button>
      <nav className={styles.nav} data-open={open} aria-label={label}>
        {groups.map((group) => (
          <section key={group.id} className={styles.group}>
            <h2>{group.label}</h2>
            <ol>
              {group.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      ref={active ? activeLink : undefined}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span aria-hidden="true">{link.number}</span>
                      <span>
                        <AxisTitle title={link.label} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
        <Link className={styles.support} href={support.href} onClick={() => setOpen(false)}>
          <HeartIcon />
          {support.label}
        </Link>
      </nav>
    </div>
  );
}
