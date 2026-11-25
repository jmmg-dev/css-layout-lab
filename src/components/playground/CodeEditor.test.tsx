import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CodeEditor } from './CodeEditor';

const labels = { ariaLabel: 'CSS editor', copyLabel: 'Copy', copiedLabel: 'Copied' };

/** Holds the value like the playground does, so typing updates the editor. */
function Editor({ initial = '', onChange = () => {} }: { initial?: string; onChange?: (value: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <CodeEditor
      language="css"
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      {...labels}
    />
  );
}

describe('CodeEditor', () => {
  it('shows the language, one line number per line and the highlighted code', () => {
    const { container } = render(<Editor initial={'a {\n  color: red;\n}'} />);
    expect(screen.getByText('css')).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"] > span')).toHaveLength(3);
    expect(container.querySelector('.tok-property')).toHaveTextContent('color');
  });

  it('reports every change', async () => {
    const onChange = vi.fn();
    render(<Editor onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'CSS editor' }), 'a');
    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  it('indents with Tab instead of leaving the editor', () => {
    const onChange = vi.fn();
    render(<Editor initial="a" onChange={onChange} />);
    const textarea = screen.getByRole('textbox');
    textarea.focus();
    (textarea as HTMLTextAreaElement).setSelectionRange(1, 1);
    const event = fireEvent.keyDown(textarea, { key: 'Tab' });
    expect(event).toBe(false);
    expect(onChange).toHaveBeenLastCalledWith('a  ');
  });

  it('lets Tab leave the editor right after Escape', () => {
    const onChange = vi.fn();
    render(<Editor initial="a" onChange={onChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(fireEvent.keyDown(textarea, { key: 'Tab' })).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    // The next Tab indents again.
    expect(fireEvent.keyDown(textarea, { key: 'Tab' })).toBe(false);
  });

  it('ignores other keys', () => {
    const onChange = vi.fn();
    render(<Editor initial="a" onChange={onChange} />);
    expect(fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('copies the code and confirms it for a moment', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Editor initial=".a {}" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await navigator.clipboard.readText()).toBe('.a {}');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    vi.useRealTimers();
  });
});
