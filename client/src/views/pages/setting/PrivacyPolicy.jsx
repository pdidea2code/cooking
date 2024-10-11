import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormLabel,
  CRow,
  CSpinner,
  CFormTextarea,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { updateGeneralSettings, getGeneralSettings } from 'src/redux/api/api'

const PrivacyPolicy = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()

  const fetchSettings = async () => {
    try {
      const settings = await getGeneralSettings()
      const data = settings.data.info.privacypolicy

      setValue('privacypolicy', data)
    } catch (err) {
      toast.error('Failed to fetch settings')
    }
  }
  useEffect(() => {
    fetchSettings()
  }, [setValue])
  const onSubmit = (data) => {
    setIsLoading(true)
    updateGeneralSettings(data)
      .then((res) => {
        fetchSettings()
        setIsLoading(false)
        toast.success('Update Sussfully')
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.success === false
            ? 'Must fill all required fields'
            : 'Something went wrong!'
        toast.error(errorMessage)
        setIsLoading(false)
      })
  }

  return (
    <div className="bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>Privacy Policy</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <CCol md={12}>
                    <CFormLabel>Privacy Policy</CFormLabel>
                    <CFormTextarea
                      id="privacypolicy"
                      {...register('privacypolicy', { required: 'Privacy Policy is required' })}
                      placeholder="Privacy Policy"
                      invalid={!!errors.privacypolicy}
                    />
                    <CFormFeedback invalid={!!errors.privacypolicy}>
                      {errors.privacypolicy?.message}
                    </CFormFeedback>
                  </CCol>
                  <CCol md={12} className="text-center submitButton">
                    {isLoading ? (
                      <CButton disabled>
                        <CSpinner component="span" size="sm" aria-hidden="true" />
                        Loading...
                      </CButton>
                    ) : (
                      <CButton type="submit" className="AddButton">
                        Update
                      </CButton>
                    )}
                  </CCol>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default PrivacyPolicy
