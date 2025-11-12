import '@/styles/bootstrap.min.css';
import '@/styles/responsive.css';
import '@/styles/coustome.css';
import '@/styles/style.css';
import '@/styles/easy-responsive-tabs.css';
import '@/styles/newStyle.css';

import '@/styles/w3/footerCompanies.css';

import AppLayout from '../../components/layout/AppLayout';
import Script from 'next/script';
import { useEffect } from 'react';

import * as gtag from '../../lib/gtag';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => gtag.pageview(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle');
  }, []);

  const getLayout = Component.getLayout || ((page) => <AppLayout>{page}</AppLayout>);

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TBKRBV2');
          `,
        }}
      />

      {/* Google Analytics */}
      {/* <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=UA-186556997-1"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-186556997-1');
          `,
        }}
      /> */}

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-DFRJ2F85E7"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DFRJ2F85E7');
          `,
        }}
      />

        {/* Font Awesome */}
      <Script
        src="https://kit.fontawesome.com/ef28b1feab.js"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />      
      

      {/* <AppLayout>
        <Component {...pageProps} />
      </AppLayout>       */}

      {getLayout(<Component {...pageProps} />)}
    </>
  );
}
