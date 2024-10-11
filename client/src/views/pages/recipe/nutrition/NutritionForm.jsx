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
import {
  addIngredient,
  addNutrition,
  getAllUnit,
  updateIngredient,
  updateNutrition,
} from 'src/redux/api/api'

const NutritionForm = () => {
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

  const onSubmit = (data) => {
    const formData = {
      name: data.name,
      amount: data.amount,
      recipeid: state?.editData?.recipeid || '',
    }

    isUpdate === ''
      ? addNutrition(formData)
          .then((res) => {
            navigate('/Nutrition')
          })
          .catch((err) => {
            if (!err.response.data.success) {
              toast.error(err.response.data.message)
            } else {
              setIsLoading(false)
            }
          })
      : updateNutrition(formData, isUpdate)
          .then((res) => {
            navigate('/Nutrition', { state: { id: state.editData.recipeid } })
          })
          .catch((err) => {
            console.log(err)
            if (!err.response.data.success) {
              toast.error('Must fill all required fields')
            } else {
              toast.error('Something went wrong!')
            }
            setIsLoading(false)
          })
  }

  useEffect(() => {
    if (state) {
      const { editData } = state
      setIsUpdate(editData._id)
      setValue('name', editData.name)
      setValue('amount', editData.amount)
    } else {
      navigate('/Nutrition')
    }
  }, [])

  return (
    <div className="bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>Nutrition Form</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Nutrition Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('name', {
                        required: 'Nutrition name is required',
                      })}
                      placeholder="Nutrition name"
                      invalid={!!errors.name}
                    />
                    <CFormFeedback invalid>Nutrition name is required</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Amount</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault02"
                      {...register('amount', {
                        required: 'Amount is required',
                      })}
                      placeholder="Nutrition amount"
                      invalid={!!errors.amount}
                    />
                    <CFormFeedback invalid>Amount is required</CFormFeedback>
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

export default NutritionForm
