'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CloseIcon, MenuIcon } from '../icons';
import styles from './SideNav.module.css';

export type NavGroup = {
  id: string;
  label: string;
  links: { href: string; number: string; label: string }[];
};

type Props = { groups: NavGroup[]; label: string; openLabel: string; closeLabel: string };

export function SideNav({ groups, label, openLabel, closeLabel }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeLink.current?.scrollIntoView({ block: 'nearest' });
  }, [pathname]);

  return (
    <div className={styles.wrapper}>
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
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </nav>
    </div>
  );
}
