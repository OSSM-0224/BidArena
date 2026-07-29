import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  let {user,isloading} = useSelector((store) => store.auth);

  if(!user) return <Navigate to={'/'}/>
  return (
    <Outlet/>
  )
}

export default ProtectedRoute