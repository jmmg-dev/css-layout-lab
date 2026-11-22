import type { getTranslations } from 'next-intl/server';
import { Playground } from '@/components/playground/Playground';
import { examples } from '@/content/examples';
import { pages } from '@/content/pages';
import { buildPreviewDoc } from '@/lib/preview-doc';
import { richTags, stripTags } from '@/lib/rich';
import styles from './blocks.module.css';

type Translator = Awaited<ReturnType<typeof getTranslations>>;

export function Prose({ t, id }: { t: Translator; id: string }) {
  return <div className={styles.prose}>{t.rich(id, richTags)}</div>;
}

export function ItemList({ t, ns, items }: { t: Translator; ns: string; items: number }) {
  return (
    <ul className={styles.items}>
      {Array.from({ length: items }, (_, i) => (
        <li key={i}>{t.rich(`${ns}.item${i + 1}`, richTags)}</li>
      ))}
    </ul>
  );
}

export function Tip({ t, ns }: { t: Translator; ns: string }) {
  if (!t.has(`${ns}.tip`)) return null;
  return (
    <aside className={styles.tip}>
      <strong>{t('ui.tip')}</strong>
      <p>{t.rich(`${ns}.tip`, richTags)}</p>
    </aside>
  );
}

type ExampleBlockProps = {
  t: Translator;
  id: string;
  ns?: string;
  heading?: boolean;
};

export function ExampleBlock({ t, id, ns, heading = true }: ExampleBlockProps) {
  const example = examples[id];
  // Shown at the top of full screen: the site section and the title the example belongs to,
  // for instance "Fundamentos - position". Pages split into parts use the part's own title.
  const page = ns ? pages.find((candidate) => ns === candidate.ns || ns.startsWith(`${candidate.ns}.`)) : undefined;
  const sectionGroup = page ? t(`nav.${page.group}`) : undefined;
  const sectionTitle =
    ns && t.has(`${ns}.title`) ? stripTags(t.raw(`${ns}.title`) as string) : t('example');

  return (
    <section className={styles.example}>
      {heading && <h2>{t('example')}</h2>}
      {ns && <Prose t={t} id={`${ns}.example`} />}
      <Playground
        example={example}
        initialDoc={buildPreviewDoc(example.html, example.css)}
        controlLabels={example.controls?.map((control) => t.rich(control.labelKey, richTags)) ?? []}
        labels={{
          result: t('result'),
          live: t('ui.live'),
          hint: t('ui.editHint'),
          reset: t('ui.reset'),
          copy: t('ui.copy'),
          copied: t('ui.copied'),
          custom: t('ui.custom'),
          previewWidth: t('ui.previewWidth'),
          previewTitle: t('ui.previewTitle'),
          htmlEditor: t('ui.editorLabel', { language: 'HTML' }),
          cssEditor: t('ui.editorLabel', { language: 'CSS' }),
          fullscreen: t('ui.fullscreen'),
          exitFullscreen: t('ui.exitFullscreen'),
          fullscreenTitle: t('ui.fullscreenTitle'),
          sectionGroup,
          sectionTitle,
        }}
      />
    </section>
  );
}
