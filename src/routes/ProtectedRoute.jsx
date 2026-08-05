import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// Gates access to authenticated-only routes. Waits for the app-boot token-validation
// check (bootstrapAuth) to resolve before deciding anything — this is what prevents a
// flash-redirect to /login on a hard refresh of a still-valid session.
export default function ProtectedRoute({ children }) {
  const { token, user, bootstrapped } = useSelector((state) => state.auth)

  if (!bootstrapped) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}
