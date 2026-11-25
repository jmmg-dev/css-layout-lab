import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Example } from '@/content/types';
import { buildPreviewDoc } from '@/lib/preview-doc';
import { Playground, type PlaygroundLabels } from './Playground';

const css = '.container {\n  display: flex;\n  gap: 1rem;\n}';
const html = '<div class="container"></div>';

const example: Example = {
  html,
  css,
  height: 120,
  initialWidth: 50,
  controls: [
    {
      kind: 'property',
      labelKey: 'direction',
      selector: '.container',
      property: 'flex-direction',
      options: ['row', 'column'],
    },
    {
      kind: 'preset',
      labelKey: 'layout',
      options: [
        { value: 'one', html, css },
        { value: 'two', html: '<p></p>', css: 'p { order: 2; }' },
      ],
    },
  ],
};

const labels: PlaygroundLabels = {
  result: 'Result',
  live: 'Live',
  hint: 'Edit the code',
  reset: 'Reset',
  copy: 'Copy',
  copied: 'Copied',
  custom: 'custom',
  previewWidth: 'Container width',
  previewTitle: 'Example result',
  htmlEditor: 'HTML editor',
  cssEditor: 'CSS editor',
  fullscreen: 'Full screen',
  exitFullscreen: 'Exit full screen',
  fullscreenTitle: 'Example in full screen',
  sectionGroup: 'Flexbox',
  sectionTitle: 'flex-direction',
};

const renderPlayground = (overrides: Partial<PlaygroundLabels> = {}, data = example) =>
  render(
    <Playground
      example={data}
      initialDoc={buildPreviewDoc(data.html, data.css)}
      controlLabels={['Select flex-direction', 'Select layout']}
      labels={{ ...labels, ...overrides }}
    />,
  );

const cssEditor = () => screen.getByRole('textbox', { name: 'CSS editor' }) as HTMLTextAreaElement;
const slider = () => screen.getByRole('slider', { name: /^Container width/ }) as HTMLInputElement;
const dialog = () => document.querySelector('dialog')!;

describe('Playground selectors', () => {
  it('shows the value the CSS does not set yet as custom', () => {
    renderPlayground();
    const group = screen.getByRole('group', { name: 'Select flex-direction' });
    expect(within(group).getByText('custom')).toBeInTheDocument();
    expect(within(group).getByRole('radio', { name: 'row' })).not.toBeChecked();
  });

  it('writes the chosen value into the CSS', async () => {
    renderPlayground();
    await userEvent.click(screen.getByRole('radio', { name: 'column' }));
    expect(cssEditor().value).toContain('flex-direction: column;');
    expect(screen.getByRole('radio', { name: 'column' })).toBeChecked();
  });

  it('shows a value typed by hand that is not an option', () => {
    renderPlayground();
    fireEvent.change(cssEditor(), { target: { value: css.replace('gap', 'flex-direction: row-reverse;\n  gap') } });
    const group = screen.getByRole('group', { name: 'Select flex-direction' });
    expect(within(group).getByText('row-reverse')).toBeInTheDocument();
  });

  it('swaps the whole snippet for a preset', async () => {
    renderPlayground();
    expect(screen.getByRole('radio', { name: 'one' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'two' }));
    expect(cssEditor().value).toBe('p { order: 2; }');
    expect((screen.getByRole('textbox', { name: 'HTML editor' }) as HTMLTextAreaElement).value).toBe('<p></p>');
  });

  it('ignores a preset value that does not exist', () => {
    renderPlayground();
    const radio = screen.getByRole('radio', { name: 'two' });
    radio.setAttribute('value', 'missing');
    fireEvent.click(radio);
    expect(cssEditor().value).toBe('p { order: 2; }');
  });
});

describe('Playground width and reset', () => {
  it('starts at the example width and never goes below the minimum', () => {
    renderPlayground();
    expect(slider().value).toBe('50');
    fireEvent.change(slider(), { target: { value: '5' } });
    expect(slider().value).toBe('20');
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('starts at full width when the example sets none', () => {
    renderPlayground({}, { ...example, initialWidth: undefined, controls: undefined });
    expect(slider().value).toBe('100');
  });

  it('restores the original code and width', async () => {
    renderPlayground();
    await userEvent.click(screen.getByRole('radio', { name: 'column' }));
    fireEvent.change(slider(), { target: { value: '80' } });
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(cssEditor().value).toBe(css);
    expect(slider().value).toBe('50');
  });
});

describe('Playground full screen', () => {
  const expand = () => userEvent.click(screen.getByRole('button', { name: 'Full screen' }));

  it('opens as a modal titled with the section, and locks the page scroll', async () => {
    renderPlayground();
    await expand();
    expect(dialog()).toHaveAttribute('data-modal');
    expect(dialog()).toHaveAccessibleName('Example in full screen: Flexbox - flex-direction');
    expect(screen.getByText('Flexbox -', { exact: false })).toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(screen.queryByRole('button', { name: 'Full screen' })).not.toBeInTheDocument();
  });

  it('shows only the title when there is no section', async () => {
    renderPlayground({ sectionGroup: undefined, sectionTitle: 'Example' });
    await expand();
    expect(dialog()).toHaveAccessibleName('Example in full screen: Example');
  });

  it('goes back to the page with its button, restoring scroll and focus', async () => {
    renderPlayground();
    await expand();
    await userEvent.click(screen.getByRole('button', { name: /Exit full screen/ }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Full screen' })).toHaveFocus());
    expect(dialog()).toHaveAttribute('open');
    expect(dialog()).not.toHaveAttribute('data-modal');
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('keeps the edited code when leaving full screen', async () => {
    renderPlayground();
    await expand();
    await userEvent.click(screen.getByRole('radio', { name: 'column' }));
    await userEvent.click(screen.getByRole('button', { name: /Exit full screen/ }));
    await waitFor(() => expect(dialog()).not.toHaveAttribute('data-modal'));
    expect(cssEditor().value).toContain('flex-direction: column;');
  });

  it('does not close when Escape only releases the Tab key in a code editor', async () => {
    renderPlayground();
    await expand();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    cssEditor().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);

    const outside = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    dialog().dispatchEvent(outside);
    expect(outside.defaultPrevented).toBe(false);
  });

  it('closes by itself when the window becomes too small', async () => {
    let onChange = () => {};
    const query = {
      matches: true,
      addEventListener: (_: string, fn: () => void) => (onChange = fn),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(query as unknown as MediaQueryList);
    renderPlayground();
    await expand();

    onChange();
    expect(dialog()).toHaveAttribute('data-modal');

    query.matches = false;
    onChange();
    await waitFor(() => expect(dialog()).not.toHaveAttribute('data-modal'));
    expect(screen.getByRole('button', { name: 'Full screen' })).toBeInTheDocument();
  });
});
