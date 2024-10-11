import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { getAllUser } from 'src/redux/api/api'
import defaultImg from '../../assets/images/default.png'

const UserTable = () => {
  const [dataTableData, setDataTable] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const getuser = async () => {
    try {
      const res = await getAllUser()
      const data = res.data.info.user
      setBaseUrl(res.data.info.baseUrl)
      setDataTable(data)
    } catch (error) {
      toast.error(error)
    }
  }
  useEffect(() => {
    getuser()
  }, [])
  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'mono',
      label: 'MobileNo',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
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
  ]

  const options = {
    selectableRows: 'none',
    rowsPerPage: 3,
    rowsPerPageOptions: [3],
    download: false,
    print: false,
    search: false,
  }
  return (
    <>
      <ToastContainer />
      <MUIDataTable title={'User'} data={dataTableData} columns={columns} options={options} />
    </>
  )
}

export default UserTable
