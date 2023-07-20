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
function ExcelData() {

   const [exceldata, setExcelData] = useState([]);
  const [rows, setRows] = useState([]);
   const [test, setTest] = useState([]);
   const [syncdata, setSyncData] = useState();
   const [rowSelection, setRowSelection] = useState({});
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
          accessorKey: 'refunddate',
           header: 'refunddate',
            size: 50,
         },
        // {
        //   accessorFn: (row) => new Date(row.refunddate), //convert to Date for sorting and filtering
        //   id: 'refunddate',
        //   header: 'Refund Date',
        //   filterFn: 'lessThanOrEqualTo',
        //   sortingFn: 'datetime',
        //   Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
        //   Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
        //   //Custom Date Picker Filter from @mui/x-date-pickers
        //   Filter: ({ column }) => (
        //     <LocalizationProvider dateAdapter={AdapterDayjs}>
        //       <DatePicker
        //         onChange={(newValue) => {
        //           column.setFilterValue(newValue);
        //         }}
        //         slotProps={{
        //           textField: {
        //             helperText: 'Filter Mode: Less Than',
        //             sx: { minWidth: '120px' },
        //             variant: 'standard',
        //           },
        //         }}
        //         value={column.getFilterValue()}
        //       />
        //     </LocalizationProvider>
        //   ),
        // },
         {
           accessorKey: 'amount',
            header: 'amount',
            size: 150,
          },
       
               {
                  accessorKey: 'status',
               // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
                //  filterFn: 'between',
                 header: 'status',
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
      


      // for (let i = 0; i < data.length; i++) {
       
      //   console.log(data[i])
      // }
      
      
    };
  }//makeData

  //Ph;No.

//   const sendtest= async(e) => {
//     e.preventDefault()
//     console.log(exceldata)


//  }

  
  return (

  
    <div className="App">


      

            <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />

{/* <div style={{ display: 'flex', gap: '0.5rem' }}>
           <Button
             color="error"
            //  disabled={!table.getIsSomeRowsSelected()}
              // onClick={handleDeactivate}
              variant="contained"
            >
              Deactivate
          </Button>
             <Button
             color="success"
            //  disabled={!table.getIsSomeRowsSelected()}
            // onClick={handleActivate}
              variant="contained"
          >
              Activatev
           </Button> 
            <Button
             color="info"
            //   disabled={!table.getIsSomeRowsSelected()}
            //  onClick={handleContact}
             variant="contained"
          >
             Contact
            </Button> 
          </div> */}
<MaterialReactTable 
columns={columns} 
data={exceldata} 
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
     enableRowActions
      enableRowSelection
      
      // getRowId={(row) => row} //give each row a more useful id      onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
      // onRowSelectionChange={selectRow} 
      onRowSelectionChange={setRowSelection}
      state={{ rowSelection }} 
      // initialState={{ showColumnFilters: true }}
     positionToolbarAlertBanner="bottom"
     

    //  renderRowActionMenuItems={({ closeMenu }) => [
    //   <MenuItem
    //    key={0}
    //     onClick={() => {
    //      // View profile logic...
    //      closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //  >
    //     <ListItemIcon>
    //      <AccountCircle />
    //    </ListItemIcon>
    //     View Profile
    //   </MenuItem>,
    // <MenuItem
    //     key={1}
    //     onClick={() => {
    //     // Send email logic...
    //       closeMenu();
    //     }}
    //      sx={{ m: 0 }}
    //  >
    //     <ListItemIcon>
    //      <Send />
    //    </ListItemIcon>
    //   Send Email
    //    </MenuItem>,
    //  ]}
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
      table.getSelectedRowModel().flatRows.map((row) => {
           alert('deactivating ' + row.getValue('ecode'));
        });
      };

     const handleSms = () => {
      let ph
      let userData
      let msg
      let day
        table.getSelectedRowModel().flatRows.map((row) => {
          // alert('activating ' + row.getValue('ecode'));
          // setSyncData(row.getValue('phone'))
          console.log(row);

          ph=row.getValue('phone')
    

          let msg1="Payment has been transferred for"
          let msg2= row.getValue('ecode')
          let msg3=row.getValue('amount')
          let msg4=row.getValue('refunddate')
          

          let msg5=". Royal Express Finance hotlines: 09765400804, 09765400801"
          msg= msg1.concat(" ",msg2 +","," ",msg3+ "Ks,", "  ",  msg4, " ", msg5)        
          const userData = {
            "phone":ph.toString(),
            "message":msg
          };
          //toUTCString()
          //  console.log(msg)
           axios.post("https://sms-server-tau.vercel.app/api/v1/sms-server", 
           userData
       
          )
          .then((response) => {
            console.log(response);
          });
                  });
     
                  // Payment has been transferred for E101516, 300000Ks 3/20/2023 . Royal Express Finance hotlines: 09765400804, 09765400801
     };
       const handleContact = async() => {
          let fib
         table.getSelectedRowModel().flatRows.map((row) => {
          //  alert('contact ' + row.getValue('ecode'));
            //  setSyncData(row.getValue('phone'))
                  fib=row.getValue('phone');
         });
         console.log(fib)
         await addDoc(collection(db, "smstest"), {
          "phone":fib,
          "msg": "testing"
         
        });
     };

       return (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
           <Button
           color="error"
          //  disabled={table.getIsSomeRowsSelected()}
            onClick={handleDeactivate}
            variant="contained"
        >
            Deactivate
          </Button>
        <Button
          color="success"
            // disabled={table.getIsSomeRowsSelected()}
             onClick={handleSms}
            variant="contained"
          >
           Send SMS
           </Button>
           <Button
           color="info"
          // disabled={table.getIsSomeRowsSelected()}
            // onClick={handleContact}
             variant="contained"
        >
           aSync to firebase
           </Button>
       </div>
      );
    }}
  />


</div>


    
  );
}

export default ExcelData













