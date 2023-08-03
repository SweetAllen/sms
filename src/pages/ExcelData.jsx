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
import { MenuItem, ListItemIcon, Box } from '@mui/material';
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

      if (sessionStorage.getItem('isAuth') === null) {
        navigate("/");
      console.log("aaaaa")
  
      }else{
        console.log("sssss")
      }
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
        //  {
        //   accessorKey: 'refunddate',
        //    header: 'refunddate',
        //     size: 50,
        //  },


        {
          accessorFn: (row) =>String(new Date(Math.round((row.refunddate - 25569) * 864e5))).slice(4, 15),      
           //convert to Date for sorting and filtering
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
      


 
      
    };
  }

  
  
  return (
  <div className="App">
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />
<MaterialReactTable 
columns={columns} 
data={exceldata} 
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
          text: "Send SMS!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, send it!'
        }).then((result) => {
          if (result.isConfirmed) {
            let ph
            let ecode
            let amount
            let date
            let msg
   table.getSelectedRowModel().flatRows.map((row) => {
      
                ph=row.getValue('phone')
                ecode=row.getValue('ecode')
                amount=row.getValue('amount')
                date=row.getValue('refunddate')
                let msg1="Payment has been transferred for"
                let msg5=". Royal Express Finance hotlines: 09765400804, 09765400801"
               msg= msg1.concat(" ",ecode.toString() +","," ",amount+ "Ks,", "  ", date, " ", msg5)    
                // msg=row.getValue('message')
        
               const userData = {
                  "phone":ph.toString(),
                  "message":msg
                };
                //toUTCString()
                 console.log(userData)
                //  axios.post("https://sms-server-tau.vercel.app/api/v1/sms-server", 
                //  userData
             
                // )
                // .then((response) => {
                //   console.log(response);
                //   Swal.fire(
                //     'Good Job!',
                //     'Your file has been sent',
                //     'success'
                //   )
                // });
                        });
       
          }
        })

       
       };
       return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>

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

export default ExcelData













