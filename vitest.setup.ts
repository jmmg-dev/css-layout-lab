import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('style');
  localStorage.clear();
});

// Browser APIs the components use and jsdom does not provide.

if (!window.matchMedia) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Element.prototype.scrollIntoView ??= function () {};

globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver;

// <dialog>: jsdom has no modal state, so it is tracked in data-modal. Like browsers, showModal
// refuses an already open dialog, and the close event arrives in a later task.
const dialog = HTMLDialogElement.prototype;
dialog.show ??= function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
dialog.showModal ??= function (this: HTMLDialogElement) {
  if (this.hasAttribute('open')) throw new DOMException('The dialog is already open.', 'InvalidStateError');
  this.setAttribute('open', '');
  this.dataset.modal = '';
};
dialog.close ??= function (this: HTMLDialogElement) {
  if (!this.hasAttribute('open')) return;
  this.removeAttribute('open');
  delete this.dataset.modal;
  setTimeout(() => this.dispatchEvent(new Event('close')));
};
