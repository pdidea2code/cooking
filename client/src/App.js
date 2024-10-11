import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import ForgotPassword from './views/pages/auth/ForgotPassword'
import ResetPassword from './views/pages/auth/ResetPassword'
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import MinimalLayout from './layout/MinimalLayout'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/auth/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

export default function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  const PublicRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('accessToken')) ? (
      <Navigate to="/dashboard" />
    ) : (
      <MinimalLayout />
    )
  }

  const PrivateRoute = () => {
    return isAuthenticated || Boolean(Cookies.get('accessToken')) ? (
      <DefaultLayout />
    ) : (
      <Navigate to="/" />
    )
  }
  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/" element={<PublicRoute />}>
            <Route exact path="/" name="Login Page" element={<Login />} />
            <Route
              exact
              path="/forgot-password"
              name="Forgot Password Page"
              element={<ForgotPassword />}
            />
            <Route
              path="/reset-password/:token/:adminid"
              name="Reset Password Page"
              element={<ResetPassword />}
            />
          </Route>
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
