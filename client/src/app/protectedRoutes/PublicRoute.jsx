import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
  let {user,isloading} = useSelector((store) => store.auth);

  if(user) return <Navigate to={'/dashboard'}/>
  return (
    <Outlet/>
  )
}

export default PublicRoute