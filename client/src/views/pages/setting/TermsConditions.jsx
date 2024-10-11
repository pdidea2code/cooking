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

const TermsConditions = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchSettings = async () => {
    try {
      const settings = await getGeneralSettings()

      const data = settings.data.info.termsandcondition
      setValue('termsandcondition', data)
    } catch (err) {
      toast.error('Failed to fetch settings')
    }
  }
  useEffect(() => {
    fetchSettings()
  }, [setValue])

  const onSubmit = (data) => {
    setIsLoading(true)
    updateGeneralSettings(data, isUpdate)
      .then((res) => {
        fetchSettings()
        toast.success('Update Successfully')
        setIsLoading(false)
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
                <strong>Terms & Conditions</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <CCol md={12}>
                    <CFormLabel>Terms & Conditions</CFormLabel>
                    <CFormTextarea
                      id="termsandcondition"
                      {...register('termsandcondition', {
                        required: 'Terms and Conditions is required',
                      })}
                      placeholder="Terms & Conditions"
                      invalid={!!errors.termsandcondition}
                    />
                    <CFormFeedback invalid={!!errors.termsandcondition}>
                      {errors.termsandcondition?.message}
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

export default TermsConditions
