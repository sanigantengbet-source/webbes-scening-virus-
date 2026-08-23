import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VirusScan Pro — Multi-Engine Malware & Threat Scanner',
  description: 'Pemindai keamanan komprehensif untuk deteksi virus, malware, phishing, dan ancaman berbahaya pada berkas, URL website, dan hash dengan 72 security engines.',
  openGraph: {
    title: 'VirusScan Pro — Multi-Engine Threat Scanner',
    description: 'Pindai berkas, tautan URL, dan hash checksum dengan 72 security engines independen.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VirusScan Pro — Multi-Engine Threat Scanner',
    description: 'Pindai berkas dan tautan URL bebas malware dengan 72 security engines.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#f6f6f2] text-zinc-900 antialiased min-h-screen selection:bg-zinc-900 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
