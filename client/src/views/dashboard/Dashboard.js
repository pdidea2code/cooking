import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import TopRecipe from './TopRecipe'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CImage,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import Count from './Count'
import { getRecentRecipe, getUserCount } from 'src/redux/api/api'
import CIcon from '@coreui/icons-react'
import { cilCommentSquare, cilDiamond, cilFire, cilStar } from '@coreui/icons'
import UserTable from './UserTable'
import Diet from '../pages/diet/Diet'
import { CChart } from '@coreui/react-chartjs'
const Dashboard = () => {
  const [recipe, setRecipe] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userCount, setUserCount] = useState({})

  const getRecentRecipeData = async () => {
    setIsLoading(true)
    try {
      const res = await getRecentRecipe()
      const data = res.data.info.recipes

      setRecipe(data)
      setBaseUrl(res.data.info.baseUrl)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getusecount = async () => {
    setIsLoading(true)
    try {
      const res = await getUserCount()
      const data = res.data.info

      setUserCount(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRecentRecipeData()
    getusecount()
  }, [])

  return (
    <>
      {isLoading ? (
        <CSpinner />
      ) : (
        <>
          <ToastContainer />
          <CRow className="backimg">
            {/* <CCol lg={6} md={12}>
              <TopRecipe />
            </CCol> */}
            <CCol lg={12} md={12} className="mt-3">
              <Count />
            </CCol>

            {/* Recent Recipe */}
            {/* <CCol lg={4} md={12} className="mt-3">
              <CCard>
                <CCardHeader>Recent Recipe</CCardHeader>
                <CCardBody style={{ height: '345px', overflow: 'scroll' }}>
                  {recipe.length === 0 ? (
                    <p>No recent recipes available</p>
                  ) : (
                    recipe.map((data) => (
                      <CCard className="mt-3" key={data.id}>
                        <CCardBody>
                          <CRow>
                            <CCol lg={5} sm={12}>
                              <CImage
                                style={{ height: '100px' }}
                                src={`${baseUrl}${data.image}`}
                                alt={data.title}
                              />
                            </CCol>
                            <CCol lg={7} sm={12}>
                              {data.title}
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    ))
                  )}
                </CCardBody>
              </CCard>
            </CCol> */}
            <CCol lg={8} sm={12} className="mt-3">
              <UserTable />
            </CCol>
            <CCol lg={4} sm={12} className="mt-3">
              <CCard>
                <CCardHeader>Active InActive User</CCardHeader>
                <CCardBody>
                  <CChart
                    type="doughnut"
                    data={{
                      labels: ['Active User', 'Inactive User'],
                      datasets: [
                        {
                          backgroundColor: ['#41B883', '#E46651'],
                          data: [userCount.activeUser, userCount.deactiveUser],
                        },
                      ],
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default Dashboard
