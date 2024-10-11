import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardGroup,
  CCardBody,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import { adminLogin } from 'src/redux/api/api'
import { LOGIN_SUCCESS } from 'src/redux/actions/action'
import Cookies from 'js-cookie'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    try {
      const res = await adminLogin(data)
      if (res.status === 400 || res.data.success === false) {
        setError(res.data.message)

        setIsLoading(false)
      } else {
        Cookies.set('accessToken', res.data.info.admin.accessToken, {
          sameSite: 'Strict',
          secure: true,
        })
        Cookies.set('refreshToken', res.data.info.refresh_token, {
          sameSite: 'Strict',
          secure: true,
        })
        localStorage.setItem('refreshToken', res.data.info.refresh_token)

        const adminObject = {
          name: res.data.info.admin.name,
          id: res.data.info.admin._id,
          email: res.data.info.admin.email,
          img: res.data.info.admin.image ? res.data.info.baseUrl + res.data.info.admin.image : null,
        }
        Cookies.set('admin', JSON.stringify(adminObject), { sameSite: 'Strict', secure: true })
        setIsLoading(false)
        dispatch({
          type: LOGIN_SUCCESS,
          data,
        })
        navigate('/dashboard')
      }
    } catch (err) {
      console.log(err)
      if (err.response && (err.response.status === 401 || !err.response.data.success)) {
        setError(err.response.data.message)
        // toast.error(err.response.data.message)
        setIsLoading(false)
      } else {
        setError('Something is wrong!')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="login-page bg-light min-vh-100">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={4} md={6} sm={6}>
            <CCardGroup>
              <CCard className="p-4" style={{ backgroundColor: '#ffffff9c ' }}>
                <CCardBody style={{ backgroundColor: 'ff5733' }}>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center mb-4">Login</h1>
                    <p className="text-medium-emphasis text-center text-black">
                      Sign In to your account
                    </p>
                    <div in={error}>
                      <b>
                        <p className="errors" style={{ textShadow: '0px 0px 2px black' }}>
                          {error ? (
                            <>
                              {' '}
                              {error} <span hidden={true}>{toast.error(error)} </span>{' '}
                            </>
                          ) : (
                            ''
                          )}
                        </p>
                      </b>
                    </div>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <ToastContainer />
                      <CFormInput
                        className="login-input"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Enter Email"
                        autoComplete="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        className="login-input"
                        {...register('password', { required: 'Password is required' })}
                        type="password"
                        placeholder="Enter Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol lg={12} md={6} xs={12} className="mb-3 mb-md-0 mt-2">
                        <CButton type="submit" className="w-100 custom-color" disabled={isLoading}>
                          {isLoading ? 'Loading...' : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
