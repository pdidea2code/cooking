import {
  CCard,
  CCardBody,
  CCardHeader,
  CCarousel,
  CCarouselCaption,
  CCarouselItem,
  CCol,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react'
import ima from '../../assets/images/defaultImg.png'
import { getTopRecipe } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { height } from '@mui/system'
import 'react-toastify/dist/ReactToastify.css'
import CIcon from '@coreui/icons-react'
import { cilCommentBubble, cilCommentSquare, cilDiamond, cilFire, cilStar } from '@coreui/icons'
import primus from '../../assets/images/material-symbols-light--workspace-premium.svg'

const TopRecipe = () => {
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [recipe, setRecipe] = useState([])
  const getrecipe = async () => {
    try {
      const res = await getTopRecipe()
      const data = res.data.info.recipes
      if (data.length > 0) {
        setIsLoading(false)
      }
      setBaseUrl(res.data.info.baseUrl)
      setRecipe(data)
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getrecipe()
  }, [])
  return (
    <>
      <CRow>
        <CCol>
          {isLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <>
              <ToastContainer />
              <CCard>
                <CCardHeader>Top Rated Recipe</CCardHeader>
                <CCardBody>
                  <CCarousel controls autoSlide interval={3000} pause={'hover'} activeIndex={0}>
                    {recipe.map((data) => (
                      <CCarouselItem>
                        <CRow>
                          <CCol xl={3} md={12}>
                            <CImage
                              style={{ height: '100px' }}
                              src={baseUrl + data.image}
                              alt={data.image}
                            />
                          </CCol>
                          <CCol xl={9} md={9} className="ml-2 mt-2">
                            <CCol xl={9} md={9}>
                              <CIcon icon={cilStar} />
                              <span> {data.averagerating}</span>

                              <CIcon style={{ marginLeft: '20px' }} icon={cilCommentSquare} />
                              <span> {data.totalcomment}</span>

                              <i
                                className="fa-regular fa-grill-hot"
                                style={{ marginLeft: '15px' }}
                              ></i>
                              <span> {data.time}</span>
                              {data.isSubscripe && (
                                <span style={{ marginLeft: '20px' }}>
                                  <CImage src={primus} alt="isSubscribe" />
                                </span>
                              )}
                            </CCol>
                          </CCol>

                          <CCol
                            xl={12}
                            md={12}
                            style={{ height: '200px', overflow: 'hidden' }}
                            className="mt-1"
                          >
                            <h5>{data.title}</h5>
                            {data.description}
                          </CCol>
                        </CRow>
                      </CCarouselItem>
                    ))}
                  </CCarousel>
                </CCardBody>
              </CCard>
            </>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default TopRecipe
