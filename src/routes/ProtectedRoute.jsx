import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// Gates access to authenticated-only routes. Waits for the app-boot token-validation
// check (bootstrapAuth) to resolve before deciding anything — this is what prevents a
// flash-redirect to /login on a hard refresh of a still-valid session.
export default function ProtectedRoute({ children }) {
  const { token, user, bootstrapped } = useSelector((state) => state.auth)

  if (!bootstrapped) {
    return (
      <div className="dash-auth-loading">
        <div className="dash-auth-loading__spinner" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}
