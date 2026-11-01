import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { HomePage } from '@/components/home/HomePage';
import { SiteMenu } from '@/components/layout/SiteMenu';
import { routing } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return buildMetadata({ locale, title: t('title'), description: t('description'), keywords: t('keywords') });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <SiteMenu locale={locale} compact />
      <HomePage locale={locale} />
    </>
  );
}
