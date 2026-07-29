import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'

const useAuth = () => {
  let navigate = useNavigate();
  const {register,handleSubmit,formState:{errors}} = useForm();

  return {
    register,
    handleSubmit,
    errors,
    navigate,
  }
}

export default useAuth