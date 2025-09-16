import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import LoginForm from '../pages/Login'
import SignupForm from '../pages/SignUp'
import PageNotFound from '../pages/PageNotFound'
import ProtectedRoutes from './Authentication'
import Dashboard from '../pages/Dashobard'
import FormPage from '../pages/Form'
import ResponseForm from '../pages/Response'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <LoginForm />
  },
  {
    path: '/signUp',
    element: <SignupForm />
  },
  {
    path: '*',
    element: <PageNotFound />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoutes><Dashboard /></ProtectedRoutes> 
  },
  {
    path:'/form/:id',
    element: <FormPage />
  },
  {
    path: '/response/form/:id',
    element: <ResponseForm />
  }
])

export default router