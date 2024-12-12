import { Suspense } from 'react'
import ResetPassword from '../components/Reset-password'
 
function SearchBarFallback() {
  return <>placeholder</>
}
 
export default function Page() {
  return (
    <>
        <Suspense fallback={<SearchBarFallback />}>
          <ResetPassword />
        </Suspense>
    </>
  )
}