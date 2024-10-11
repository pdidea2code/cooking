import { Button, Switch, IconButton } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import {
  deleteMultipleCuisine,
  deleteCuisine,
  getAllCuisine,
  updateCuisineStatus,
} from 'src/redux/api/api'

const Cuisine = () => {
  const navigate = useNavigate()
  const [dataTableData, setDataTable] = useState([])

  const cuisineList = async () => {
    try {
      const res = await getAllCuisine()
      // console.log(res.data.info)
      const transformedData = res.data.info.map((cuisine) => ({
        ...cuisine,
      }))
      setDataTable(transformedData)
    } catch (err) {
      console.log(err)
      if (!err.response.data.success) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data, 'else')
        }
      }
    }
  }

  useEffect(() => {
    cuisineList()
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true,
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
              onChange={async () => {
                const data = { id: _id, status: !status }
                try {
                  await updateCuisineStatus(data, _id)
                  toast.success('Status changed successfully!', {
                    key: data._id,
                  })
                  cuisineList()
                } catch {
                  toast.error('Something went wrong!', {
                    key: data._id,
                  })
                }
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
                  navigate('/Cuisine-form', {
                    state: { editData: editData },
                  })
                }}
              />
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure you want to delete this cuisine? All related data will also be deleted.',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    try {
                      await deleteCuisine(value)
                      toast.success('Deleted successfully!', {
                        key: value,
                      })
                      cuisineList()
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
      text: 'Are you sure that you want to delete the selected cuisines?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        await deleteMultipleCuisine(ids)
        toast.success('Deleted successfully!', {
          key: ids.join(','),
        })
        cuisineList()
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
          onClick={() => navigate('/Cuisine-form')}
        >
          Add Cuisine
        </Button>
      </div>
      <MUIDataTable
        title={'Cuisine List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Cuisine
