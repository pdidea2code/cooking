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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { changePassword } from 'src/redux/api/api'
import Cookies from 'js-cookie'

const ChangePassword = () => {
  const { register, handleSubmit } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const adminString = Cookies.get('admin')
  const admin = JSON.parse(adminString)

  const onSubmit = async (data, e) => {
    setIsLoading(true)
    changePassword(data)
      .then((res) => {
        // console.log(res)
        if (res.status === 200 && res.data.success) {
          e.target.reset()

          toast.success(res.data.message)
          setIsLoading(false)
        } else {
          setError(res.data.message)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.log(err.response)
        if (err.response.status === 401 || 400) {
          toast.error(err.response.data.message)
          setIsLoading(false)
        }
      })
  }

  return (
    <div className="bg-light min-vh-100 profile">
      <CContainer className="profile-container">
        <CRow>
          <CCol>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-center mb-4">Change Password</h2>
                    <ToastContainer />
                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>
                    <CInputGroup className="mb-4">
                      <CFormInput {...register('_id')} type="hidden" value={admin.id} />

                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('oldPassword', { required: 'Old Password is required' })}
                        type="password"
                        placeholder="oldPassword"
                        autoComplete="current-password"
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-4">
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

                    <CInputGroup className="mb-4">
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

                    <CRow className="update-button">
                      <CCol xs={12} md={4} className="mb-2 mb-md-0">
                        <CButton
                          type="submit"
                          className="w-100 custom-color"
                          style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                        >
                          {isLoading ? 'Loading...' : 'Reset Password'}
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

export default ChangePassword
