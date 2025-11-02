import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harmonia.io",
  description: "Sync YouTube playlists to Spotify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
