import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { buildPreviewDoc, USER_STYLE_ID } from '@/lib/preview-doc';
import { Preview } from './Preview';

const props = { initialDoc: buildPreviewDoc('', ''), minHeight: 120, title: 'Example result' };

/** jsdom does not load srcdoc, so the frame document is prepared the way the browser would leave it. */
function loadFrame(iframe: HTMLIFrameElement) {
  const doc = iframe.contentDocument!;
  doc.head.innerHTML = `<style id="${USER_STYLE_ID}"></style>`;
  doc.body.innerHTML = '';
  act(() => {
    iframe.dispatchEvent(new Event('load'));
  });
  return doc;
}

const frameOf = (container: HTMLElement) => container.querySelector('iframe')!;

/** jsdom does no layout: set the content height and the scrollbar height the frame would report. */
function measure(iframe: HTMLIFrameElement, content: number, scrollbar = 0) {
  const root = iframe.contentDocument!.documentElement;
  vi.spyOn(root, 'scrollHeight', 'get').mockReturnValue(content);
  vi.spyOn(root, 'clientHeight', 'get').mockReturnValue(content - scrollbar);
  vi.spyOn(iframe.contentWindow!, 'innerHeight', 'get').mockReturnValue(content);
}

describe('Preview', () => {
  it('renders a sandboxed frame without scripts, with its title and initial height', () => {
    const { container } = render(<Preview html="" css="" {...props} />);
    const iframe = frameOf(container);
    expect(iframe).toHaveAttribute('title', 'Example result');
    expect(iframe).toHaveAttribute('sandbox', 'allow-same-origin');
    expect(iframe.style.height).toBe('120px');
  });

  it('puts the HTML and CSS into the frame once it has loaded', () => {
    const { container } = render(<Preview html="<p>hi</p>" css="p { color: red; }" {...props} />);
    const doc = loadFrame(frameOf(container));
    expect(doc.getElementById(USER_STYLE_ID)?.textContent).toBe('p { color: red; }');
    expect(doc.body.innerHTML).toBe('<p>hi</p>');
  });

  it('updates the frame in place when the code changes', () => {
    const { container, rerender } = render(<Preview html="<p>a</p>" css="" {...props} />);
    const doc = loadFrame(frameOf(container));
    rerender(<Preview html="<p>b</p>" css="p { order: 1; }" {...props} />);
    expect(doc.body.innerHTML).toBe('<p>b</p>');
    expect(doc.getElementById(USER_STYLE_ID)?.textContent).toBe('p { order: 1; }');
  });

  it('fits its height to the content, up to a maximum', () => {
    const { container } = render(<Preview html="" css="" {...props} />);
    const iframe = frameOf(container);
    measure(iframe, 2000);
    loadFrame(iframe);
    expect(iframe.style.height).toBe('640px');

    measure(iframe, 180);
    loadFrame(iframe);
    expect(iframe.style.height).toBe('180px');
  });

  it('adds the height of a horizontal scrollbar so no vertical scroll appears', () => {
    const { container } = render(<Preview html="" css="" {...props} />);
    const iframe = frameOf(container);
    measure(iframe, 180, 4);
    loadFrame(iframe);
    expect(iframe.style.height).toBe('184px');
  });

  it('measures again only when the frame width changes', () => {
    let notify = () => {};
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          notify = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    const { container } = render(<Preview html="" css="" {...props} />);
    const iframe = frameOf(container);
    measure(iframe, 100);
    loadFrame(iframe);
    measure(iframe, 300);

    act(() => notify());
    expect(iframe.style.height).toBe('100px');

    vi.spyOn(iframe, 'clientWidth', 'get').mockReturnValue(500);
    act(() => notify());
    expect(iframe.style.height).toBe('300px');
    vi.unstubAllGlobals();
  });

  it('mirrors the page theme and follows every switch', async () => {
    const { container } = render(<Preview html="" css="" {...props} />);
    const doc = loadFrame(frameOf(container));
    expect(doc.documentElement.dataset.theme).toBe('light');

    document.documentElement.dataset.theme = 'dark';
    await vi.waitFor(() => expect(doc.documentElement.dataset.theme).toBe('dark'));
  });
});
