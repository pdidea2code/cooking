import { Button, Switch, IconButton } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import {
  deleteMultipleIngredient,
  deleteIngredient,
  getAllIngredient,
  updateIngredientStatus,
} from 'src/redux/api/api'

const Ingredient = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [dataTableData, setDataTable] = useState([])

  const ingredientList = async () => {
    try {
      const res = await getAllIngredient(state.id)
      // console.log(res.data.info)
      const transformedData = res.data.info.map((ingredient) => ({
        ...ingredient,
        unitname: ingredient.unit == null ? '-' : ingredient.unit.name,
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
    ingredientList()
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
      name: 'amount',
      label: 'Weight',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'unitname',
      label: 'Unit',
      options: {
        filter: true,
        sort: true,
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

                  navigate('/Ingredient-form', {
                    state: { editData: editData },
                  })
                }}
              />
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure you want to delete this ingredient? All related data will also be deleted.',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    try {
                      await deleteIngredient(value)
                      toast.success('Deleted successfully!', {
                        key: value,
                      })
                      ingredientList()
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
      text: 'Are you sure that you want to delete the selected ingredients?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      try {
        await deleteMultipleIngredient(ids)
        toast.success('Deleted successfully!', {
          key: ids.join(','),
        })
        ingredientList()
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
          onClick={() => navigate('/Add-Ingredient', { state: { editData: state.id } })}
        >
          Add Ingredient
        </Button>
      </div>
      <MUIDataTable
        title={'Ingredient List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Ingredient
