import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardGroup,
  CCardBody,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilEnvelopeClosed } from '@coreui/icons'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UpdateProfile } from 'src/redux/api/api'
import Cookies from 'js-cookie'

const EditProfile = () => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const adminString = Cookies.get('admin')
  const admin = adminString ? JSON.parse(adminString) : null

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)

    let formData = new FormData()
    Object.keys(data).forEach(function (key) {
      if (key === 'image') {
        if (data[key][0] !== undefined) {
          formData.append(key, data[key][0])
        }
      } else {
        formData.append(key, data[key])
      }
    })

    UpdateProfile(formData)
      .then((res) => {
        const data = res.data.info.data
        if (res.data.isSuccess && res.status === 200) {
          const adminObject = {
            name: data.name,
            id: data._id,
            email: data.email,
            img: data.image ? res.data.info.baseUrl + data.image : null,
          }
          setValue('name', data.name)
          Cookies.set('admin', JSON.stringify(adminObject), { sameSite: 'Strict', secure: true })
          toast.success('Updated successfully!')
        } else {
          setError(res.data.message || 'Something went wrong!')
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        const errorMessage = err.response?.data?.message || 'Something Went Wrong!'
        setError(errorMessage)
        toast.error(errorMessage)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (admin) {
      setValue('name', admin.name)
      setValue('email', admin.email)
    }
  }, [admin, setValue])

  return (
    <div className="bg-light profile">
      <CContainer className="profile-container">
        <CRow>
          <CCol>
            <CCardGroup>
              <CCard className="p-4 mb-4 profile-card">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-center mb-4">Edit Your Profile</h2>

                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>

                    <CFormInput {...register('_id')} type="hidden" value={admin?.id} />

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <ToastContainer />
                      <CFormInput
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Name"
                        defaultValue={admin?.name}
                        autoComplete="current-name"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('email')}
                        type="text"
                        autoComplete="current-email"
                        disabled={true}
                        defaultValue={admin?.email}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CFormInput
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        id="image"
                        aria-label="file example"
                      />
                    </CInputGroup>
                    <CRow className="update-button">
                      <CCol xs={12} sm={4} className="mb-2 mb-md-0 ">
                        <CButton type="submit" className="w-100 custom-color" disabled={isLoading}>
                          {isLoading ? 'Loading...' : 'Update'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default EditProfile
