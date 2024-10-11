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
import { addCategory, updateCategory } from 'src/redux/api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CategoryForm = () => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const [newUrl, setNewUrl] = useState()
  const [isUpdate, setIsUpdate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // const [languageOptions, setLanguageOptions] = useState([])
  const { state } = useLocation()
  const handleChange = async (fieldName, fieldValue) => {
    clearErrors(fieldName, fieldValue)
    // if (fieldName == 'languages') {
      setValue(fieldName, fieldValue)
    // }
  }

  const handleFileUpload = (e) => {
    const files = e.target.files[0]
    if (files) {
      const imageUrl = URL.createObjectURL(files)
      setNewUrl(imageUrl)
      // clearErrors('newsImage')
    } else {
      setNewUrl('')
    }
  }
  // const LanguagesList = () => {
  //   getAllLanguage()
  //     .then((res) => {
  //       setLanguageOptions(res.data.language)
  //     })
  //     .catch((err) => {
  //       toast.error(err)
  //     })
  // }

  const onSubmit = (data) => {
    let formData = new FormData() //formdata object
    Object.keys(data).forEach(function (key) {
      if (key === 'image') {
        if (data[key][0] !== undefined) {
          formData.append(key, data[key][0])
        }
      } else {
        formData.append(key, data[key])
      }
    })
    
    isUpdate === ''
      ? addCategory(formData)
          .then((res) => {
            navigate('/category')
          })
          .catch((err) => {
            if (!err.response.data.success) {
              toast.error(err.response.data.message)
            } else {
              setIsLoading(false)
            }
          })
      : updateCategory(formData, isUpdate)
          .then((res) => {
            navigate('/category')
          })
          .catch((err) => {
            console.log(err);
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
      const { editData, imageUrl } = state
      setIsUpdate(editData._id)
      setValue('name', editData.name)
      // setValue('languages', editData.languages._id)
      setNewUrl(imageUrl + editData.image)
    }
    // LanguagesList()
  }, [])
  return (
    <div className=" bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>Category Form</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3 " onSubmit={handleSubmit(onSubmit)}>
                  {/* Category Name field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Category Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      {...register('name', { required: 'category Name is required' })}
                      invalid={!!errors.name}
                      placeholder="category Name"
                    />
                    <CFormFeedback invalid>category Name is required</CFormFeedback>
                  </CCol>
                  {/* end field */}

                
                  <CCol xl={6} md={12}>
                    <CFormLabel>
                      Recipe Image
                      <span className="errors">Only png, jpg, webp and jpeg image allow</span>
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
                          alt="newUrl"
                          style={{
                            maxWidth: '40%',
                            borderRadius: '10px',
                            maxHeight: '40%',
                          }}
                        />
                      </>
                    )}
                  </CCol>

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

export default CategoryForm
