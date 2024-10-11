import React, { useState } from 'react'
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
import { cilUser } from '@coreui/icons'
import { NavLink } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { forgotPassword } from 'src/redux/api/api'

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState()
  const [error, setError] = useState()

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    await forgotPassword(data)
      .then((res) => {
        if (res.status === 400 || res.data.success === false) {
          setError(res.data.message)
          setIsLoading(false)
        } else {
          setIsLoading(false)
          setSuccess('Check your mail box.')
          toast.success(res.data.message)
        }
      })
      .catch((err) => {
        if (err.response.status === 401 || !err.response.data.success) {
          setError(err.response.data.message)
          setIsLoading(false)
        } else {
          setError('Something is wrong!')
          setIsLoading(false)
        }
      })
  }

  return (
    <div className="login-page bg-light min-vh-100">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol lg={4} md={6} sm={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-center mb-4">Forgot Password </h2>
                    <p className="text-medium-emphasis text-center">
                      Enter your email and we send you a link to reset your password
                    </p>

                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('email', { required: 'Email is required' })}
                        placeholder="email"
                        autoComplete="email"
                      />
                    </CInputGroup>

                    <div in={success}>
                      <p className="success">{success ? success : ''}</p>
                    </div>

                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>
                    <ToastContainer />

                    <CRow>
                      <CCol lg={12} md={6} xs={12} className="mb-2 mb-md-0">
                        <CButton type="submit" className="w-100 custom-color">
                          {isLoading ? 'Loading...' : 'Submit'}
                        </CButton>
                      </CCol>

                      <CCol lg={12} md={6} xs={12} className="text-center text-md-right">
                        <NavLink to="/">
                          <CButton color="link" className="px-0">
                            Back to Login
                          </CButton>
                        </NavLink>
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

export default ForgotPassword
