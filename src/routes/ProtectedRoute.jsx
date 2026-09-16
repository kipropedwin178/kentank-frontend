import { Navigate, Outlet } from 'react-router-dom'


function ProtectedRoute() {
  const token = localStorage.getItem(
    'kentank_admin_token'
  )

  if (!token) {
    return (
      <Navigate
        to="/kentankd/login"
        replace
      />
    )
  }

  return <Outlet />
}


export default ProtectedRoute