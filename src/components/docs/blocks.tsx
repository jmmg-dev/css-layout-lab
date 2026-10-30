import type { getTranslations } from 'next-intl/server';
import { Playground } from '@/components/playground/Playground';
import { examples } from '@/content/examples';
import { buildPreviewDoc } from '@/lib/preview-doc';
import { richTags } from '@/lib/rich';
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
        }}
      />
    </section>
  );
}
