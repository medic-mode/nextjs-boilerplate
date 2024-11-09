
import Script from "next/script";


export default function custom404() {
  return (
    <>
    <h1>Reloading</h1>
    <Script id='redirect'>
      {
        `document.location.href="/"`
      }
      </Script>
    </>
  )
}
