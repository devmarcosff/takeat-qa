import { InstallPWA } from '@/components/InstallPWA'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(() => {
            console.log('ServiceWorker registration successful')
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err)
          })
      })
    }
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <InstallPWA />
    </>
  )
} 