import Head from 'next/head'
import Script from 'next/script'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'




export default function Home() {
  const [queryLoaded, setQueryLoaded] = useState(null)
  const [widgetOpened, setWidgetOpened] = useState(true)
  const [zendeskWidgetKey, setZendeskWidgetKey] = useState('f2d80132-163c-4ad4-858f-960bf79afac9')
  const [language, setLanguage] = useState('id')
  const [jwtKey, setJwtKey] = useState(null)
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setQueryLoaded(true)
      if (router.query['widget-key'] && router.query['widget-key'] !== '') {
        setZendeskWidgetKey(router.query['widget-key'])
      }
      if (router.query['key'] && router.query['key'] !== '') {
        setJwtKey(router.query['key'])
      }
      if (router.query['lang'] && router.query['lang'] !== '') {
        setLanguage(router.query['lang'])
      }
    }
  }, [router.isReady])

  const triggerParent = (e) => {
    e.preventDefault();
    window.parent.postMessage(
      JSON.stringify({
        event_code: "ym-client-event",
        data: "Widget Closed"
      }), "*");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ZE Widget</title>
      </Head>
      <main className={styles.main}>
        {!widgetOpened && (
          <button onClick={() => { zE('messenger', 'open'); }} className={styles.toggleButton}>Continue to chat with Agent</button>
        )}
        {queryLoaded && (
          <div>
            <Script id="ze-snippet" src={`https://static.zdassets.com/ekr/snippet.js?key=${zendeskWidgetKey}`}
              onLoad={() => {
                zE('messenger', 'open');
                setWidgetOpened(true);
                zE('messenger:on', 'open', function () {
                  setWidgetOpened(true);
                })
                zE('messenger:set', 'locale', language);
                if (jwtKey && jwtKey !== '') {
                  zE('messenger', 'loginUser', function (callback) {
                    callback(jwtKey);
                  })
                }
                zE('messenger:on', 'close', () => {
                  setWidgetOpened(false);
                  triggerParent();
                });
              }} />
          </div>
        )}
      </main>
    </div>
  )
}
