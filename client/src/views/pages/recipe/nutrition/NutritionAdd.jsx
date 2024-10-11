import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CFormText,
  CFormSelect,
} from '@coreui/react'
import { useForm, useFieldArray } from 'react-hook-form'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { addIngredient, addNutrition } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useLocation, useNavigate } from 'react-router-dom'

const NutritionAdd = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      elements: [{ name: '', amount: '', unitId: '', idValue: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'elements',
  })

  const handleAddElement = () => {
    append({ name: '', amount: '', idValue: state.id })
  }

  const handleRemoveElement = (index) => {
    remove(index)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const transformedData = data.elements.map((item) => ({
        name: item.name,
        amount: item.amount,
        recipeid: state.id,
      }))

      const response = await addNutrition(transformedData)

      toast.success('Data submitted successfully!')
      navigate('/Nutrition', { state: { id: state.id } })
    } catch (error) {
      console.error('Error submitting form data:', error)
      toast.error('Error submitting form data.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <CContainer className="mt-3">
        <CRow>
          <CCol md={12}>
            <CCard>
              <CCardHeader>
                <strong>Nutrition Form</strong>
              </CCardHeader>
              <CCardBody className="mt-3">
                <ToastContainer />
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  {fields.map((field, index) => (
                    <CRow key={field.id} className="mb-3 align-items-end">
                      <CCol xl={3} md={12}>
                        <CFormLabel>Name</CFormLabel>
                        <CFormInput
                          type="text"
                          {...register(`elements.${index}.name`, {
                            required: 'Name is required',
                          })}
                          invalid={!!errors.elements?.[index]?.name}
                          placeholder="Name"
                        />
                        {errors.elements?.[index]?.name && (
                          <CFormText className="text-danger">
                            {errors.elements[index].name.message}
                          </CFormText>
                        )}
                      </CCol>
                      <CCol xl={3} md={12}>
                        <CFormLabel>Amount</CFormLabel>
                        <CFormInput
                          type="text"
                          {...register(`elements.${index}.amount`, {
                            required: 'Amount is required',
                          })}
                          invalid={!!errors.elements?.[index]?.amount}
                          placeholder="Amount"
                        />
                        {errors.elements?.[index]?.amount && (
                          <CFormText className="text-danger">
                            {errors.elements[index].amount.message}
                          </CFormText>
                        )}
                      </CCol>

                      <CCol xl={2} md={12} className="mt-2">
                        <CButton
                          onClick={() => handleRemoveElement(index)}
                          color="danger"
                          className="me-2"
                        >
                          Remove
                        </CButton>
                      </CCol>
                      {index === fields.length - 1 && (
                        <CCol xl={1} md={12}>
                          <CButton onClick={handleAddElement} color="primary" className="me-2">
                            <CIcon icon={cilPlus} />
                          </CButton>
                        </CCol>
                      )}
                    </CRow>
                  ))}
                  <CRow className="mt-3">
                    <CCol md={12} className="text-center">
                      {isLoading ? (
                        <CButton disabled>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Loading...
                        </CButton>
                      ) : (
                        <CButton type="submit" className="AddButton">
                          Submit
                        </CButton>
                      )}
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default NutritionAdd
