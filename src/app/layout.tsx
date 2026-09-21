/* eslint-disable @next/next/no-css-tags -- feuilles de style du thème servies depuis /public/assets */
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CIE Admin",
  description: "Administration du club",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="fr"
      data-layout="horizontal"
      data-topbar-theme="dark"
      data-bs-theme="light"
      data-content-width="default"
      dir="ltr"
      data-sidebar-color="light"
      data-theme-colors="default"
      suppressHydrationWarning
    >
      <head>
        <link rel="shortcut icon" href="/assets/images/favicon.png" />
        <link rel="stylesheet" href="/assets/libs/simplebar/simplebar.min.css" />
        <link rel="stylesheet" href="/assets/libs/swiper/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/libs/nouislider/nouislider.min.css" />
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" id="bootstrap-style" />
        <link rel="stylesheet" href="/assets/css/icons.min.css" />
        <link rel="stylesheet" href="/assets/css/app.min.css" id="app-style" />
        <link rel="stylesheet" href="/assets/css/urbix-next-bridge.css" />
        <link rel="stylesheet" href="/assets/libs/gridjs/theme/mermaid.min.css" />
      </head>

      <body suppressHydrationWarning>
        <div>{children}</div>

        <Script src="/assets/libs/swiper/swiper-bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/libs/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/libs/simplebar/simplebar.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/layout-setup.js" strategy="afterInteractive" />
        <Script src="/assets/js/scroll-top.init.js" strategy="afterInteractive" />
        <Script src="/assets/libs/gridjs/gridjs.umd.js" strategy="afterInteractive" />
        <Script src="/assets/libs/apexcharts/apexcharts.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/dashboard/e-commerce.init.js" strategy="afterInteractive" />
        <Script src="/assets/js/app.js" type="module" strategy="afterInteractive" />
      </body>
    </html>
  );
}
