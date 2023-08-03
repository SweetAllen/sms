import React, { useCallback, useMemo, useState, useEffect, CSSProperties } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

import { MaterialReactTable } from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
import { addDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { useNavigate } from 'react-router-dom';
import { redirect } from "react-router-dom";
const Data = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [tableData, setTableData] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [exceldata, setExcelData] = useState([]);
  const [tableData, setTableData] = useState(() => exceldata);
  const [disabled, setDisabled] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [smsdisable, setSmsDisable] = useState(true);
  const [id, setId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
 getData()
if (sessionStorage.getItem('isAuth') === null) {
      navigate("/");
    console.log("aaaaa")

    }else{
      console.log("sssss")
    }
    // console.log("Hiiiiiii",sessionStorage.getItem('isAuth'))
    // window.addEventListener("beforeunload", () => sessionStorage.removeItem('isAuth'));
    // window.history.replaceState({}, document.title)

    // window.onbeforeunload = () => {
    //   sessionStorage.removeItem('isAuth');
    // }
    // Checking if user is not loggedIn

  }, []);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //upload firebase
  const handleupload = () => {
    setOpen(false);
    let msg
    var currentdate = new Date(); 
let datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() +"  "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
      // console.log(datetime)
    exceldata.map((row) => {
      let converted_date = new Date(Math.round((row.refunddate - 25569) * 864e5));
      converted_date = String(converted_date).slice(4, 15)
      row.refunddate = converted_date.split(" ")
      let day = row.refunddate[1];
      let month = row.refunddate[0];
      let year = row.refunddate[2];
      const date = day + '-' + month + '-' + year.slice(2, 4)
      // console.log(date)
      let msg1="Payment has been transferred for"
       let msg5=". Royal Express Finance hotlines: 09765400804, 09765400801"
      msg= msg1.concat(" ",row.ecode.toString() +","," ",row.amount.toLocaleString('en')+ "Ks,", "  ", date, " ", msg5)    
      const firebasedata=
        {
          "phone":row.phone.toString(),
          "source":"excel",
          "message":msg
        }
         addDoc(collection(db, "smsdata"),
         {
          "created_at":datetime.toString(),
          "phone":row.phone.toString(),
          "source":"excel",
          "message":msg,
          "sent":"0",
          "sent_at":null,
          "updated_at":datetime.toString(),
 }
        ).then((snapshot)=>{
          setId(snapshot.id)
           if(snapshot.id != null){


            const MySwal = withReactContent(Swal)
            MySwal.fire({
             position: 'center',
             icon: 'success',
             title: 'Your work has been saved',

                  showConfirmButton: false,
             timer: 4000
            }).then((result) => {
              window.location.reload(true)
            })
           }

        })



              });

  };


//view
//phone
//message
//status

//send message button

//hide menu and login page




  const handleCreateNewRow = (values)  => {
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
  // //  const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  // //sync to firebase
  // const handleupload = () => {
  //   setOpen(false);  
  //    console.log(exceldata)
 
  // };

  const handleFileUpload=  (e) => {
    e.preventDefault();
    setDisabled(false);
    // setOpen(true);

    const reader = new FileReader();

    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
       setExcelData(parsedData);
      //  if(exceldata != ""){
      //   setDisabled(false);

      //  }
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
      // console.log("Hello",JSON.stringify(response.data.listing));
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

  const columns = 
[

  {
   accessorKey: 'id',
   header: 'id',
   size: 150,
   enableEditing:false
 },
 {
  accessorKey: 'phone',
 header: 'phone',
 size: 150,
},
{
  accessorKey: 'ecode',
 header: 'ecode',
 size: 150,
 enableEditing:false
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
                 cell.getValue() === 0
                   ? theme.palette.warning.dark 
                 : cell.getValue() === 1 && cell.getValue() === 1
                 ? theme.palette.success.dark
                  : theme.palette.warning.dark,
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

const handleContact = () => {
  
 
};
  return (
    <div className="App">
       <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        onChange={handleFileUpload} />
        <div>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?
          "}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
Are you sure want to upload this file?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleupload} autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        
        initialState={{ columnVisibility: { id: false,source:false,ecode:false } }} //hide firstName column by default
        columns={columns} 
        data={tableData} 
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        enableRowSelection

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

        renderTopToolbarCustomActions={({ table }) => {
          const handleSms = () => {
            const MySwal = withReactContent(Swal)
            MySwal.fire({
              title: 'Are you sure?',
              text: "Send SMS!",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, send it!'
            }).then((result) => {
              if (result.isConfirmed) {
                let ph
                let userData
                let msg
                let day
                let id
                  table.getSelectedRowModel().flatRows.map((row) => {
          
                    ph=row.getValue('phone')
                    msg=row.getValue('message')
                    id=row.getValue('id')

                    
                   const userData = {
                      "phone":ph.toString(),
                      "message":msg,
                      "id":id.toString()
                    };
                    //toUTCString()
                     console.log(id)
                     axios.post("https://sms-server-tau.vercel.app/api/v1/sms-server", 
                     userData
                 
                    )
                    .then((response) => {
                      console.log(response);
                      Swal.fire(
                        'Good Job!',
                        'Your file has been sent',
                        'success'
                      )
                      window.location.reload(true)

                    });
                            });
           
              }
            })

           
                        // Payment has been transferred for E101516, 300000Ks 3/20/2023 . Royal Express Finance hotlines: 09765400804, 09765400801
           };
          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
  

            <Button
              color="info"
              disabled={disabled}
             onClick={handleClickOpen}
              variant="contained"
            >
              Import
            </Button>
            <Button
              color="success"
              disabled={  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() }    
              onClick={handleSms}
              variant="contained"
            >
              Send SMS
            </Button>
            </div>
              );
            }}
          />
         

        
        </div>
        
        
            
          );
        }
        
// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
//     );
// const validateAge = (age) => age >= 18 && age <= 50;

export default Data;
