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
  CFormTextarea,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { addStep, updateStep } from 'src/redux/api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const StepForm = () => {
  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const [newUrl, setNewUrl] = useState('')
  const [isUpdate, setIsUpdate] = useState('')
  const [recipeId, setRecipeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()

  const handleChange = async (fieldName, fieldValue) => {
    clearErrors(fieldName)
    setValue(fieldName, fieldValue)
  }

  const handleFileUpload = (e) => {
    const files = e.target.files[0]
    if (files) {
      const imageUrl = URL.createObjectURL(files)
      setNewUrl(imageUrl)
    } else {
      setNewUrl('')
    }
  }

  const onSubmit = (data) => {
    let formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === 'image') {
        if (data[key][0] !== undefined) {
          formData.append(key, data[key][0])
        }
      } else {
        formData.append(key, data[key])
      }
    })
    if (state && state.id) {
      formData.append('recipeid', state.id)
    }

    if (isUpdate) {
      updateStep(formData, isUpdate)
        .then(() => {
          navigate('/Step', { state: { id: recipeId } })
        })
        .catch((err) => {
          if (!err.response.data.success) {
            toast.error(err.response.data.message)
          } else {
            setIsLoading(false)
          }
        })
    } else {
      addStep(formData)
        .then(() => {
          navigate('/Step', { state: { id: recipeId } })
        })
        .catch((err) => {
          if (!err.response.data.success) {
            toast.error(err.response.data.message)
          } else {
            setIsLoading(false)
          }
        })
    }
  }

  useEffect(() => {
    if (state && state.id) {
      setRecipeId(state.id)
    }
    if (state && state.editData) {
      const { editData, imageUrl } = state

      setIsUpdate(editData._id)
      setValue('name', editData.name)
      setValue('stepno', editData.stepno)
      setValue('description', editData.description)
      setValue('recipeid', editData.recipeid)
      setRecipeId(editData.recipeid)

      setNewUrl(imageUrl + editData.image)
    }
  }, [state, setValue])

  return (
    <div className="bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>{isUpdate ? 'Edit Step' : 'Add Step'}</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  {/* Step Name field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Step Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      {...register('name', { required: 'Step Name is required' })}
                      invalid={!!errors.name}
                      placeholder="Step Name"
                    />
                    <CFormFeedback invalid>Step Name is required</CFormFeedback>
                  </CCol>

                  {/* Step Number field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Step Number</CFormLabel>
                    <CFormInput
                      type="number"
                      id="stepno"
                      {...register('stepno', { required: 'Step Number is required' })}
                      invalid={!!errors.stepno}
                      placeholder="Step Number"
                    />
                    <CFormFeedback invalid>Step Number is required</CFormFeedback>
                  </CCol>

                  {/* Description field */}
                  <CCol md={12}>
                    <CFormLabel>Description</CFormLabel>
                    <CFormTextarea
                      id="description"
                      {...register('description', { required: 'Description is required' })}
                      placeholder="Step Description"
                      rows="4"
                      invalid={!!errors.description}
                    />
                    <CFormFeedback invalid>Description is required</CFormFeedback>
                  </CCol>

                  {/* Image Upload field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>
                      Step Image
                      <span className="errors">Only png, jpg, webp, and jpeg images allowed</span>
                    </CFormLabel>
                    <CFormInput
                      type="file"
                      id="image"
                      {...register('image')}
                      onChange={handleFileUpload}
                    />
                  </CCol>
                  <CCol md={6}>
                    {newUrl && (
                      <>
                        <p>Image preview</p>
                        <img
                          src={newUrl}
                          alt="preview"
                          style={{
                            maxWidth: '40%',
                            borderRadius: '10px',
                            maxHeight: '40%',
                          }}
                        />
                      </>
                    )}
                  </CCol>

                  {/* Submit Button */}
                  <CCol md={12} className="text-center submitButton">
                    {isLoading ? (
                      <CButton disabled>
                        <CSpinner component="span" size="sm" aria-hidden="true" />
                        Loading...
                      </CButton>
                    ) : (
                      <CButton type="submit" className="AddButton">
                        {isUpdate ? 'Update' : 'Add'}
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

export default StepForm
