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
  CFormTextarea,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import {
  addRecipe,
  getAllCategory,
  getAllMeal,
  getAllAllergie,
  getAllDiet,
  getAllCuisine,
  updateRecipe,
} from 'src/redux/api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const RecipeForm = () => {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [audioFile, setAudioFile] = useState('')
  const [videoDiv, setVideoDiv] = useState(0)
  const [videoFile, setVideoFile] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [mealOptions, setMealOptions] = useState([])
  const [allergieOptions, setAllergieOptions] = useState([])
  const [dietOptions, setDietOptions] = useState([])
  const [cuisineOptions, setCuisineOptions] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const { state } = useLocation()

  const handleChange = (fieldName, fieldValue) => {
    clearErrors(fieldName)
    setValue(fieldName, fieldValue)
    if (fieldName === 'contentType') {
      setVideoDiv(fieldValue)
    }
    
  }

  const fetchData = async () => {
    try {
      const [meals, allergies, cuisines, diets, categories] = await Promise.all([
        getAllMeal(),
        getAllAllergie(),
        getAllCuisine(),
        getAllDiet(),
        getAllCategory(),
      ])
      setMealOptions(meals.data.info)
      setAllergieOptions(allergies.data.info)
      setCuisineOptions(cuisines.data.info)
      setDietOptions(diets.data.info.diet)
      setCategoryOptions(categories.data.info.category)
    } catch (err) {
      toast.error('Failed to fetch data')
    }
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

  const handleAudioFileUpload = (e) => {
    const audioFiles = e.target.files[0]
    if (audioFiles) {
      const audioUrl = URL.createObjectURL(audioFiles)
      setAudioFile(audioUrl)
    } else {
      setAudioFile('')
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    // Check if the selected file is an mp4 video
    if (file && file.type === 'video/mp4') {
      const vedioUrl = URL.createObjectURL(file)
      setVideoFile(vedioUrl)
    } else {
      e.target.value = null
      toast.error('Invalid video type. Only mp4 files are allowed.')
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    const formData = new FormData() // formdata object
    Object.keys(data).forEach(function (key) {
      if (key === 'image' || key === 'video' || key === 'audio') {
        if (data[key][0] !== undefined) {
          formData.append(key, data[key][0])
        }
      } else {
        formData.append(key, data[key])
      }
    })

    try {
      if (isUpdate === '') {
        
        await addRecipe(formData)
        toast.success('Recipe added successfully')
      } else {
        await updateRecipe(formData, isUpdate)
        toast.success('Recipe updated successfully')
      }
      navigate('/recipe')
    } catch (err) {
      toast.error('Error processing request')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (state) {
      const { editData, imageUrl } = state
     
      setIsUpdate(editData._id)
      setValue('title', editData.title)
      setValue('time', editData.time)
      setValue('description', editData.description)
      setValue('meal', editData.meal)
      setValue('diet', editData.diet)
      setValue('cuisine', editData.cuisine)
      setValue('allergie', editData.allergie)
      setValue('category', editData.category)

      setNewUrl(imageUrl + editData.image)
      // setVideoDiv(0);
      if (editData.videotype == '0') {
        setValue('videourl', editData.videourl)
        setVideoDiv(0)
      } else {
        setVideoDiv(1)
        setVideoFile(imageUrl + editData.video)
      }
      setAudioFile(imageUrl + editData.audio)
    }
    fetchData()
  }, [])

  return (
    <div className="bg-light min-vh-100">
      <CContainer className="mt-3">
        <CRow>
          <CCol md={8}>
            <CCard>
              <CCardHeader>
                <strong>Recipe Form</strong>
              </CCardHeader>
              <CCardBody>
                <ToastContainer />
                <CForm className="row g-3 " onSubmit={handleSubmit(onSubmit)}>
                  {/* recipe field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Recipe Title</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('title', {
                        required: 'Title is required',
                      })}
                      placeholder="Title"
                      invalid={!!errors.title}
                    />
                    <CFormFeedback invalid>{errors.title?.message}</CFormFeedback>
                  </CCol>
                  {/* end name field */}
                  {/* recipe time field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Recipe Time</CFormLabel>
                    <CFormInput
                      type="text"
                      id="validationDefault01"
                      {...register('time', {
                        required: 'Recipe time is required',
                      })}
                      placeholder="Time"
                      invalid={!!errors.time}
                    />
                    <CFormFeedback invalid>{errors.time?.message}</CFormFeedback>
                  </CCol>
                  {/* end name field */}

                  {/* Meal field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Meal</CFormLabel>
                    <CFormSelect
                      id="meal"
                      name="meal"
                      {...register('meal', { required: 'Meal is required' })}
                      invalid={!!errors.meal}
                      value={getValues('meal')}
                      onChange={(e) => handleChange('meal', e.target.value)}
                    >
                      <option value="">Select Meal</option>
                      {mealOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormFeedback invalid>{errors.meal?.message}</CFormFeedback>
                  </CCol>
                  {/* end meal field */}
                  {/* Diet field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Diet</CFormLabel>
                    <CFormSelect
                      id="diet"
                      name="diet"
                      {...register('diet', { required: 'Diet is required' })}
                      invalid={!!errors.diet}
                      value={getValues('diet')}
                      onChange={(e) => handleChange('diet', e.target.value)}
                    >
                      <option value="">Select Diet</option>
                      {dietOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormFeedback invalid>{errors.diet?.message}</CFormFeedback>
                  </CCol>
                  {/* end diet field */}
                  {/* Cuisine field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Cuisine</CFormLabel>
                    <CFormSelect
                      id="cuisine"
                      name="cuisine"
                      {...register('cuisine', { required: 'Cuisine is required' })}
                      invalid={!!errors.cuisine}
                      value={getValues('cuisine')}
                      onChange={(e) => handleChange('cuisine', e.target.value)}
                    >
                      <option value="">Select Cuisine</option>
                      {cuisineOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormFeedback invalid>{errors.cuisine?.message}</CFormFeedback>
                  </CCol>
                  {/* end cuisine field */}
                  {/* Allergie field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Allergie</CFormLabel>
                    <CFormSelect
                      id="allergie"
                      name="allergie"
                      {...register('allergie', { required: 'Allergie is required' })}
                      invalid={!!errors.allergie}
                      value={getValues('allergie')}
                      onChange={(e) => handleChange('allergie', e.target.value)}
                    >
                      <option value="">Select Allergie</option>
                      {allergieOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormFeedback invalid>{errors.allergie?.message}</CFormFeedback>
                  </CCol>
                  {/* end allergie field */}
                  {/* Category field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Category</CFormLabel>
                    <CFormSelect
                      id="category"
                      name="category"
                      {...register('category', { required: 'Category is required' })}
                      invalid={!!errors.category}
                      value={getValues('category')}
                      onChange={(e) => handleChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormFeedback invalid>{errors.category?.message}</CFormFeedback>
                  </CCol>
                  {/* end category field */}
                  {/* description field */}
                  <CCol md={12}>
                    <CFormLabel>Description</CFormLabel>
                    <CFormTextarea
                      type="text"
                      id="validationDefault01"
                      {...register('description', {
                        required: 'Description is required',
                      })}
                      placeholder="Description"
                      invalid={!!errors.description}
                    />
                    <CFormFeedback invalid>{errors.description?.message}</CFormFeedback>
                  </CCol>
                  {/* end description field */}
                  {/* recipe image field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Recipe Image</CFormLabel>
                    <CFormInput
                      type="file"
                      name="image"
                      accept="image/*"
                      id="validationDefault01"
                      {...register('image', {
                        required: isUpdate ? false : 'Image is required',
                      })}
                      placeholder="Recipe Image"
                      onChange={handleFileUpload}
                      invalid={!!errors.image}
                    />
                    {newUrl && (
                      <img
                        src={newUrl}
                        className="img-fluid img-thumbnail"
                        alt="Selected"
                        style={{ maxHeight: '200px', marginTop: '10px' }}
                      />
                    )}
                    <CFormFeedback invalid>{errors.image?.message}</CFormFeedback>
                  </CCol>
                  {/* end recipe image field */}
                  {/* audio upload field */}
                  <CCol xl={6} md={12}>
                    <CFormLabel>Recipe Audio</CFormLabel>
                    <CFormInput
                      type="file"
                      name="audio"
                      accept="audio/*"
                      id="validationDefault01"
                      {...register('audio')}
                      placeholder="Recipe Audio"
                      onChange={handleAudioFileUpload}
                    />
                    {audioFile && (
                      <audio
                        src={audioFile}
                        controls
                        className="audio-player"
                        style={{ marginTop: '10px' }}
                      />
                    )}
                    <CFormFeedback invalid>{errors.audio?.message}</CFormFeedback>
                  </CCol>
                  {/* end audio upload field */}
                  {/* content type radio buttons */}
                  <CCol xl={6} md={12}>
                    <div>
                      <CFormLabel>Content Type</CFormLabel>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="form-check mr-3">
                        <input
                          type="radio"
                          name="contentType"
                          id="contentTypeVideo"
                          className="form-check-input"
                          value="0"
                          checked={videoDiv == 1}
                          onChange={() => setVideoDiv(1)}
                        />
                        <label htmlFor="contentTypeVideo" className="form-check-label">
                          Video
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          name="contentType"
                          id="contentTypeLink"
                          className="form-check-input"
                          value="1"
                          checked={videoDiv == 0}
                          onChange={() => setVideoDiv(0)}
                        />
                        <label htmlFor="contentTypeLink" className="form-check-label">
                          Link
                        </label>
                      </div>
                    </div>
                  </CCol>
                  {/* end content type radio buttons */}

                  {/* Video field */}
                  {videoDiv === 1 ? (
                    <CCol xl={12} md={12}>
                      <CFormLabel>Video</CFormLabel>
                      <CFormInput
                        type="file"
                        name="video"
                        accept="video/mp4"
                        id="videoUpload"
                        {...register('video')}
                        placeholder="Video"
                        onChange={handleVideoChange}
                        invalid={!!errors.video}
                      />
                      {videoFile && (
                        <video
                          src={videoFile}
                          className="video-preview"
                          controls
                          style={{ marginTop: '10px', maxWidth: '100%' }}
                        />
                      )}
                      <CFormFeedback invalid>{errors.video?.message}</CFormFeedback>
                    </CCol>
                  ) : (
                    <CCol xl={12} md={12}>
                      <CFormLabel>Video Link</CFormLabel>
                      <CFormInput
                        type="text"
                        id="videourl"
                        {...register('videourl', {
                          required: 'Title is required',
                        })}
                        placeholder="Enter video link"
                        invalid={!!errors.videoUrl}
                      />
                      <CFormFeedback invalid>{errors.videoUrl?.message}</CFormFeedback>
                    </CCol>
                  )}
                  {/* end Video field */}

                  <CCol xs={12} className="text-center">
                    <CButton color="primary" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <CSpinner size="sm" /> Please Wait
                        </>
                      ) : isUpdate ? (
                        'Update Recipe'
                      ) : (
                        'Add Recipe'
                      )}
                    </CButton>
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

export default RecipeForm
