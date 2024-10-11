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
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CFormSelect,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addPlan, updatePlan } from 'src/redux/api/api'

const PlanForm = () => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const handleChange = async (fieldName, fieldValue) => {
    clearErrors(fieldName, fieldValue)
    setValue(fieldName, fieldValue)
  }
  const onSubmit = (data) => {
    isUpdate === ''
      ? addPlan(data)
          .then((res) => {
            navigate('/plan')
          })
          .catch((err) => {
            if (!err.response.data.success) {
              toast.error(err.response.data.message)
            } else {
              setIsLoading(false)
            }
          })
      : updatePlan(data, isUpdate)
          .then((res) => {
            navigate('/plan')
          })
          .catch((err) => {
            if (!err.response.data.success) {
              toast.error('Must be Fill All Field required')
            } else {
              toast.error('Something Went Wrong!')
            }
            setIsLoading(false)
          })
  }
  useEffect(() => {
    if (state) {
      const { editData } = state

      setIsUpdate(editData._id)
      setValue('duration', editData.duration)
      setValue('amount', editData.amount)
      setValue('day', editData.day)
    }
  }, [])
  return (
    <div className=" bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>Plan Form</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3 " onSubmit={handleSubmit(onSubmit)}>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Duration</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('duration', {
                        required: 'Duration is required',
                      })}
                      placeholder=" Duration"
                      invalid={!!errors.duration}
                    />
                    <CFormFeedback invalid>Duration is required</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Amount</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('amount', {
                        required: 'Amount is required',
                      })}
                      placeholder="Plan Amount"
                      invalid={!!errors.amount}
                    />
                    <CFormFeedback invalid>Amount is required</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Day</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('day', {
                        required: 'day is required',
                      })}
                      placeholder="Day"
                      invalid={!!errors.amount}
                    />
                    <CFormFeedback invalid>Day is required</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12} className="text-center submitButton">
                    {isLoading ? (
                      <CButton disabled>
                        <CSpinner component="span" size="sm" aria-hidden="true" />
                        Loading...
                      </CButton>
                    ) : (
                      <CButton type="submit" className="AddButton">
                        {isUpdate === '' ? 'Add' : 'Update'}
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

export default PlanForm
