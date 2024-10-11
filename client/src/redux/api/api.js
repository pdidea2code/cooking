import axios from 'axios'
import Cookies from 'js-cookie'
import {
  ADD_CATEGORY_API,
  ADD_DIET_API,
  ADD_RECIPE_API,
  ADD_ALLERGIE_API,
  ADD_MEAL_API,
  ADD_INGREDIENT_API,
  ADD_UNIT_API,
  ADD_CUISINE_API,
  ADMIN_EDIT_PROFILE_PASSWORD_API,
  ADMIN_FORGOT_PASSWORD_API,
  ADMIN_LOGIN_API,
  ADMIN_CHANGE_PASSWORD_API,
  ADMIN_RESET_PASSWORD_API,
  All_CATEGORY_LIST_API,
  All_DIET_LIST_API,
  All_RECIPE_LIST_API,
  All_ALLERGIE_LIST_API,
  All_MEAL_LIST_API,
  All_INGREDIENT_LIST_API,
  All_UNIT_LIST_API,
  All_CUISINE_LIST_API,
  All_COMMENT_LIST_API,
  All_USER_LIST_API,
  DELETE_CATEGORY_API,
  DELETE_DIET_API,
  DELETE_MULTIPLE_CATEGORY_API,
  DELETE_MULTIPLE_RECIPE_API,
  DELETE_MULTIPLE_DIET_API,
  DELETE_MULTIPLE_ALLERGIE_API,
  DELETE_MULTIPLE_MEAL_API,
  DELETE_MULTIPLE_INGREDIENT_API,
  DELETE_MULTIPLE_UNIT_API,
  DELETE_MULTIPLE_CUISINE_API,
  DELETE_MULTIPLE_COMMENT_API,
  DELETE_NOTIFICATION_API,
  DELETE_RECIPE_API,
  DELETE_ALLERGIE_API,
  DELETE_MEAL_API,
  DELETE_INGREDIENT_API,
  DELETE_UNIT_API,
  DELETE_CUISINE_API,
  DELETE_COMMENT_API,
  GET_GENERAL_SETTINGS_API,
  GET_NOTIFICATION_API,
  MAIN_URL,
  UPDATE_CATEGORY_API,
  UPDATE_DIET_API,
  UPDATE_CATEGORY_STATUS_API,
  UPDATE_DIET_STATUS_API,
  UPDATE_GENERAL_SETTINGS_API,
  UPDATE_NOTIFICATION_API,
  UPDATE_RECIPE_API,
  UPDATE_RECIPE_STATUS_API,
  UPDATE_RECIPE_SUBSCRIBE_API,
  UPDATE_ALLERGIE_API,
  UPDATE_MEAL_API,
  UPDATE_INGREDIENT_API,
  UPDATE_UNIT_API,
  UPDATE_CUISINE_API,
  UPDATE_ALLERGIE_STATUS_API,
  UPDATE_MEAL_STATUS_API,
  UPDATE_INGREDIENT_STATUS_API,
  UPDATE_UNIT_STATUS_API,
  UPDATE_CUISINE_STATUS_API,
  GET_NUTRITION_API,
  ADD_NUTRITION_API,
  GET_RECIPEWISE_NUTRITION_API,
  UPDATE_NUTRITION_API,
  DELETE_NUTRITION_API,
  DELETE_MULTIPLE_NUTRITION_API,
  GET_STEPS_API,
  GET_RECIPEWISE_STEP_API,
  UPDATE_STEP_API,
  DELETE_STEP_API,
  DELETE_MULTIPLE_STEP_API,
  ADD_STEP_API,
  ADD_NOTIFICATION_API,
  DELETE_MULTIPLE_NOTIFICATION_API,
  UPDATE_NOTIFICATION_STATUS_API,
  GET_TOP_RECIPE_API,
  GET_DESHBORD_DOUNT,
  GET_RECINT_RECIPE_API,
  GET_USER_COUNT_API,
  DELETE_USER_API,
  ADD_PLAN_API,
  DELETE_PLAN_API,
  UPDATE_PLAN_API,
  UPDATE_STATUS_PLAN_API,
  GET_PLAN_API,
  GET_PAYMENT,
  CHECK_SESSION,
} from 'src/constant'
// export const MAIN_url = 'http://localhost:8002'

