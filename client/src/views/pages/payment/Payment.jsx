import { Button, Switch, IconButton } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import swal from 'sweetalert'
import axios from 'axios' // Import axios for API calls
import { checkSession, getAllPayment } from 'src/redux/api/api'
import { CButton, CCol, CForm, CFormFeedback, CFormInput, CFormLabel } from '@coreui/react'
import { useForm } from 'react-hook-form'

const Payment = () => {
  const navigate = useNavigate()
  const [dataTableData, setDataTable] = useState([])

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm()

  const planList = async () => {
    try {
      const res = await getAllPayment()
      const transformedData = res.data.info.map((plan) => ({
        ...plan,
        planname: plan.planid.duration,
        username: plan.userid.name,
      }))

      setDataTable(transformedData)
    } catch (err) {
      console.log(err)
      if (err.response && err.response.data && !err.response.data.success) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message)
        } else {
          toast.error(err.response.data.message || 'An unexpected error occurred.')
        }
      } else {
        toast.error('An unexpected error occurred.')
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      const res = await checkSession(data.sessionid)

      toast.success(res.data.message)
    } catch (error) {
      toast.error(error.response.data.message || 'An unexpected error occurred.')
    }
  }

  useEffect(() => {
    planList()
  }, [])

  //   const handleStatusChange = async (status, _id) => {
  //     const data = { id: _id, status: !status }
  //     try {
  //       await updatePaymentStatus(data, _id)
  //       toast.success('Status changed successfully!', { key: _id })
  //       // Update the status directly in the state
  //       setDataTable((prevData) =>
  //         prevData.map((plan) => (plan._id === _id ? { ...plan, status: !status } : plan)),
  //       )
  //     } catch {
  //       toast.error('Something went wrong!', { key: _id })
  //     }
  //   }

  const columns = [
    {
      name: 'planname',
      label: 'plan name',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'amount',
      label: 'Amount',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'username',
      label: 'user name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'currency',
      label: 'currency',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'status',
      label: 'status',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'paymentId',
      label: 'paymentId',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'sessionId',
      label: 'sessionId',
      options: {
        filter: true,
        sort: true,
      },
    },

    // {
    //   name: 'status',
    //   label: 'Status',
    //   options: {
    //     filter: true,
    //     sort: false,
    //     customBodyRender: (_, { rowIndex }) => {
    //       const { status, _id } = dataTableData[rowIndex]
    //       return <Switch checked={status} onChange={() => handleStatusChange(status, _id)} />
    //     },
    //   },
    // },
    // {
    //   name: '_id',
    //   label: 'Action',
    //   options: {
    //     customBodyRender: (value) => {
    //       return (
    //         <div>
    //           <Icons.EditRounded
    //             className="editButton"
    //             onClick={() => {
    //               const editData = dataTableData.find((data) => data._id === value)
    //               navigate('/Payment-form', { state: { editData } })
    //             }}
    //           />
    //           <Icons.DeleteRounded
    //             className="deleteButton"
    //             onClick={async () => {
    //               const confirm = await swal({
    //                 title: 'Are you sure?',
    //                 text: 'Are you sure you want to delete this plan? All related data will also be deleted.',
    //                 icon: 'warning',
    //                 buttons: ['No, cancel it!', 'Yes, I am sure!'],
    //                 dangerMode: true,
    //               })
    //               if (confirm) {
    //                 try {
    //                   await deletePayment(value)
    //                   toast.success('Deleted successfully!', { key: value })
    //                   planList()
    //                 } catch {
    //                   toast.error('Something went wrong!', { key: value })
    //                 }
    //               }
    //             }}
    //           />
    //         </div>
    //       )
    //     },
    //   },
    // },
  ]

  //   const deleteMultiple = async (selectedRows) => {
  //     const ids = selectedRows.data.map((row) => dataTableData[row.dataIndex]._id)

  //     const confirm = await swal({
  //       title: 'Are you sure?',
  //       text: 'Are you sure that you want to delete the selected plans?',
  //       icon: 'warning',
  //       buttons: ['No, cancel it!', 'Yes, I am sure!'],
  //       dangerMode: true,
  //     })

  //     if (confirm) {
  //       try {
  //         await deleteMultiplePayment(ids)
  //         toast.success('Deleted successfully!', { key: ids.join(',') })
  //         planList()
  //       } catch {
  //         toast.error('Something went wrong!', { key: ids.join(',') })
  //       }
  //     }
  //   }

  //   const SelectedRowsToolbar = ({ selectedRows }) => {
  //     return (
  //       <div>
  //         <IconButton onClick={() => deleteMultiple(selectedRows)}>
  //           <Icons.Delete />
  //         </IconButton>
  //       </div>
  //     )
  //   }

  const options = {
    // customToolbarSelect: (selectedRows) => <SelectedRowsToolbar selectedRows={selectedRows} />,
  }

  return (
    <>
      <ToastContainer />

      {/* <div className="right-text">
        <Button
          variant="contained"
          size="medium"
          className="AddButton"
          onClick={() => navigate('/Payment-form')}
        >
          Add Payment
        </Button>
      </div> */}
      <CForm className="row g-3 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <CCol xl={4} md={12}>
          <CFormLabel>Chack Payment</CFormLabel>
          <CFormInput
            type="text"
            id="validationDefault01"
            {...register('sessionid', {
              required: 'sessionid is required',
            })}
            placeholder="sessionid"
            invalid={!!errors.sessionid}
          />
          <CFormFeedback invalid>sessionid is required</CFormFeedback>
        </CCol>
        <CCol xl={2} md={12}>
          <CButton type="submit" className="mt-4">
            search
          </CButton>
        </CCol>
      </CForm>
      <MUIDataTable
        title={'Payment List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Payment
