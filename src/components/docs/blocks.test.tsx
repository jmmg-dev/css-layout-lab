import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import en from '../../../messages/en.json';
import { createTranslator } from 'next-intl';
import { examples } from '@/content/examples';
import { ExampleBlock, ItemList, Prose, Tip } from './blocks';
import { BoxDiagram, ContainerDiagram } from './diagrams';

// The real English catalog, through the same translator API the pages get from getTranslations.
const t = createTranslator({ locale: 'en', messages: en }) as unknown as Parameters<typeof Prose>[0]['t'];

describe('Prose, ItemList and Tip', () => {
  it('renders a message with its tags as markup', () => {
    const { container } = render(<Prose t={t} id="flex.wrap.description" />);
    expect(container.firstChild).toHaveTextContent(/wrap/i);
  });

  it('renders one list item per entry', () => {
    render(<ItemList t={t} ns="flex.wrap" items={3} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows a tip only when the section has one', () => {
    const withTip = render(<Tip t={t} ns="flex.wrap" />);
    expect(withTip.getByRole('complementary')).toHaveTextContent(en.ui.tip);
    withTip.unmount();
    const { container } = render(<Tip t={t} ns="flex.direction" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ExampleBlock', () => {
  /** Opens full screen and returns the name it announces, which carries the section title. */
  const fullScreenName = async () => {
    await userEvent.click(screen.getByRole('button', { name: en.ui.fullscreen }));
    return document.querySelector('dialog')!.getAttribute('aria-label');
  };

  it('shows its heading, the explanation and the playground with the example code', () => {
    render(<ExampleBlock t={t} id="flex-wrap" ns="flex.wrap" />);
    expect(screen.getByRole('heading', { name: en.example })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'wrap' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /CSS/ })).toHaveValue(examples['flex-wrap'].css);
  });

  it('titles full screen with the site section and the page title', async () => {
    render(<ExampleBlock t={t} id="flex-wrap" ns="flex.wrap" />);
    expect(await fullScreenName()).toBe(`${en.ui.fullscreenTitle}: ${en.nav.flex} - ${en.flex.wrap.title}`);
  });

  it('uses the part title for pages split into parts', async () => {
    render(<ExampleBlock t={t} id="inline" ns="blockInline.inline" />);
    expect(await fullScreenName()).toBe(
      `${en.ui.fullscreenTitle}: ${en.nav.fundamentals} - ${en.blockInline.inline.title}`,
    );
  });

  it('works without a section or a heading, as on the home page', async () => {
    render(<ExampleBlock t={t} id="brick" heading={false} />);
    expect(screen.queryByRole('heading', { name: en.example })).not.toBeInTheDocument();
    expect(await fullScreenName()).toBe(`${en.ui.fullscreenTitle}: ${en.example}`);
  });
});

describe('diagrams', () => {
  it('draws the four layers of the box model', () => {
    const { container } = render(<BoxDiagram />);
    expect(container).toHaveTextContent('marginborderpaddingcontent');
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('draws a container with three children', () => {
    render(<ContainerDiagram container="container" child="item" />);
    expect(screen.getAllByText('item')).toHaveLength(3);
  });
});
