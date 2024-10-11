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
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { resetPassword } from 'src/redux/api/api'

const ResetPassword = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const { token, adminid } = useParams()

  const onSubmit = async (data) => {
    await resetPassword(data)
      .then((response) => {
        if (response.status === 400 || response.data.success === false) {
          setError(response.data.message)
          setIsLoading(false)
        } else {
          setIsLoading(false)

          toast.success(response.data.message)
          navigate('/')
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
                    <h1 className="text-center mb-4">Reset Your Password</h1>
                    <p className="text-medium-emphasis text-center">
                      Enter a new password for this email
                    </p>
                    <ToastContainer />
                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>

                    <CInputGroup className="mb-2">
                      <CFormInput {...register('token')} type="hidden" value={token} />
                      <CFormInput {...register('id')} type="hidden" value={adminid} />
                    </CInputGroup>

                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('otp', { required: 'otp is required' })}
                        placeholder="otp"
                        autoComplete="Otp"
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('newPassword', { required: 'New password is required' })}
                        type="password"
                        placeholder="new-password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('confirmPassword', {
                          required: 'confirm password is required',
                        })}
                        type="password"
                        placeholder="confirm Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol lg={12} md={6} xs={12} className="mb-2 mb-md-0">
                        {/* <NavLink to="/"> */}
                        <CButton type="submit" className="w-100 custom-color">
                          {isLoading ? 'Loading...' : 'Reset Password'}
                        </CButton>
                        {/* </NavLink> */}
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

export default ResetPassword
