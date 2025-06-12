
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the default locale, in this case 'es'.
  // The middleware should already handle this, but this provides an explicit fallback.
  redirect('/es');
  // return null; // Or return null, as redirect() throws an error.
}
