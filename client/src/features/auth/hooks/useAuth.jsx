import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'

const useAuth = () => {
  let navigate = useNavigate();
  const {register,handleSubmit,formState:{errors}} = useForm();

  const onLoginSubmit = (data) => {
    console.log(data);
  }

  const onRegisterSubmit = (data) => {
    console.log(data);
  }

  return {
    register,
    handleSubmit,
    errors,
    navigate,
    onLoginSubmit,
    onRegisterSubmit
  }
}

export default useAuth