import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/auth.api';

const useAuth = () => {
  let navigate = useNavigate();
  const {register,handleSubmit,formState:{errors}} = useForm();
  let dispatch = useDispatch();

  const onLoginSubmit = (data) => {
    dispatch(loginUser(data));
  }

  const onRegisterSubmit = (data) => {
    dispatch(registerUser(data));
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