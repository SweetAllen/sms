import { useState, useMemo, useEffect } from 'react'
import * as XLSX from "xlsx";
import '../../src/App.css';
import axios from 'axios';
// import UseAu
// import { UserAuthContextProvider } from './context/AuthContext';
// import { useAuth } from './context/AuthContext';
import { addDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';
import { DataGrid } from '@mui/x-data-grid';
import { MaterialReactTable } from 'material-react-table';
// import { Button } from '@coreui/coreui';
// import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { MenuItem, ListItemIcon, Box,   Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, } from '@mui/material';
import { AccountCircle, Send } from '@mui/icons-material';
import { async } from '@firebase/util';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

function ExcelData() {

   const [exceldata, setExcelData] = useState([]);
  const [rows, setRows] = useState([]);
   const [test, setTest] = useState([]);
   const [syncdata, setSyncData] = useState();
   const [rowSelection, setRowSelection] = useState({});
   const navigate = useNavigate();
   const [disabled, setDisabled] = useState(true);
   const [open, setOpen] = useState(false);
   const [tableData, setTableData] = useState(() => exceldata);
   const [file, setFile] = useState();

//    {
//     "senderid": "Default",
//      "number": "095122503 ,09450049715", 
//      "message": "testing" 

// }
    //  const [columns, setColumns] = useMemo([      {
  //   accessorKey: 'hello',
  //   header: 'Ecode',
  //   size: 150,
  // }]);
    useEffect(() => {

      // if (sessionStorage.getItem('isAuth') === null) {
      //   navigate("/");
      // console.log("aaaaa")
  
      // }else{
      //   console.log("sssss")
      // }
        //do something when the row selection changes...
      
        console.info({ rowSelection });
      }, [rowSelection]);
   // const selectRow =() =>{
      //   setRowSelection
      //            console.log("Hello")
      // }
  const columns = 
        [
          {
           accessorKey: 'phone', //access nested data with dot notation
            header: 'phone',
            size: 150,
          },
          {
           accessorKey: 'ecode',
          header: 'ecode',
          size: 150,
         },
         {
            accessorKey: 'bank', //n ormal accessorKey
            header: 'bank',
           size: 200,
          },
          
        {
          // accessorFn: (row) =>String(new Date(Math.round((row.refunddate - 25569) * 864e5))).slice(4, 15),      
           //convert to Date for sorting and filtering
           accessorKey: 'refunddate',
          id: 'refunddate',
          header: 'Refund Date',
          filterFn: 'lessThanOrEqualTo',  
          sortingFn: 'datetime',
          Cell: ({ cell }) => (cell.getValue()).split(" ").join('-'),
          // cell.getValue('refunddate[1]')+ '-' + cell.getValue('cell.refunddate[0]') + '-' + cell.getValue('cell.refunddate[2]').slice(2, 4),  //render Date as a string

          // row.refunddate[1] + '-' + row.refunddate[0] + '-' + row.refunddate[2].slice(2, 4),  //render Date as a string

          Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
          //Custom Date Picker Filter from @mui/x-date-pickers
          Filter: ({ column }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(newValue) => {
                  column.setFilterValue(newValue);
                }}
                slotProps={{
                  textField: {
                    helperText: 'Filter Mode: Less Than',
                    sx: { minWidth: '120px' },
                    variant: 'standard',
                  },
                }}
                value={column.getFilterValue()}
              />
            </LocalizationProvider>
          ),
        },
         {
          accessorFn: (row) =>row.amount.toLocaleString('en'),      
            header: 'amount',
            size: 150,
          }
       
//                {
//                   accessorKey: 'status',
//                  header: 'status',
//                 size: 200,
//                  //custom conditional format and styling
//                 Cell: ({ cell }) => (
//                    <Box
//                 component="span"
//                      sx={(theme) => ({
//                  backgroundColor:
//                          cell.getValue() < 50_000
//                            ? theme.palette.error.dark
//                          : cell.getValue() >= 50_000 && cell.getValue() < 75_000
//                          ? theme.palette.warning.dark
//                           : theme.palette.success.dark,
//                     borderRadius: '0.25rem',
//                        color: '#fff',
//                        maxWidth: '9ch',
//                      p: '0.25rem',
//                   })}
//                  >
//                     {cell.getValue()
//                   //   ?.
//                   //   toLocaleString?.('en-US', {
//                   // style: 'currency',
//                   //   currency: 'USD',
//                   //   minimumFractionDigits: 0,
//                   //      maximumFractionDigits: 0,
//                     // }
                    
//                     }
//               </Box>
// ),

// },
 ]
 const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const handleupload = () => {
  setOpen(false);
  let msg
  let test1=[]
  let test2={}
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
   
      test1.push(      {
        "phone":row.phone.toString(),
        "message":msg,
        "source":"excel"
      })

  //    let a={
  //     "source":"excel",
  //     "raw":test1
      
  // }
  tableData.push({"phone":row.phone.toString(),
  "ecode":row.ecode.toString(),
   "bank":row.bank,  
   "refunddate":date,
   "amount":row.amount

   });
  setTableData([...tableData]); 
  console.log(tableData)


     });
};
         const handleFileUpload=  (e) => {
     e.preventDefault();
     setDisabled(false);

    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
       setExcelData(parsedData);
          };
  }
  return (
  <div className="App">
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />
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
columns={columns} 
data={tableData} 
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
     enableRowActions
      enableRowSelection
      onRowSelectionChange={setRowSelection}
      state={{ rowSelection }} 
       positionToolbarAlertBanner="bottom"
       renderTopToolbarCustomActions={({ table }) => {
      const handleSms = () => {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
          title: 'Are you sure?',
          text: "Upload to sms server!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Upload'
        }).then((result) => {
          if (result.isConfirmed) {
            let ph
            let ecode
            let amount
            let date
            let msg
            let test1=[]
            let test2={}
   table.getSelectedRowModel().flatRows.map((row) => {
      
                ph=row.getValue('phone')
                ecode=row.getValue('ecode')
                amount=row.getValue('amount')
                date=row.getValue('refunddate')
                let msg1="Payment has been transferred for"
                let msg5=". Royal Express Finance hotlines: 09765400804, 09765400801"
               msg= msg1.concat(" ",ecode.toString() +","," ",amount+ "Ks,", "  ", date, " ", msg5)    
                // msg=row.getValue('message')
        
                 test1.push(      {
                  "phone":ph.toString(),
                  "message":msg
                  // "source":"excel"
                })

                
              //   axios.post("https://royalexpress.webstarterz.com/sms-server/api/v1/sms", 
              //   {
              //     "source":"excel",
              //     "raw":
              //     test1
              //   }  
              //  )
              //  .then((response) => {
              //    console.log(response.data);
                
              //  });
                             
                                        });

                                        // console.log({
                                        //   "source":"excel",
                                        //   "raw":
                                        //   test1
                                        // }          )  
                                        
             axios.post("https://royalexpress.webstarterz.com/sms-server/api/v1/sms", 
                {
                  "source":"excel",
                  "raw":
                  test1
                }  
               )
               .then((response) => {
                 console.log(response.data);
                 if(response.data.success == 1){
                  Swal.fire({
                    title: 'Good Job',
                
                    confirmButtonText: 'Ok',
                    icon: 'success',
                
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      setTableData("")
                      window.location.reload(true)
                      // Swal.fire('Saved!', '', 'success')
                    } else if (result.isDenied) {
                      // Swal.fire('Changes are not saved', '', 'info')
                    }
                  })

                   
               
                 }

                
               });
                              
       
          }
        })

       
       };
       return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
              color="info"
              disabled={disabled}
             onClick={handleClickOpen}
              variant="contained"
            >
              Upload
            </Button>
        <Button
          color="success"
          disabled={  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() }    
          onClick={handleSms}
            variant="contained"
          >
            
           Import
           </Button>


       </div>
      );
    }}
  />


</div>


    
  );
}

export default ExcelData













