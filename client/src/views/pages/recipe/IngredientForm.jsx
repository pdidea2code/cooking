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
import { addIngredient, getAllUnit, updateIngredient } from 'src/redux/api/api'

const IngredientForm = () => {
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
  const [unit, setUnit] = useState([])
  const { state } = useLocation()
  const handleChange = async (fieldName, fieldValue) => {
    clearErrors(fieldName, fieldValue)
    setValue(fieldName, fieldValue)
  }

  const getunit = async () => {
    try {
      const respo = await getAllUnit()
      const data = respo.data.info
      setUnit(data)
    } catch (error) {
      if (!error.response.data.success) {
        toast.error(error.response.data.message)
      } else {
        setIsLoading(false)
      }
    }
  }
  const onSubmit = (data) => {
    console.log(data)
    isUpdate === ''
      ? addIngredient(data)
          .then((res) => {
            navigate('/Ingredient')
          })
          .catch((err) => {
            if (!err.response.data.success) {
              toast.error(err.response.data.message)
            } else {
              setIsLoading(false)
            }
          })
      : updateIngredient(data, isUpdate)
          .then((res) => {
            navigate('/Ingredient', { state: { id: state.editData.recipeid } })
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
      setValue('name', editData.name)
      if (editData.unit == null) {
      } else {
        setValue('unit', editData.unit._id)
      }
      setValue('amount', editData.amount)
    } else {
      navigate('/Ingredient')
    }
    getunit()
  }, [])
  return (
    <div className=" bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>Ingredient Form</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3 " onSubmit={handleSubmit(onSubmit)}>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Ingredient</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('name', {
                        required: 'Ingredient is required',
                      })}
                      placeholder="ingredient name"
                      invalid={!!errors.name}
                    />
                    <CFormFeedback invalid>Ingredient is required</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Amount</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('amount', {
                        required: 'Ingredient is required',
                      })}
                      placeholder="ingredient amount"
                      invalid={!!errors.amount}
                    />
                    <CFormFeedback invalid>Ingredient is required</CFormFeedback>
                  </CCol>
                  <CCol xl={6} md={12}>
                    <CFormLabel>Unit</CFormLabel>
                    <CFormSelect
                      id="unit"
                      name="unit"
                      {...register('unit')}
                      invalid={!!errors.languages}
                      value={getValues('unit')}
                      onChange={(e) => handleChange('unit', e.target.value)}
                    >
                      <option value="">Select Unit</option>
                      {unit?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                    {errors.languages && <div className="errors">{errors.languages.message}</div>}
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

export default IngredientForm
