// This is the new root layout.
// It does not contain <html> or <body> tags, those are in [locale]/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The actual <html> and <body> structure is now in [locale]/layout.tsx
  return children;
}
