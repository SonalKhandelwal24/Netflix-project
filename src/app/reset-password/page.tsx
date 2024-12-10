import { Suspense } from 'react'
import ResetPassword from '../components/Reset-password'
 
function SearchBarFallback() {
  return <>placeholder</>
}
 
export default function Page() {
  return (
    <>
      <nav>
        <Suspense fallback={<SearchBarFallback />}>
          <ResetPassword />
        </Suspense>
      </nav>
      <h1>Dashboard</h1>
    </>
  )
}