axios.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config
    if (err.response.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true
      Cookies.remove('accessToken')
      // Cookies.remove('refreshToken')
      // Cookies.remove('admin')
      // window.location.reload()
      try {
        const refreshToken = Cookies.get('refreshToken')

        const res = await axios.post(`${MAIN_URL}/admin/refreshtoken`, { refreshToken })

        const accessToken = res.data.info

        Cookies.set('accessToken', accessToken, { sameSite: 'Strict', secure: true })

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        return axios(originalRequest)
      } catch (refresherr) {
        console.log('err refreshing token:', refresherr)
        // You might want to redirect to login or handle the err in another way
      }
    }

    if (err.response.status === 405) {
      Cookies.remove('accessToken')
      // window.location.reload()
    }
    return Promise.reject(err)
  },
)
// axios.inter  ceptors.response.use(
//   (response) => response,
//   async (err) => {
//     if (err.response.status === 401 || err.response.status === 403) {
//       // Handle unauthorized or forbidden access (token expired) here
//       // For example, you can redirect the user to the login page or perform other actions
//       console.error('Token expired or unauthorized access')
//     }

//     if (err.response.status === 405) {
//       // Handle other specific errors if needed
//       // For example, you can remove the access token and reload the page
//       Cookies.remove('accessToken')
//       window.location.reload()
//     }

//     return Promise.reject(err)
//   },
// )

/* ------------------------------ ALL ADMIN API ----------------------------- */
/* Admin login api */
export const adminLogin = (data) => axios.post(MAIN_URL + ADMIN_LOGIN_API, data)
/* Admin forgot password api */
export const forgotPassword = (data) => axios.post(MAIN_URL + ADMIN_FORGOT_PASSWORD_API, data)

// Admin reset password
export const resetPassword = (data) => axios.post(MAIN_URL + ADMIN_RESET_PASSWORD_API, data)

