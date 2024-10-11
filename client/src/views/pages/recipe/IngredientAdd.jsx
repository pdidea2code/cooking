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
import { addIngredient, getAllUnit } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useLocation, useNavigate } from 'react-router-dom'

const IngredientAdd = () => {
  const [units, setUnits] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      elements: [{ name: '', amount: '', unitId: '', idValue: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'elements',
  })

  const fetchUnits = async () => {
    try {
      const response = await getAllUnit()
      setUnits(response.data.info)
    } catch (error) {
      if (!error.response.data.success) {
        toast.error(error.response.data.message)
      }
      setIsLoading(false)
    }
  }

  const handleAddElement = () => {
    append({ name: '', amount: '', unitId: '', idValue: state.editData })
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
        unit: item.unitId || null, // Convert empty unitId to null
        recipeid: state.editData,
      }))

      const response = await addIngredient(transformedData)

      toast.success('Data submitted successfully!')
      navigate('/Ingredient', { state: { id: state.editData } })
    } catch (error) {
      console.error('Error submitting form data:', error)
      toast.error('Error submitting form data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  return (
    <>
      <CContainer className="mt-3">
        <CRow>
          <CCol md={12}>
            <CCard>
              <CCardHeader>
                <strong>Ingredient Form</strong>
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
                            required: 'Text Value is required',
                          })}
                          invalid={!!errors.elements?.[index]?.name}
                          placeholder="Text Value"
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
                            required: 'Number Value is required',
                          })}
                          invalid={!!errors.elements?.[index]?.amount}
                          placeholder="Number Value"
                        />
                        {errors.elements?.[index]?.amount && (
                          <CFormText className="text-danger">
                            {errors.elements[index].amount.message}
                          </CFormText>
                        )}
                      </CCol>
                      <CCol xl={3} md={12}>
                        <CFormLabel>Unit</CFormLabel>
                        <CFormSelect {...register(`elements.${index}.unitId`)}>
                          <option value="">Select Unit</option>
                          {units.map((unit) => (
                            <option key={unit._id} value={unit._id}>
                              {unit.name}
                            </option>
                          ))}
                        </CFormSelect>
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
                          Add
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

export default IngredientAdd
