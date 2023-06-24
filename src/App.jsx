import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as XLSX from "xlsx";
import './App.css';
import axios from 'axios';
import { UserAuthContextProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { addDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { db } from './firebase';
import { DataGrid } from '@mui/x-data-grid';
import { MaterialReactTable } from 'material-react-table';

// import { DataGrid } from '@mui/x-data-grid';



function App() {
   const [exceldata, setExcelData] = useState([]);
  const [rows, setRows] = useState([]);
   const [test, setTest] = useState([]);
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
            size: 150,
         },
         {
           accessorKey: 'amount',
            header: 'amount',
            size: 150,
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
  }

  //Ph;No.

//   const sendtest= async(e) => {
//     e.preventDefault()
//     console.log(exceldata)


//  }

// {"listing":[{"phone":"9990049715",
// "message":"Test"},
// {"phone":"9450049715",
// "message":"I'm Ye Kyaw Aung"},
// {"phone":"9450049715","message":"I'm Ye Kyaw Aung"}],"count":3}
  
  return (

  
    <div className="App">
            <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />
<MaterialReactTable columns={columns} data={exceldata} />

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

export default App





// import React, { useMemo } from 'react';
// import { MaterialReactTable } from 'material-react-table';

// //nested data is ok, see accessorKeys in ColumnDef below
// const data = [
//   {
//     name: {
//       firstName: 'John',
//       lastName: 'Doe',
//     },
//     address: '261 Erdman Ford',
//     city: 'East Daphne',
//     state: 'Kentucky',
//   },
//   {
//     name: {
//       firstName: 'Jane',
//       lastName: 'Doe',
//     },
//     address: '769 Dominic Grove',
//     city: 'Columbus',
//     state: 'Ohio',
//   },
//   {
//     name: {
//       firstName: 'Joe',
//       lastName: 'Doe',
//     },
//     address: '566 Brakus Inlet',
//     city: 'South Linda',
//     state: 'West Virginia',
//   },
//   {
//     name: {
//       firstName: 'Kevin',
//       lastName: 'Vandy',
//     },
//     address: '722 Emie Stream',
//     city: 'Lincoln',
//     state: 'Nebraska',
//   },
//   {
//     name: {
//       firstName: 'Joshua',
//       lastName: 'Rolluffs',
//     },
//     address: '32188 Larkin Turnpike',
//     city: 'Charleston',
//     state: 'South Carolina',
//   },
// ];

// const Example = () => {
//   //should be memoized or stable
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'name.firstName', //access nested data with dot notation
//         header: 'First Name',
//         size: 150,
//       },
//       {
//         accessorKey: 'name.lastName',
//         header: 'Last Name',
//         size: 150,
//       },
//       {
//         accessorKey: 'address', //normal accessorKey
//         header: 'Address',
//         size: 200,
//       },
//       {
//         accessorKey: 'city',
//         header: 'City',
//         size: 150,
//       },
//       {
//         accessorKey: 'state',
//         header: 'State',
//         size: 150,
//       },
//     ],
//     [],
//   );

//   return <MaterialReactTable columns={columns} data={data} />;
// };

// export default Example;



