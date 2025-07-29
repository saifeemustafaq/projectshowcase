import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Showcase",
  description: "A beautiful gallery showcasing amazing projects and applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Development utility to clear project data
                window.clearProjectData = function() {
                  localStorage.removeItem('project_showcase_projects');
                  sessionStorage.removeItem('project_showcase_session');
                  console.log('Project data cleared. Refresh to see new demo data.');
                  location.reload();
                };
                console.log('Development mode: Run clearProjectData() to reset demo data');
              `
            }}
          />
        )}
      </body>
    </html>
  );
}
