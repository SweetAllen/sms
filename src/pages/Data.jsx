import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
// import { data, states } from './makeData';
import * as XLSX from "xlsx";
import '../../src/App.css';
import axios from 'axios';
import { async } from '@firebase/util';
const Data = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [tableData, setTableData] = useState();

  const [validationErrors, setValidationErrors] = useState({});
  const [exceldata, setExcelData] = useState([]);
  const [tableData, setTableData] = useState(() => exceldata);

  useEffect(() => {
    getData()
    
  }, []);


  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;

      // console.log(values.phone)
      //send/receive api updates here, then refetch or update local table data for re-render
       axios .put("https://sms-server-tau.vercel.app/api/v1/sms",
       {
        "id":row.getValue('id'),
       "phone":values.phone,
     "message":values.message
      })
      .then((response) => {
        console.log(response.data);
        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal

      });
    }
  };
  // axios
  // .put(`${baseURL}/1`, {
  //   title: "Hello World!",
  //   body: "This is an updated post."
  // })
  // .then((response) => {
  //   setPost(response.data);
  // });
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
   async (row) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('id')}`)
      ) {
        return;
      }
      //tableData
      //send api delete request here, then refetch or update local table data for re-render
      await axios.delete("https://sms-server-tau.vercel.app/api/v1/sms",
      {
        "id":row.getValue('id')
    }
 
    // lV89pVH5FvSdK0AVVI72
      )
      .then((response) => {
        console.log(response)
        // console.log(JSON.stringify(response.data.listing[1]));
        // setExcelData(response.data.listing)
        // tableData.push(response.data.listing);
        // setTableData([...response.data.listing]);
      });
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const handleFileUpload=  (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
       setExcelData(parsedData);
      //  tableData.push(parsedData);
      //  setTableData([...tableData]);


      // for (let i = 0; i < data.length; i++) {
       
      //   console.log(data[i])
      // }
     
      
    };
  }//makeData
//

  const getData= async() =>{
    
    await axios.get("https://sms-server-tau.vercel.app/api/v1/sms"
 
 
    )
    .then((response) => {
      console.log(JSON.stringify(response.data.listing[1]));
      // setExcelData(response.data.listing)
      // tableData.push(response.data.listing);
      setTableData([...response.data.listing]);
    });
  }
  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors],
  );

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'id',
//         header: 'ID',
//         enableColumnOrdering: false,
//         enableEditing: false, //disable editing on this column
//         enableSorting: false,
//         size: 80,
//       },
//       {
//         accessorKey: 'firstName',
//         header: 'First Name',
//         size: 140,
//         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
//           ...getCommonEditTextFieldProps(cell),
//         }),
//       },
//       {
//         accessorKey: 'lastName',
//         header: 'Last Name',
//         size: 140,
//         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
//           ...getCommonEditTextFieldProps(cell),
//         }),
//       },
//       {
//         accessorKey: 'email',
//         header: 'Email',
//         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
//           ...getCommonEditTextFieldProps(cell),
//           type: 'email',
//         }),
//       },
//       {
//         accessorKey: 'age',
//         header: 'Age',
//         size: 80,
//         muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
//           ...getCommonEditTextFieldProps(cell),
//           type: 'number',
//         }),
//       },
//       {
//         accessorKey: 'state',
//         header: 'State',
//         muiTableBodyCellEditTextFieldProps: {
//           select: true, //change to select for a dropdown
//           children: states.map((state) => (
//             <MenuItem key={state} value={state}>
//               {state}
//             </MenuItem>
//           )),
//         },
//       },
//     ],
//     [getCommonEditTextFieldProps],
//   );
const columns = 
[

  {
   accessorKey: 'id',
  header: 'id',
  size: 150,
 },
 {
  accessorKey: 'phone',
 header: 'phone',
 size: 150,
},
 {
    accessorKey: 'message', //normal accessorKey
    header: 'message',
   size: 200,
  },
 {
  accessorKey: 'source',
   header: 'source',
    size: 50,
 },


       {
          accessorKey: 'sent',
       // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
        //  filterFn: 'between',
         header: 'sent',
        size: 200,
         //custom conditional format and styling
        Cell: ({ cell }) => (
           <Box
        component="span"
             sx={(theme) => ({
         backgroundColor:
                 cell.getValue() < 50_000
                   ? theme.palette.error.dark
                 : cell.getValue() >= 50_000 && cell.getValue() < 75_000
                 ? theme.palette.warning.dark
                  : theme.palette.success.dark,
            borderRadius: '0.25rem',
               color: '#fff',
               maxWidth: '9ch',
             p: '0.25rem',
          })}
         >
            {cell.getValue()
          //   ?.
          //   toLocaleString?.('en-US', {
          // style: 'currency',
          //   currency: 'USD',
          //   minimumFractionDigits: 0,
          //      maximumFractionDigits: 0,
            // }
            
            }
      </Box>
),

},
{
  accessorKey: 'created_at',
   header: 'created_at',
    size: 50,
 },
    

]
  return (
    <>

<input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns} 
        data={tableData} 
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New 
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Data;
