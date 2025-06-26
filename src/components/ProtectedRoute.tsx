import { Navigate } from 'react-router-dom'
import { sessionManager } from '../utils/sessionManager'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const isAuthenticated = sessionManager.isAuthenticated()
  const userRole = sessionManager.getRole()

  console.log('ProtectedRoute: Auth check', { isAuthenticated, userRole, requiredRole });

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('ProtectedRoute: Role mismatch, redirecting to home');
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>
}

export default ProtectedRoute
