import React, { useEffect, useState } from 'react'
import MUIDataTable from 'mui-datatables'
import { ToastContainer, toast } from 'react-toastify'
import { getAllComment } from 'src/redux/api/api' // Adjust the import based on your API method

const Comments = () => {
  const [dataTableData, setDataTable] = useState([])
  const [baseUrl, setBaseUrl] = useState('')

  const list = async () => {
    await getAllComment()
      .then((res) => {
        const data = res.data.info.comment
        const trasfer = data.map((comment) => ({
          ...comment,
          username: comment.userid.name,
          recipe: comment.recipeid == null ? null : comment.recipeid.title,
        }))

        setBaseUrl(res.data.info.baseUrl)
        setDataTable(trasfer) // Adjust based on your API response
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
    list()
  }, [])

  // Define your columns here
  const columns = [
    {
      name: 'comment',
      label: 'Comment',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'recipe',
      label: 'Recipe Title',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'username',
      label: 'User Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (image) =>
          image ? (
            <img
              src={baseUrl + image}
              alt={image}
              style={{ height: '50px', width: '50px', borderRadius: '50%' }}
            />
          ) : (
            <span>No Image</span>
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
      <MUIDataTable
        title={'Comments List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Comments
