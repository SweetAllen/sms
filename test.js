import { useState } from 'react'
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
import { async } from '@firebase/util';
function App() {
  const [data, setData] = useState([]);
  const {  addtodb } = useAuth();

  const handleFileUpload= async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      // console.log(parsedData)
    
      for (let i = 0; i < parsedData.length; i++) { 
        //  const test=[{"phone":parsedData[i].phone,"message":"testing" ,"sent":"done","source":"excel"}]
        //  console.log(test)
         try {
          await addDoc(collection(db, "smsdata"), {
            "phone":parsedData[i],
            "message": "testing",
            "sent": "sent",
             "source": "excel"
          })
        } catch (err) {
          console.log(err)
        }

      }
    };
  }

  //Ph;No.

  // const sendtest= async(e) => {
  //   e.preventDefault()
    // const userObject = {
    //   "senderid": "Default",
    //   "number": "095122503",
    //   "message": "testing"
    // };
    // const makeAPICall = async () => {
    //   try {
    //     const response = await fetch('http://localhost:8080/', {mode:'cors'});
    //     const data = await response.json();
    //     console.log({ data })
    //   }
    //   catch (e) {
    //     console.log(e)
    //   }
    // await  axios.get('http://localhost:8080/cors/', {mode:'cors'}
    // {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded', 
    //     'x-apikey': 'Basic U0I1MzUwMDE4NTEzOTY2NDk2OTMwMTMzNDUyMTMyMDgzMjpZZVYhaEBrbkh5aFVjMVNVUDEkb3IpOSY0diEjSTF1akszcSFQYktXQ0hHRA==',
    //     'Access-Control-Allow-Origin' : 'https://api.smsbrix.com',
    //     'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //     'Accept':'*/*'
    //   }
    // }
  //   )
  //       .then((res) => {
  //           console.log(res.data)
  //       }).catch((error) => {
  //           console.log(error)
  //       });
  
    

  // }


  
  return (


  
    <div className="App">
          <UserAuthContextProvider>

      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
      />

      {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br /><br />
      <button onClick={sendtest}>Test</button>
      </UserAuthContextProvider>
    </div>
  );
}

export default App




// ase_url = 'https://api.smsbrix.com/v1/message/send'
//         parameters = {"senderid": "Default",
//                       "number": cus_mobile_num, "message": message}
//         try:

//             response = requests.post(base_url, data=parameters, auth=(
//                 'SB53500185139664969301334521320832', 'YeV!h@knHyhUc1SUP1$or)9&4v!#I1ujK3q!PbKWCHGD'))
//             if (response.ok):
//                 res_Data = json.loads(response.content)
//                 _logger.info("RESPONSE %s", res_Data)
//         except Exception as e:
//             _logger.error('Failed. Got an error code: %s', e)

//



// localhost/:1 Access to XMLHttpRequest at 'https://api.smsbrix.com/v1/message/send' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status.
// App.jsx:46 AxiosError {message: 'Network Error', name: 'AxiosError', code: 'ERR_NETWORK', config: {…}, request: XMLHttpRequest, …}
// App.jsx:35          POST https://api.smsbrix.com/v1/message/send net::ERR_FAILED