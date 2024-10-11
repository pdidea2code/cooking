import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Cookies from 'js-cookie'
import { LOGOUT } from 'src/redux/actions/action'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const adminString = Cookies.get('admin')
  const admin = JSON.parse(adminString)

  /* ------------------------------ admin logout ------------------------------ */
  const Logout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('admin')
    dispatch({ type: LOGOUT })
    navigate('/')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={admin.img} size="md" />
        {admin.name}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="">
          <NavLink to={'/profile'}>
            <CIcon icon={cilUser} className="me-2" />
            Edit Profile
          </NavLink>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="" onClick={Logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
