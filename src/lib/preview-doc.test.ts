import { describe, expect, it } from 'vitest';
import { buildPreviewDoc, USER_STYLE_ID } from './preview-doc';

describe('buildPreviewDoc', () => {
  it('puts the user CSS in its own style tag and the HTML in the body', () => {
    const doc = new DOMParser().parseFromString(
      buildPreviewDoc('<div class="container"></div>', '.container { display: grid; }'),
      'text/html',
    );
    expect(doc.getElementById(USER_STYLE_ID)?.textContent).toBe('.container { display: grid; }');
    expect(doc.body.innerHTML).toBe('<div class="container"></div>');
  });

  it('adds the base styles before the user ones, so the user CSS wins', () => {
    const doc = new DOMParser().parseFromString(buildPreviewDoc('', ''), 'text/html');
    const styles = doc.querySelectorAll('style');
    expect(styles).toHaveLength(2);
    expect(styles[0].textContent).toContain(':where(');
    expect(styles[1].id).toBe(USER_STYLE_ID);
  });
});
