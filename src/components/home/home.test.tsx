import { act, fireEvent, render, screen } from '@testing-library/react';
import Link from 'next/link';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PauseOffscreen } from './PauseOffscreen';
import { SupportPanel } from './SupportPanel';

type Report = (entries: { isIntersecting: boolean; target: Element }[]) => void;

/**
 * Replaces IntersectionObserver with one the test drives. Next.js links observe too (to
 * prefetch), so each observer remembers its elements and visibility goes to the right one.
 */
function controlVisibility() {
  const watched: { element: Element; report: Report }[] = [];
  const disconnect = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(private report: Report) {}
      observe(element: Element) {
        watched.push({ element, report: this.report });
      }
      unobserve() {}
      disconnect = disconnect;
    },
  );
  return {
    setVisible: (element: Element, isIntersecting: boolean) =>
      act(() =>
        watched
          .filter((entry) => entry.element === element)
          .forEach((entry) => entry.report([{ isIntersecting, target: element }])),
      ),
    disconnect,
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('PauseOffscreen', () => {
  it('flags its box while it is out of view', () => {
    const { setVisible } = controlVisibility();
    render(<PauseOffscreen className="card">content</PauseOffscreen>);
    const box = screen.getByText('content');
    expect(box).toHaveClass('card');
    expect(box).toHaveAttribute('aria-hidden', 'true');

    setVisible(box, false);
    expect(box).toHaveAttribute('data-offscreen');
    setVisible(box, true);
    expect(box).not.toHaveAttribute('data-offscreen');
  });

  it('stops observing when it is removed', () => {
    const { disconnect } = controlVisibility();
    render(<PauseOffscreen className="card">content</PauseOffscreen>).unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});

describe('SupportPanel', () => {
  const renderPanel = () =>
    render(
      <>
        <Link href="/es#support">heart</Link>
        <Link href="/es/flex">other</Link>
        <SupportPanel>panel</SupportPanel>
      </>,
    );

  it('is the support anchor and flags when it is on screen', () => {
    const { setVisible } = controlVisibility();
    renderPanel();
    const panel = screen.getByText('panel');
    expect(panel).toHaveAttribute('id', 'support');
    setVisible(panel, true);
    expect(panel).toHaveAttribute('data-in-view', 'true');
    setVisible(panel, false);
    expect(panel).toHaveAttribute('data-in-view', 'false');
  });

  it('scrolls to itself when a link to it is clicked', () => {
    controlVisibility();
    renderPanel();
    const scroll = vi.spyOn(screen.getByText('panel'), 'scrollIntoView');
    fireEvent.click(screen.getByText('heart'));
    expect(scroll).toHaveBeenCalledWith({ block: 'center' });
  });

  it('ignores clicks on other links', () => {
    controlVisibility();
    renderPanel();
    const scroll = vi.spyOn(screen.getByText('panel'), 'scrollIntoView');
    fireEvent.click(screen.getByText('other'));
    expect(scroll).not.toHaveBeenCalled();
  });

  it('replays its entrance when it is already on screen', async () => {
    const { setVisible } = controlVisibility();
    renderPanel();
    const panel = screen.getByText('panel');
    setVisible(panel, true);
    const changes: (string | null)[] = [];
    const observer = new MutationObserver((records) => records.forEach((record) => changes.push(record.oldValue)));
    observer.observe(panel, { attributeFilter: ['data-in-view'], attributeOldValue: true });

    fireEvent.click(screen.getByText('heart'));
    await vi.waitFor(() => expect(changes).toEqual(['true', 'false']));
    expect(panel).toHaveAttribute('data-in-view', 'true');
    observer.disconnect();
  });

  it('stops listening when it is removed', () => {
    const { disconnect } = controlVisibility();
    const { unmount } = renderPanel();
    const scroll = vi.spyOn(screen.getByText('panel'), 'scrollIntoView');
    unmount();
    expect(disconnect).toHaveBeenCalled();
    document.body.innerHTML = '<a href="/es#support">heart</a>';
    fireEvent.click(document.querySelector('a')!);
    expect(scroll).not.toHaveBeenCalled();
  });
});
