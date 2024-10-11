import { Button, IconButton, Switch } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import { deleteUser, getAllUser } from 'src/redux/api/api'
import swal from 'sweetalert'
import defaultImg from '../../../../src/assets/images/default.png'

const User = () => {
  const [dataTableData, setDataTable] = useState([])
  const navigate = useNavigate()
  const [baseUrl, setBaseUrl] = useState('')

  const list = async () => {
    await getAllUser()
      .then((res) => {
        setDataTable(res.data.info.user)
        setBaseUrl(`${process.env.REACT_APP_USER_PROFILE_PATH}`)
      })
      .catch((err) => {
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
    list()
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
      name: 'email',
      label: 'Email',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'mono',
      label: 'MobileNo',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (image) =>
          image ? (
            <img
              src={`${process.env.REACT_APP_USER_PROFILE_PATH}${image}`}
              alt={image}
              style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            />
          ) : (
            <img
              src={defaultImg}
              alt={image}
              style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            />
          ),
      },
    },
    {
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => (
          <Icons.DeleteRounded
            className="deleteButton"
            onClick={async () => {
              const confirm = await swal({
                title: 'Are you sure?',
                text: 'Are you sure? Want to delete User?',
                icon: 'warning',
                buttons: ['No, cancel it!', 'Yes, I am sure!'],
                dangerMode: true,
              })
              if (confirm) {
                const data = {
                  id: value,
                }
                deleteUser(data)
                  .then(() => {
                    list()
                    toast.success('Deleted successfully!')
                    // swal({
                    //   title: 'Deleted successfully!',
                    //   icon: 'success',
                    //   button: 'close',
                    // })
                  })
                  .catch((error) => {
                    console.log(error)
                    const errorMsg = error.response?.data?.message || 'Something went wrong'
                    toast.error(errorMsg)
                  })
              }
            }}
          />
        ),
      },
    },
  ]

  const options = {
    selectableRows: 'none',
  }

  return (
    <>
      <ToastContainer />
      <MUIDataTable title={'User List'} data={dataTableData} columns={columns} options={options} />
    </>
  )
}

export default User
