import React, { useEffect, useState } from 'react'
import { Button, Switch, IconButton } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import { useNavigate } from 'react-router-dom'
import {
  deleteNotification,
  deleteMultipleNotifications,
  getAllNotifications,
  updateNotificationStatus,
} from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import defaultImg from '../../../../src/assets/images/defaultImg.png'

const Notifications = () => {
  const navigate = useNavigate()
  const [dataTableData, setDataTable] = useState([])

  const fetchNotifications = async () => {
    try {
      const res = await getAllNotifications()
      const data = res.data.info
      setDataTable(data)
    } catch (err) {
      toast.error('Failed to fetch notifications!')
      console.error('Error fetching notifications:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const columns = [
    {
      name: 'title',
      label: 'Title',
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
        sort: false,
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
              checked={!!status} // Ensure status is a boolean
              onChange={() => {
                const data = { id: _id, status: !status }
                updateNotificationStatus(data, _id)
                  .then(() => {
                    toast.success('Status changed successfully!')
                    fetchNotifications()
                  })
                  .catch((error) => {
                    toast.error('Failed to change status!')
                    console.error('Error updating status:', error)
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
                  navigate('/Notification-form', { state: { editData } })
                }}
              />
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure you want to delete this notification?',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    deleteNotification(value)
                      .then(() => {
                        toast.success('Deleted successfully!')
                        fetchNotifications()
                      })
                      .catch((error) => {
                        toast.error('Failed to delete notification!')
                        console.error('Error deleting notification:', error)
                      })
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
      text: 'Are you sure you want to delete selected notifications?',
      icon: 'warning',
      buttons: ['No, cancel it!', 'Yes, I am sure!'],
      dangerMode: true,
    })

    if (confirm) {
      await Promise.all(
        await ids.map(async (data) => {
          await deleteNotification(data)
        }),
      )
        .then(() => {
          toast.success('Deleted successfully!')
          fetchNotifications()
        })
        .catch((error) => {
          toast.error('Failed to delete notifications!')
          console.error('Error deleting multiple notifications:', error)
        })
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
    customToolbarSelect: (selectedRows) => <SelectedRowsToolbar selectedRows={selectedRows} />,
  }

  return (
    <>
      <ToastContainer />
      <div className="right-text">
        <Button
          variant="contained"
          size="medium"
          className="AddButton"
          onClick={() => navigate('/Notification-form')}
        >
          Add Notification
        </Button>
      </div>
      <MUIDataTable
        title={'Notification List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Notifications
