'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { DESINAHUB_TRACKING_CONFIG } from '@/lib/tracking';

const GA_ID = DESINAHUB_TRACKING_CONFIG.GOOGLE_ANALYTICS_ID;
const META_ID = DESINAHUB_TRACKING_CONFIG.FACEBOOK_PIXEL_ID;
const TIKTOK_ID = DESINAHUB_TRACKING_CONFIG.TIKTOK_PIXEL_ID;

const GA_INIT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
`;

const FACEBOOK_INIT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_ID}');
fbq('track', 'PageView');
`;

const TIKTOK_INIT = `
!(function(w,d,t){
w.TiktokAnalyticsObject=t;
var ttq=w[t]=w[t]||[];
ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments)))}};
for(var i=0;i<ttq.methods.length;i++){ttq.setAndDefer(ttq,ttq.methods[i]);}
ttq.load=function(e,n){
var r='https://analytics.tiktok.com/i18n/pixel/events.js';
ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;
ttq._t=ttq._t||{};ttq._t[e]=+new Date();
ttq._o=ttq._o||{};ttq._o[e]=n||{};
var script=d.createElement('script');
script.type='text/javascript';script.async=true;
script.src=r+'?sdkid='+encodeURIComponent(e)+'&lib='+t;
var first=d.getElementsByTagName('script')[0];
first.parentNode.insertBefore(script,first);
};
ttq.load('${TIKTOK_ID}');
ttq.page();
})(window, document, 'ttq');
`;

export function Tracking() {
  const pathname = usePathname();
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    window.gtag?.('config', GA_ID, { page_path: pathname });
    window.fbq?.('track', 'PageView');
    window.ttq?.page?.();
  }, [pathname]);

  return (
    <>
      <Script
        id="ga4-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: GA_INIT }} />
      <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: FACEBOOK_INIT }} />
      <Script id="tiktok-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: TIKTOK_INIT }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
