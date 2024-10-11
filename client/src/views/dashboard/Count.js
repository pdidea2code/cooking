import { CCol, CRow, CSpinner, CWidgetStatsE } from '@coreui/react'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { getDashboradCount } from 'src/redux/api/api'
import 'react-toastify/dist/ReactToastify.css'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleRight } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const Count = () => {
  const [count, setCount] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const getcount = async () => {
    try {
      const res = await getDashboradCount()
      const data = res.data.info
      setIsLoading(false)
      setCount(data)
    } catch (error) {
      setIsLoading(false)
      toast.error(error.messsage)
    }
  }
  useEffect(() => {
    getcount()
  }, [])
  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <CSpinner className="theme-spinner-color" />
      ) : (
        <>
          <CRow>
            <CCol xl={2} md={6} sm={12} onClick={() => navigate('/Recipe')}>
              <CWidgetStatsE
                className="mb-3"
                title="Recipe"
                value={count.recipe}
                className="WidgetStatsEback"
              />
            </CCol>
            <CCol xl={2} md={6} sm={12} onClick={() => navigate('/User')}>
              <CWidgetStatsE
                className="mb-3"
                title="User"
                value={count.user}
                className="WidgetStatsEback"
              />
            </CCol>
            <CCol xl={2} md={6} sm={12} onClick={() => navigate('/Category')}>
              <CWidgetStatsE
                className="mb-3"
                title="Category"
                value={count.category}
                className="WidgetStatsEback"
              />
            </CCol>
            <CCol xl={2} md={6} sm={12} onClick={() => navigate('/Cuisine')}>
              <CWidgetStatsE
                className="mb-3"
                title="Cuisine"
                value={count.cuisine}
                className="WidgetStatsEback"
              />
            </CCol>
            <CCol xl={2} md={6} sm={12} onClick={() => navigate('/Diet')}>
              <CWidgetStatsE
                className="mb-3"
                title="Diet"
                value={count.diet}
                className="WidgetStatsEback"
              />
            </CCol>
            <CCol xl={2} md={6} sm={12}>
              <CWidgetStatsE
                className="mb-3"
                title="Subscribed User"
                value={count.subscribedUser}
                className="WidgetStatsEback"
              />
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default Count
