import AuthLayout from '@/app/layouts/AuthLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import BgLayout from './common/BgLayout';
import useAuth from '../hooks/useAuth';

const Login = () => {
 const [success, setSuccess] = useState(false);

 const {errors,handleSubmit,navigate,register,onLoginSubmit} = useAuth();
 
  return (
    <BgLayout eyebrow="CMD://RESUME_SESSION">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h2 className="text-[32px] leading-10 tracking-[-0.01em] font-bold text-on-surface uppercase">
            Terminal Access
          </h2>
          <div className="h-1 w-12 bg-primary mt-2" />
        </div>
        <div className="text-right font-label-mono">
          <div className="text-[10px] text-outline">AUTH_LEVEL</div>
          <div className="text-secondary text-[14px]">UNVERIFIED</div>
        </div>
      </div>
 
      <form className="space-y-6" onSubmit={handleSubmit(onLoginSubmit)} noValidate>
        <Input
          label="Communication Node"
          tag="[REQ_MAIL_01]"
          type="email"
          placeholder="NODE@SECURE.COM"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
 
        <Input
          label="Access Key"
          tag="[REQ_STR_02]"
          type="password"
          placeholder="********"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
 
        <div className="flex items-center justify-between py-2 px-1">
          <label className="flex items-center gap-3 text-[12px] font-label-mono text-on-surface-variant uppercase">
            <input
              type="checkbox"
              className="w-4 h-4 bg-transparent border-outline text-primary focus:ring-primary/20 rounded-sm"
              {...register("remember")}
            />
            Remember Node
          </label>
        </div>
 
        <div className="pt-4">
          <Button
            type="submit"
            icon="encrypted"
            loadingText="VERIFYING_IDENTITY..."
            success={success}
            successText="ACCESS_GRANTED"
          >
            Authenticate
          </Button>
        </div>
      </form>
 
      <div className="mt-10 pt-6 border-t border-outline-variant/20 flex justify-between items-center">
        <span className="font-label-mono font-medium text-[11px] text-outline uppercase">New Recruit?</span>
        <a
          className="text-secondary font-label-mono text-[12px] cursor-pointer uppercase tracking-widest flex items-center gap-2"
          onClick={() => navigate('/register')}
        >
          Create Identity
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </a>
      </div>
    </BgLayout>
  );
}

export default Login