import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {
  useEffect(() => {
    axios.get('http://localhost:3001/api/hello')
    .then(response => {console.log(response.data)})
    .catch(error => {
      console.error('There was an error!', error);
    });
  },[])

  return (
    <div>
      LandingPage
    </div>
  )
}

export default LandingPage