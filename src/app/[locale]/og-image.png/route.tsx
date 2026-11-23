import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';
import { routing } from '@/i18n/routing';
import { OG_IMAGE_SIZE, SITE_NAME } from '@/lib/seo';

// One card per language, rendered at build time and served as a plain PNG.
export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const GRADIENT = 'linear-gradient(100deg, #f08f63, #d274b4 55%, #4f94e8)';
const INK = '#1b1e26';
const FONT = 'Inter Tight';

/**
 * The card uses the site's heading font. Google Fonts serves TrueType when no browser is named,
 * which is what the image renderer reads. If it cannot be fetched, the default font is used.
 */
async function loadFont(weight: 400 | 700) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return { name: FONT, data: await (await fetch(url)).arrayBuffer(), weight, style: 'normal' as const };
  } catch {
    return null;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return new Response('Not found', { status: 404 });
  const t = await getTranslations({ locale, namespace: 'meta' });
  const fonts = (await Promise.all([loadFont(400), loadFont(700)])).filter((font) => font !== null);

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #ffe3d6 0%, #fbfaf7 45%, #d9e8fb 100%)',
        color: INK,
        display: 'flex',
        fontFamily: fonts.length ? FONT : undefined,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        padding: '0 96px',
        width: '100%',
      }}
    >
      {/* Same mark as the header logo: CL in the brand gradient over "Lab". */}
      <div
        style={{
          alignItems: 'center',
          background: '#ffffff',
          border: '3px solid #e4e1da',
          borderRadius: 40,
          display: 'flex',
          flexDirection: 'column',
          height: 168,
          justifyContent: 'center',
          width: 168,
        }}
      >
        <div
          style={{
            backgroundClip: 'text',
            backgroundImage: GRADIENT,
            color: 'transparent',
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -6,
            lineHeight: 1,
          }}
        >
          CL
        </div>
        <div style={{ fontSize: 46, fontWeight: 600, lineHeight: 1 }}>Lab</div>
      </div>

      <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 56 }}>
        <span style={{ backgroundClip: 'text', backgroundImage: GRADIENT, color: 'transparent' }}>CSS</span>
        <span style={{ marginLeft: 24 }}>{SITE_NAME.replace(/^CSS /, '')}</span>
      </div>
      <div style={{ color: '#4a4f5c', fontSize: 44, marginTop: 16 }}>{t('imageTagline')}</div>
      <div style={{ color: '#2b7de0', fontSize: 34, marginTop: 40 }}>{t('imageTopics')}</div>
    </div>,
    { ...OG_IMAGE_SIZE, fonts },
  );
}
