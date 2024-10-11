import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDrop,
  cilLanguage,
  cilSpeedometer,
  cilTag,
  cilInbox,
  cilNewspaper,
  cilLocationPin,
  cilUser,
  cilNoteAdd,
  cilPuzzle,
  cilSettings,
  cilSpeech,
  cilStream,
  cilCommentSquare,
} from '@coreui/icons'
import { CImage, CNavGroup, CNavItem } from '@coreui/react'
import Allergie from './assets/images/ALLERGIE.svg'
import CUISINE from './assets/images/Cuisine.svg'
import MEAL from './assets/images/MEAL.svg'
import CATEGORY from './assets/images/CATEGORY.svg'
import Diet from './assets/images/diet.svg'
import unit from './assets/images/unit.svg'
import recipe from './assets/images/recipe.svg'
import comment from './assets/images/COMMENTS.svg'
import user from './assets/images/user.svg'
import Privacy_Policy from './assets/images/Privacy Policy.svg'
import tandc from './assets/images/TandC.svg'
import Notification from './assets/images/Notification.svg'
import payment from './assets/images/payment.svg'
import subscription from './assets/images/subscription.svg'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/Dashboard',
    icon: <CIcon icon={cilSpeedometer} style={{ color: 'black' }} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cuisine',
    to: '/Cuisine',
    icon: <CImage src={CUISINE} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Allergie',
    to: '/Allergie',
    icon: <CImage src={Allergie} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Meal',
    to: '/Meal',
    icon: <CImage src={MEAL} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Category',
    to: '/Category',
    icon: <CImage src={CATEGORY} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Diet',
    to: '/Diet',
    icon: <CImage src={Diet} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Unit',
    to: '/Unit',
    icon: <CImage src={unit} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Recipe',
    to: '/Recipe',
    icon: <CImage src={recipe} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Plan',
    to: '/Plan',
    icon: <CImage src={subscription} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Payment',
    to: '/Payment',
    icon: <CImage src={payment} className="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Comments',
    to: '/Comment',
    icon: <CImage src={comment} className="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Subscription',
  //   to: '/Subscription',
  //   icon: <CIcon icon={cilLocationPin} style={{ color: 'Black' }} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'User',
    to: '/User',
    icon: <CImage src={user} className="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Settings',
    to: '/Settings',
    icon: <CIcon icon={cilSettings} style={{ color: 'Black' }} customClassName="nav-icon " />,
    items: [
      {
        component: CNavItem,
        name: 'Privacy Policy',
        to: '/Privacypolicy',
        icon: <CImage src={Privacy_Policy} className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Terms & Conditions',
        to: '/TermsConditions',
        icon: <CImage src={tandc} className="nav-icon" />,
      },

      {
        component: CNavItem,
        name: 'Notification',
        to: '/Notification',
        icon: <CImage src={Notification} className="nav-icon" />,
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
