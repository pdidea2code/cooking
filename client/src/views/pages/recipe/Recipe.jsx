import { Button, Switch, IconButton } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import {
  deleteMultipleRecipe,
  deleteRecipe,
  getAllRecipe,
  updateRecipeStatus,
  updateRecipeSubscripe, // Assuming this is a similar function to update status
} from 'src/redux/api/api'

const Recipe = () => {
  const navigate = useNavigate()
  const [dataTableData, setDataTable] = useState([])
  const [baseUrl, setBaseUrl] = useState([])

  const recipeList = async () => {
    await getAllRecipe()
      .then((res) => {
        // console.log(res.data.recipe)
        const transformedData = res.data.info.recipe.map((recipe) => ({
          ...recipe,
          // Assuming image and isSubscripe fields are present in the API response
          image: recipe.image || '',
          isSubscripe: recipe.isSubscripe || false,
        }))
        setDataTable(transformedData)
        setBaseUrl(`${process.env.REACT_APP_RECIPE_IMAGE_PATH}`)
      })
      .catch((err) => {
        console.log(err)
        if (!err.response.data.success) {
          if (err.response.data.status === 401) {
            toast.error(err.response.data.message)
          } else {
            toast.error(err.response.data, 'else')
          }
        }
      })
  }
  useEffect(() => {
    recipeList()
  }, [])

  const columns = [
    {
      name: 'title',
      label: 'Title ',
      options: {
        filter: true,
        sort: true,
        toUpperCase: true,
      },
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: true,
        sort: false,
        toUpperCase: true,
      },
    },
    {
      name: 'time',
      label: 'Time',
      options: {
        filter: true,
        sort: false,
        toUpperCase: true,
      },
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <img
              src={`${process.env.REACT_APP_RECIPE_IMAGE_PATH}${value}`}
              alt="Recipe"
              style={{ width: 50, height: 50 }}
            />
          )
        },
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status, _id } = dataTableData[rowIndex]
          return (
            <Switch
              checked={status}
              onChange={() => {
                const data = { id: _id, status: !status }
                updateRecipeStatus(data, _id)
                  .then(() => {
                    toast.success('Status changed successfully!', {
                      key: data._id,
                    })
                    recipeList()
                  })
                  .catch(() => {
                    toast.error('Something went wrong!', {
                      key: data._id,
                    })
                  })
              }}
            />
          )
        },
      },
    },
    {
      name: 'isSubscripe',
      label: 'Subscribed',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { isSubscripe, _id } = dataTableData[rowIndex]
          return (
            <Switch
              checked={isSubscripe}
              onChange={() => {
                const data = { id: _id, isSubscripe: !isSubscripe }
                updateRecipeSubscripe(data, _id) // Assuming this function updates the subscription status
                  .then(() => {
                    toast.success('Subscription status changed successfully!', {
                      key: data._id,
                    })
                    recipeList()
                  })
                  .catch(() => {
                    toast.error('Something went wrong!', {
                      key: data._id,
                    })
                  })
              }}
            />
          )
        },
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => {
          return (
            <div>
              <Icons.EditRounded
                className="editButton"
                onClick={() => {
                  const editData = dataTableData.find((data) => data._id === value)
                  navigate('/Recipe-form', {
                    state: { editData: editData, imageUrl: baseUrl },
                  })
                }}
              ></Icons.EditRounded>
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure? Want to delete Recipe? All related data will also be deleted',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    deleteRecipe(value)
                      .then(() => {
                        toast.success('Deleted successfully!', {
                          key: value,
                        })
                        recipeList()
                      })
                      .catch(() => {
                        toast.error('Something went wrong!', {
                          key: value,
                        })
                      })
                  }
                }}
              ></Icons.DeleteRounded>
            </div>
          )
        },
      },
    },
    {
      name: '_id',
      label: 'Options',
      options: {
        customBodyRender: (value) => {
          return (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  navigate(`/Ingredient`, {
                    state: { id: value },
                  })
                }}
                // onClick={() => navigate('/Recipe-form')}
              >
                Ingredient
              </Button>
              <Button
                className="mt-1"
                variant="contained"
                color="warning"
                onClick={() => {
                  navigate(`/Nutrition`, {
                    state: { id: value },
                  })
                }}
                // onClick={() => navigate('/Recipe-form')}
              >
                NUTRITION
              </Button>
              <Button
                className="mt-1 px-4"
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigate(`/Step`, {
                    state: { id: value },
                  })
                }}
                // onClick={() => navigate('/Recipe-form')}
              >
                STEP
              </Button>
            </>
          )
        },
      },
    },
  ]

  const deleteMultiple = async (index) => {
    const ids = index.data.map(
      (index1) => dataTableData.find((data, ind) => ind === index1.dataIndex && data._id)._id,
    )
    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete selected recipes?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      deleteMultipleRecipe(ids)
        .then(() => {
          recipeList()
          toast.success('Deleted successfully!', {
            key: ids.join(','),
          })
        })
        .catch(() => {
          toast.error('Something went wrong!', {
            key: ids.join(','),
          })
        })
    }
  }

  const SelectedRowsToolbar = (data) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultiple(data)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  const options = {
    customToolbarSelect: (selectedRows, data) => (
      <SelectedRowsToolbar
        selectedRows={selectedRows}
        data={data}
        columns={columns}
        datatableTitle="test"
      />
    ),
  }

  return (
    <>
      <ToastContainer />
      <div className="right-text">
        <Button
          variant="contained"
          size="medium"
          className="AddButton"
          onClick={() => navigate('/Recipe-form')}
        >
          Add Recipe
        </Button>
      </div>
      <MUIDataTable
        title={'Recipe List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Recipe
