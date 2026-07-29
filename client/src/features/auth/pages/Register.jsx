import React, { useState } from "react";
import BgLayout from "./common/BgLayout";
import Input from "@/components/Input";
import Button from "@/components/Button";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const [success, setSuccess] = useState(false);

  const { errors, handleSubmit, navigate, register, onRegisterSubmit } =
    useAuth();
  return (
    <BgLayout>
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h2 className="text-[32px] leading-10 tracking-[-0.01em] font-bold text-on-surface uppercase">
            Identity Creation
          </h2>
          <div className="h-1 w-12 bg-primary mt-2" />
        </div>
        <div className="text-right font-label-mono">
          <div className="text-[10px] text-outline">AUTH_LEVEL</div>
          <div className="text-secondary text-[14px]">UNVERIFIED</div>
        </div>
      </div>

      <form
        className="space-y-6"
        onSubmit={handleSubmit(onRegisterSubmit)}
        noValidate
      >
        <Input
          label="Legal Identity Name"
          tag="[REQ_STR_01]"
          placeholder="E.G. ALEXANDER THORNE"
          error={errors.fullName?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name is too short" },
          })}
        />

        <Input
          label="Communication Node"
          tag="[REQ_MAIL_02]"
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
            type="password"
            placeholder="********"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
            })}
          />

        <div className="flex items-start gap-4 py-4 px-2 bg-surface-container-low/50 ">
          <input
            id="terms"
            type="checkbox"
            className="mt-1 w-4 h-4 bg-transparent border-outline text-primary focus:ring-primary/20 rounded-sm"
            {...register("terms", {
              required: "You must accept the terms to continue",
            })}
          />
          <label
            htmlFor="terms"
            className="text-[12px] font-label-mono text-on-surface-variant leading-relaxed"
          >
            I ACKNOWLEDGE ALL{" "}
            <a
              className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
              href="#"
            >
              RISK PROTOCOLS
            </a>{" "}
            AND{" "}
            <a
              className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary"
              href="#"
            >
              CLEARANCE TERMS
            </a>
            .
          </label>
        </div>
        {errors.terms && (
          <p className="text-[11px] font-label-mono text-error tracking-wide uppercase -mt-4">
            {errors.terms.message}
          </p>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            icon="encrypted"
            loadingText="ENCRYPTING_IDENTITY..."
            success={success}
            successText="ACCESS_GRANTED"
          >
            Initialize Authorization
          </Button>
        </div>
      </form>

      <div className="mt-10 pt-6 border-t border-outline-variant/20 flex justify-between items-center">
        <span className="font-label-mono font-medium text-[11px] text-outline uppercase">
          Existing User?
        </span>
        <a
          className="text-secondary font-label-mono text-[12px] cursor-pointer uppercase tracking-widest flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          Sign In Terminal
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </a>
      </div>
    </BgLayout>
  );
};

export default Register;
