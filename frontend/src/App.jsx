import axios  from "axios"

import './App.css'
import { useEffect } from "react"

function App() {
  
 const fetchData = async ()=>
 {
          const res = await axios.get("/api/healtchecks/");
          
          console.log(res.data)

 }
  useEffect(()=>
  {
     fetchData()
  },[]);
  

  return (
      <div>
            <h1>Video share project frontend part</h1>
      </div>
  )
}

export default App
