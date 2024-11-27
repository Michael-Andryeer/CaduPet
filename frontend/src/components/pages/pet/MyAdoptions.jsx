import api from '../../../utils/api'

import {useState, useEffect} from 'react'

export default function MyAdoptions() {
  const [pets,setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')

  useEffect(() => {
    api.get('/pets/myadoptions', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).then((response) =>{
      setPets(response.data.pets)
    })
  },[token])

  return (
    <h1>Hello World</h1>
  )
}