import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Every path except internals and files (anything with a dot). The dot needs "\\." in a
  // string: a single "\." is just "." and would skip every path, so unknown languages such as
  // /ens never got redirected to a real one.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
