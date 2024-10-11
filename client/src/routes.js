import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/pages/auth/profile'))
const ChangePassword = React.lazy(() => import('./views/pages/auth/ChangePassword'))
const EditProfile = React.lazy(() => import('./views/pages/auth/EditProfile'))
const Category = React.lazy(() => import('./views/pages/category/Category'))
const Diet = React.lazy(() => import('./views/pages/diet/Diet'))
const CategoryForm = React.lazy(() => import('./views/pages/category/CategoryForm'))
const DietForm = React.lazy(() => import('./views/pages/diet/DietForm'))

const Recipe = React.lazy(() => import('./views/pages/recipe/Recipe'))
const Ingredient = React.lazy(() => import('./views/pages/recipe/Ingredient'))

const RecipeForm = React.lazy(() => import('./views/pages/recipe/RecipeForm'))
const Allergie = React.lazy(() => import('./views/pages/allergie/Allergie'))
const Meal = React.lazy(() => import('./views/pages/meal/Meal'))
const Unit = React.lazy(() => import('./views/pages/unit/Unit'))
const Cuisine = React.lazy(() => import('./views/pages/cuisine/Cuisine'))
const Comment = React.lazy(() => import('./views/pages/comments/Comments'))
const AllergieForm = React.lazy(() => import('./views/pages/allergie/AllergieForm'))
const MealForm = React.lazy(() => import('./views/pages/meal/MealForm'))
const IngredientForm = React.lazy(() => import('./views/pages/recipe/IngredientForm'))
const IngredientAdd = React.lazy(() => import('./views/pages/recipe/IngredientAdd'))
const UnitForm = React.lazy(() => import('./views/pages/unit/UnitForm'))
const Nutrition = React.lazy(() => import('./views/pages/recipe/nutrition/Nutrition'))
const NutritionAdd = React.lazy(() => import('./views/pages/recipe/nutrition/NutritionAdd'))
const NutritionForm = React.lazy(() => import('./views/pages/recipe/nutrition/NutritionForm'))
const Step = React.lazy(() => import('./views/pages/recipe/step/Step'))
const StepForm = React.lazy(() => import('./views/pages/recipe/step/StepForm'))
const CuisineForm = React.lazy(() => import('./views/pages/cuisine/CuisineForm'))
const User = React.lazy(() => import('./views/pages/user/User'))
const Plan = React.lazy(() => import('./views/pages/plan/Plan'))
const PlanForm = React.lazy(() => import('./views/pages/plan/PlanForm'))
const Payment = React.lazy(() => import('./views/pages/payment/Payment'))

const TermsConditions = React.lazy(() => import('./views/pages/setting/TermsConditions'))
const Privacypolicy = React.lazy(() => import('./views/pages/setting/PrivacyPolicy'))

const Notification = React.lazy(() => import('./views/pages/setting/Notification'))
const NotificationForm = React.lazy(() => import('./views/pages/setting/NotificationForm'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/Dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Profile', name: 'Profile', element: Profile },
  { path: '/Change-password', name: 'Change-password', element: ChangePassword },
  { path: '/Edit-profile', name: 'Edit-profile', element: EditProfile },
  { path: '/Category', name: 'Category', element: Category },
  { path: '/Diet', name: 'Diet', element: Diet },
  { path: '/Category-form', name: 'Category-form', element: CategoryForm },
  { path: '/Diet-form', name: 'Diet-form', element: DietForm },

  { path: '/Recipe', name: 'Recipe', element: Recipe },
  { path: '/Recipe-form', name: 'Recipe-form', element: RecipeForm },

  { path: '/Allergie', name: 'Allergie', element: Allergie },
  { path: '/Meal', name: 'Meal', element: Meal },
  { path: '/Ingredient', name: 'Ingredient', element: Ingredient },
  { path: '/Unit', name: 'Unit', element: Unit },
  { path: '/Cuisine', name: 'Cuisine', element: Cuisine },
  { path: '/Comment', name: 'Comment', element: Comment },
  { path: '/Allergie-form', name: 'Allergie-form', element: AllergieForm },
  { path: '/Meal-form', name: 'Meal-form', element: MealForm },
  { path: '/Ingredient-form', name: 'Ingredient-form', element: IngredientForm },
  { path: '/Add-Ingredient', name: 'Add-Ingredient', element: IngredientAdd },
  { path: '/Unit-form', name: 'Unit-form', element: UnitForm },
  { path: '/Cuisine-form', name: 'Cuisine-form', element: CuisineForm },
  { path: '/Nutrition', name: 'Nutrition', element: Nutrition },
  { path: '/Nutrition-Add', name: 'Nutrition-Add', element: NutritionAdd },
  { path: '/Nutrition-form', name: 'Nutrition-Form', element: NutritionForm },
  { path: '/Step', name: 'Step', element: Step },
  { path: '/Step-form', name: 'Step-Form', element: StepForm },
  { path: '/User', name: 'User', element: User },

  { path: '/Notification', name: 'Notification', element: Notification },

  { path: '/TermsConditions', name: 'TermsConditions', element: TermsConditions },
  { path: '/Privacypolicy', name: 'Privacypolicy', element: Privacypolicy },
  { path: '/Notification-form', name: 'Notification-form', element: NotificationForm },
  { path: '/Plan', name: 'Plan', element: Plan },
  { path: '/Plan-form', name: 'PlanForm', element: PlanForm },
  { path: '/Payment', name: 'Payment', element: Payment },
]

export default routes
