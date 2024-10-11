import { Button, IconButton } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import { deleteStep, deleteMultipleSteps, getRecipeWiseSteps } from 'src/redux/api/api'

const Step = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [dataTableData, setDataTable] = useState([])
  const [baseUrl, setBaseUrl] = useState([])

  const fetchSteps = async () => {
    try {
      const res = await getRecipeWiseSteps(state.id)
      const data = res.data.info.steps
      const transformedData = data.map((step) => ({
        ...step,
        recipeId: step.recipeid,
      }))
      setBaseUrl(res.data.info.baseUrl)
      setDataTable(transformedData)
    } catch (err) {
      console.log(err)
      if (!err.response.data.success) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message || 'Something went wrong!')
        }
      }
    }
  }

  useEffect(() => {
    fetchSteps()
  }, [])

  const columns = [
    {
      name: 'stepno',
      label: 'Step No.',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value ? (
            <img src={baseUrl + value} alt="step" width="50" height="50" />
          ) : (
            <span>No Image</span>
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
                  navigate('/Step-form', {
                    state: { editData: editData, imageUrl: baseUrl },
                  })
                }}
              />
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure you want to delete this step? All related data will also be deleted.',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    try {
                      await deleteStep(value)
                      toast.success('Deleted successfully!', {
                        key: value,
                      })
                      fetchSteps()
                    } catch {
                      toast.error('Something went wrong!', {
                        key: value,
                      })
                    }
                  }
                }}
              />
            </div>
          )
        },
      },
    },
  ]

  const deleteMultiple = async (selectedRows) => {
    const ids = selectedRows.data.map((row) => dataTableData[row.dataIndex]._id)

    const confirm = await swal({
      title: 'Are you sure?',
      text: 'Are you sure that you want to delete the selected steps?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        await deleteMultipleSteps(ids)
        toast.success('Deleted successfully!', {
          key: ids.join(','),
        })
        fetchSteps()
      } catch {
        toast.error('Something went wrong!', {
          key: ids.join(','),
        })
      }
    }
  }

  const SelectedRowsToolbar = ({ selectedRows }) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultiple(selectedRows)}>
          <Icons.Delete />
        </IconButton>
      </div>
    )
  }

  const options = {
    customToolbarSelect: (selectedRows, data) => (
      <SelectedRowsToolbar selectedRows={selectedRows} data={data} columns={columns} />
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
          onClick={() => navigate('/Step-form', { state: { id: state.id } })}
        >
          Add Step
        </Button>
      </div>
      <MUIDataTable
        title={'Recipe Steps List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Step