/*   Admin profile change password - */
export const changePassword = (data) =>
  axios.post(MAIN_URL + ADMIN_CHANGE_PASSWORD_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/*  update Admin Profile  */
export const UpdateProfile = (data) =>
  axios.post(MAIN_URL + ADMIN_EDIT_PROFILE_PASSWORD_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* ------------------------------ END ADMIN API ----------------------------- */

/* ---------------------------- ALL GENERAL SETTINGS API ---------------------------- */

/* delete comment */
export const updateGeneralSettings = (data, id) =>
  axios.put(MAIN_URL + UPDATE_GENERAL_SETTINGS_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Get All General Seetings  */
export const getGeneralSettings = () =>
  axios.get(MAIN_URL + GET_GENERAL_SETTINGS_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END COMMENTS API ---------------------------- */

/* ---------------------------- ALL CATEGORY API ---------------------------- */
/* add Category  */
export const addCategory = (data) =>
  axios.post(MAIN_URL + ADD_CATEGORY_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Get All Category  */
export const getAllCategory = () =>
  axios.get(MAIN_URL + All_CATEGORY_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Category */
export const deleteCategory = (id) =>
  axios.delete(MAIN_URL + DELETE_CATEGORY_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE category  */
export const deleteMultipleCategory = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_CATEGORY_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* update Category  */
export const updateCategory = (data, id) =>
  axios.put(MAIN_URL + UPDATE_CATEGORY_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Category STATUS  */
export const updateCategoryStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_CATEGORY_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END CATEGORY API ---------------------------- */

/* ---------------------------- ALL DIET API ---------------------------- */
/* add Diet  */
export const addDiet = (data) =>
  axios.post(MAIN_URL + ADD_DIET_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Get All Diet  */
export const getAllDiet = () =>
  axios.get(MAIN_URL + All_DIET_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Diet */
export const deleteDiet = (id) =>
  axios.delete(MAIN_URL + DELETE_DIET_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Diet  */
export const deleteMultipleDiet = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_DIET_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* update Diet  */
export const updateDiet = (data, id) =>
  axios.post(MAIN_URL + UPDATE_DIET_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Diet STATUS  */
export const updateDietStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_DIET_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END DIET API ---------------------------- */

/* ---------------------------- ALL RECIPE API ---------------------------- */
/* Get All recipe  */
export const getAllRecipe = () =>
  axios.get(MAIN_URL + All_RECIPE_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** add recipe*/
export const addRecipe = (data) =>
  axios.post(MAIN_URL + ADD_RECIPE_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Recipe */
export const deleteRecipe = (id) =>
  axios.delete(MAIN_URL + DELETE_RECIPE_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Recipe  */
export const updateRecipe = (data, id) =>
  axios.post(MAIN_URL + UPDATE_RECIPE_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Recipe  */
export const deleteMultipleRecipe = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_RECIPE_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* update Recipe STATUS  */
export const updateRecipeStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_RECIPE_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Recipe SUBSCRIBE  */
export const updateRecipeSubscripe = (data, id) =>
  axios.put(MAIN_URL + UPDATE_RECIPE_SUBSCRIBE_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* ---------------------------- END SUB CATEGORY API ---------------------------- */

/* ---------------------------- ALL COMMENTS API ---------------------------- */

/* delete comment */
export const deleteComment = (id) =>
  axios.delete(MAIN_URL + DELETE_COMMENT_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Comment  */
export const deleteMultipleComment = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_COMMENT_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Comment  */
export const getAllComment = () =>
  axios.get(MAIN_URL + All_COMMENT_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END COMMENTS API ---------------------------- */

/* ---------------------------- ALL ALLERGIE API ---------------------------- */

/** add Allergie */
export const addAllergie = (data) =>
  axios.post(MAIN_URL + ADD_ALLERGIE_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Allergie */
export const deleteAllergie = (id) =>
  axios.delete(MAIN_URL + DELETE_ALLERGIE_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Allergie  */
export const updateAllergie = (data, id) =>
  axios.put(MAIN_URL + UPDATE_ALLERGIE_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* update Allergie STATUS  */
export const updateAllergieStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_ALLERGIE_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Allergie  */
export const deleteMultipleAllergie = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_ALLERGIE_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Allergie  */
export const getAllAllergie = () =>
  axios.get(MAIN_URL + All_ALLERGIE_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- ENDALLERGIE API ---------------------------- */

/* ---------------------------- ALL MEAL API ---------------------------- */

/** add Meal */
export const addMeal = (data) =>
  axios.post(MAIN_URL + ADD_MEAL_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Meal */
export const deleteMeal = (id) =>
  axios.delete(MAIN_URL + DELETE_MEAL_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Meal  */
export const updateMeal = (data, id) =>
  axios.put(MAIN_URL + UPDATE_MEAL_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* update Meal STATUS  */
export const updateMealStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_MEAL_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Meal  */
export const deleteMultipleMeal = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_MEAL_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Meal  */
export const getAllMeal = () =>
  axios.get(MAIN_URL + All_MEAL_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END MEAL API ---------------------------- */

/* ---------------------------- ALL INGREDIENT API ---------------------------- */

/** add Ingredient */
export const addIngredient = (data) =>
  axios.post(MAIN_URL + ADD_INGREDIENT_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Ingredient */
export const deleteIngredient = (id) =>
  axios.delete(MAIN_URL + DELETE_INGREDIENT_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Ingredient  */
export const updateIngredient = (data, id) =>
  axios.put(MAIN_URL + UPDATE_INGREDIENT_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* update Ingredient STATUS  */
export const updateIngredientStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_INGREDIENT_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Ingredient  */
export const deleteMultipleIngredient = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_INGREDIENT_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Ingredient  */
export const getAllIngredient = (id) =>
  axios.get(MAIN_URL + All_INGREDIENT_LIST_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END INGREDIENT API ---------------------------- */

/* ---------------------------- ALL UNIT API ---------------------------- */

/** add Unit */
export const addUnit = (data) =>
  axios.post(MAIN_URL + ADD_UNIT_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Unit */
export const deleteUnit = (id) =>
  axios.delete(MAIN_URL + DELETE_UNIT_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Unit  */
export const updateUnit = (data, id) =>
  axios.put(MAIN_URL + UPDATE_UNIT_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* update Unit STATUS  */
export const updateUnitStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_UNIT_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Unit  */
export const deleteMultipleUnit = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_UNIT_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Unit  */
export const getAllUnit = () =>
  axios.get(MAIN_URL + All_UNIT_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END UNIT API ---------------------------- */

/* ---------------------------- ALL CUISINE API ---------------------------- */

/** add Cuisine */
export const addCuisine = (data) =>
  axios.post(MAIN_URL + ADD_CUISINE_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Cuisine */
export const deleteCuisine = (id) =>
  axios.delete(MAIN_URL + DELETE_CUISINE_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Cuisine  */
export const updateCuisine = (data, id) =>
  axios.put(MAIN_URL + UPDATE_CUISINE_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* update Cuisine STATUS  */
export const updateCuisineStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_CUISINE_STATUS_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Cuisine  */
export const deleteMultipleCuisine = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_CUISINE_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Cuisine  */
export const getAllCuisine = () =>
  axios.get(MAIN_URL + All_CUISINE_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- ENDALLERGIE API ---------------------------- */

/* ---------------------------- ALL NUTRITION API ---------------------------- */

/** add Nutrition */
export const addNutrition = (data) =>
  axios.post(MAIN_URL + ADD_NUTRITION_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** get Nutrition */
export const getNutrition = () =>
  axios.get(MAIN_URL + GET_NUTRITION_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** get Recipe-wise Nutrition */
export const getRecipeWiseNutrition = (recipeId) =>
  axios.get(MAIN_URL + GET_RECIPEWISE_NUTRITION_API + recipeId, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** update Nutrition */
export const updateNutrition = (data, id) =>
  axios.put(MAIN_URL + UPDATE_NUTRITION_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** delete Nutrition */
export const deleteNutrition = (id) =>
  axios.delete(MAIN_URL + DELETE_NUTRITION_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** delete multiple Nutrition */
export const deleteMultipleNutrition = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_NUTRITION_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* ---------------------------- END NUTRITION API ---------------------------- */

/* ---------------------------- ALL STEP API ---------------------------- */

/** add Step */
export const addStep = (data) =>
  axios.post(MAIN_URL + ADD_STEP_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** get Steps */
export const getSteps = () =>
  axios.get(MAIN_URL + GET_STEPS_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** get Recipe-wise Steps */
export const getRecipeWiseSteps = (recipeId) =>
  axios.get(MAIN_URL + GET_RECIPEWISE_STEP_API + recipeId, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** update Step */
export const updateStep = (data, stepId) =>
  axios.post(MAIN_URL + UPDATE_STEP_API + stepId, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** delete Step */
export const deleteStep = (stepId) =>
  axios.delete(MAIN_URL + DELETE_STEP_API + stepId, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/** delete multiple Steps */
export const deleteMultipleSteps = (data) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_STEP_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* ---------------------------- END STEP API ---------------------------- */

/* ---------------------------- ALL Deshbord API ---------------------------- */

export const getTopRecipe = () =>
  axios.get(MAIN_URL + GET_TOP_RECIPE_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

export const getDashboradCount = () =>
  axios.get(MAIN_URL + GET_DESHBORD_DOUNT, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
export const getRecentRecipe = () =>
  axios.get(MAIN_URL + GET_RECINT_RECIPE_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
export const getUserCount = () =>
  axios.get(MAIN_URL + GET_USER_COUNT_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END Deshbord API ---------------------------- */

/* ---------------------------- ALL User API ---------------------------- */

/* Get All user  */
export const getAllUser = () =>
  axios.get(MAIN_URL + All_USER_LIST_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
export const deleteUser = (data) =>
  axios.post(MAIN_URL + DELETE_USER_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END User API ---------------------------- */

/* ---------------------------- ALL Notification API ---------------------------- */

/* Get All Notification */
export const getAllNotifications = () =>
  axios.get(MAIN_URL + GET_NOTIFICATION_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Add Notification */
export const addNotification = (data) =>
  axios.post(MAIN_URL + ADD_NOTIFICATION_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Delete Notification */
export const deleteNotification = (id) =>
  axios.delete(MAIN_URL + DELETE_NOTIFICATION_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Delete Multiple Notifications */
export const deleteMultipleNotifications = (ids) =>
  axios.delete(MAIN_URL + DELETE_MULTIPLE_NOTIFICATION_API, ids, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Update Notification */
export const updateNotification = (data, id) =>
  axios.put(MAIN_URL + UPDATE_NOTIFICATION_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* Update Notification Status */
export const updateNotificationStatus = (status, id) =>
  axios.put(
    MAIN_URL + UPDATE_NOTIFICATION_STATUS_API + id,
    { status },
    {
      headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    },
  )

/* ---------------------------- ALL PLAN API ---------------------------- */

/** add Meal */
export const addPlan = (data) =>
  axios.post(MAIN_URL + ADD_PLAN_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete Meal */
export const deletePlan = (id) =>
  axios.delete(MAIN_URL + DELETE_PLAN_API + id, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* update Meal  */
export const updatePlan = (data, id) =>
  axios.put(MAIN_URL + UPDATE_PLAN_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
/* update Meal STATUS  */
export const updatePlanStatus = (data, id) =>
  axios.put(MAIN_URL + UPDATE_STATUS_PLAN_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* delete MULTIPLE Meal  */
export const deleteMultiplePlan = (data) =>
  axios.delete(MAIN_URL + DELETE_PLAN_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    data: { ids: data },
  })

/* Get All Meal  */
export const getAllPlan = () =>
  axios.get(MAIN_URL + GET_PLAN_API, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END MEAL API ---------------------------- */
/* ---------------------------- ALL Payment API ---------------------------- */
export const getAllPayment = () =>
  axios.get(MAIN_URL + GET_PAYMENT, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
export const checkSession = (data) =>
  axios.get(MAIN_URL + CHECK_SESSION + data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* ---------------------------- END Paymet API ---------------------------- */
