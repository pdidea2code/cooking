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
import { addNotification, updateNotification } from 'src/redux/api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const NotificationForm = () => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const [newUrl, setNewUrl] = useState('')
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { state } = useLocation()

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
    isUpdate === ''
      ? addNotification(data)
          .then(() => navigate('/Notification'))
          .catch((err) => {
            toast.error(err.response?.data?.message || 'Something went wrong!')
            setIsLoading(false)
          })
      : updateNotification(data, isUpdate)
          .then(() => navigate('/Notification'))
          .catch((err) => {
            toast.error(err.response?.data?.message || 'Something went wrong!')
            setIsLoading(false)
          })
  }

  useEffect(() => {
    if (state) {
      const { editData, imageUrl } = state
      console.log(state)
      setIsUpdate(editData._id)
      setValue('title', editData.title)
      setValue('description', editData.description)
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
                <strong>Notification Form</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                  {/* Title field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Title</CFormLabel>
                    <CFormInput
                      type="text"
                      id="title"
                      {...register('title', { required: 'Title is required' })}
                      invalid={!!errors.title}
                      placeholder="Title"
                    />
                    <CFormFeedback invalid>Title is required</CFormFeedback>
                  </CCol>

                  {/* Description field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Description</CFormLabel>
                    <CFormInput
                      type="text"
                      id="description"
                      {...register('description', { required: 'Description is required' })}
                      invalid={!!errors.description}
                      placeholder="Description"
                    />
                    <CFormFeedback invalid>Description is required</CFormFeedback>
                  </CCol>

                  {/* Submit button */}
                  <CCol md={12} className="text-center submitButton">
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

export default NotificationForm
