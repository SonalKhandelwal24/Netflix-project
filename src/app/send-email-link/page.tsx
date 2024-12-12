import { Suspense } from 'react'
import SendEmailLink from '../components/Send-email-link'
 
function SearchBarFallback() {
  return <>placeholder</>
}
 
export default function Page() {
  return (
    <>
        <Suspense fallback={<SearchBarFallback />}>
          <SendEmailLink />
        </Suspense>
    </>
  )
}