import { useState, useMemo } from 'react'
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
function ExcelData() {

   const [exceldata, setExcelData] = useState([]);
  const [rows, setRows] = useState([]);
   const [test, setTest] = useState([]);
   const [syncdata, setSyncData] = useState();

  //  const [columns, setColumns] = useMemo([      {
  //   accessorKey: 'hello',
  //   header: 'Ecode',
  //   size: 150,
  // }]);

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
            accessorKey: 'bank', //normal accessorKey
            header: 'bank',
           size: 200,
          },
         {
          accessorKey: 'refunddate',
           header: 'refunddate',
            size: 50,
         },
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
              Activate
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
      // initialState={{ showColumnFilters: true }}
     positionToolbarAlertBanner="bottom"
     

     renderRowActionMenuItems={({ closeMenu }) => [
      <MenuItem
       key={0}
        onClick={() => {
         // View profile logic...
         closeMenu();
        }}
        sx={{ m: 0 }}
     >
        <ListItemIcon>
         <AccountCircle />
       </ListItemIcon>
        View Profile
      </MenuItem>,
    <MenuItem
        key={1}
        onClick={() => {
        // Send email logic...
          closeMenu();
        }}
         sx={{ m: 0 }}
     >
        <ListItemIcon>
         <Send />
       </ListItemIcon>
      Send Email
       </MenuItem>,
     ]}
    renderTopToolbarCustomActions={({ table }) => {
      const handleDeactivate = () => {
      table.getSelectedRowModel().flatRows.map((row) => {
           alert('deactivating ' + row.getValue('ecode'));
        });
      };

     const handleActivate = async() => {
      let ph
        table.getSelectedRowModel().flatRows.map((row) => {
          // alert('activating ' + row.getValue('ecode'));
          // setSyncData(row.getValue('phone'))
          ph=row.getValue('phone')
        });
        
       const userData = {
        "phone":ph,
        "message":"Hi Testing"
      };
      console.log(JSON.stringify(userData))
      //https://sms-server-tau.vercel.app/v1/api/
      await axios.post("https://sms-server-tau.vercel.app/v1/api/sms-server", 
      {
        "phone":ph.toString(),
        "message":"Hi Royal sms"
    }
   
      )
      .then((response) => {
        console.log(response);
      });
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
           disabled={!table.getIsSomeRowsSelected()}
            onClick={handleDeactivate}
            variant="contained"
        >
            Deactivate
          </Button>
        <Button
          color="success"
            disabled={!table.getIsSomeRowsSelected()}
             onClick={handleActivate}
            variant="contained"
          >
           Send SMS
           </Button>
           <Button
           color="info"
          disabled={!table.getIsSomeRowsSelected()}
            onClick={handleContact}
             variant="contained"
        >
           aSync to firebase
           </Button>
       </div>
      );
    }}
  />


{/* <button onClick={sendtest}>Test</button> */}
</div>
      // <input 
      //   type="file" 
      //   accept=".xlsx, .xls" 
      //   onChange={handleFileUpload} 
      // />
//  <div style={{ height: 400, width: '100%' }}>
//       <DataGrid
//         rows={rows}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 5 },
//           },
//         }}
//         pageSizeOptions={[5, 10]}
//         checkboxSelection
//       />
//     </div>
//       {/* {data.length > 0 && (
//         <table className="table">
//           <thead>
//             <tr>
//               {Object.keys(data[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, index) => (
//                   <td key={index}>{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )} */}

//       <button onClick={sendtest}>Test</button>
//     </div>

    
  );
}

export default ExcelData













