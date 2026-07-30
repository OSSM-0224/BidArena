import FormSectionHeader from '@/components/FormSectionHeader';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import SegmentControl from '@/components/SegmentControl';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import Select from '@/components/Select';
import FileDropzone from '@/components/FileDropzone';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';

const categoryOptions = [
  { label: "Hardware", value: "hardware" },
  { label: "Software", value: "software" },
  { label: "Data_Set", value: "data_set" },
  { label: "Legacy", value: "legacy" },
];
 
const durationOptions = [
  { label: "24H", value: "24h" },
  { label: "48H", value: "48h" },
  { label: "72H", value: "72h" },
  { label: "Custom", value: "custom" },
];
 
const incrementOptions = [
  { label: "+1% Fixed", value: "1" },
  { label: "+2.5% Fixed", value: "2.5" },
  { label: "+5% Fixed", value: "5" },
  { label: "Custom", value: "custom" },
];

const CreateBid = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: "software",
      duration: "48h",
      bidIncrement: "2.5",
      files: [],
    },
  });
 
  const onSubmit = async (data) => {
    // Replace with your real "create asset / bid" request
    console.log("NEW ASSET", data);
    navigate("/dashboard");
  };
 
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 font-label-mono text-[11px] text-primary uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          Encrypted_Connection_Established
        </div>
        <h1 className="text-[26px] font-bold text-on-surface">Asset Deployment Terminal</h1>
        <p className="text-on-surface-variant text-[14px]">
          Initialize new asset for network distribution and auction protocols.
        </p>
      </div>
 
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
        {/* 01 Asset identification */}
        <section className="space-y-5">
          <FormSectionHeader number="01" title="Asset Identification" />
          <div className="space-y-5 pl-9">
            <Input
              label="Product Title // Unique Identifier"
              placeholder="E.G. QUANTUM 7 PROCESSOR CHIP"
              error={errors.title?.message}
              {...register("title", { required: "Title is required" })}
            />
            <Textarea
              label="Technical Specifications // Asset Description"
              placeholder="Detail protocols, performance metrics, and historical data..."
              rows={4}
              error={errors.description?.message}
              {...register("description", { required: "Description is required" })}
            />
            <div className="space-y-2">
              <label className="font-label-mono font-medium text-[11px] tracking-widest uppercase text-outline/60">
                Asset Category // Node Classification
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SegmentControl options={categoryOptions} value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </section>
 
        {/* 02 Financial parameters */}
        <section className="space-y-5">
          <FormSectionHeader number="02" title="Financial Parameters" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pl-9">
            <Input
              label="Starting Bid (USD)"
              type="number"
              step="0.01"
              placeholder="$ 0.00"
              error={errors.startingBid?.message}
              {...register("startingBid", {
                required: "Required",
                min: { value: 0, message: "Must be positive" },
              })}
            />
            <Input
              label="Reserve Price (USD)"
              type="number"
              step="0.01"
              placeholder="$ 0.00"
              error={errors.reservePrice?.message}
              {...register("reservePrice")}
            />
            <Select label="Bid Increment Modifier" options={incrementOptions} {...register("bidIncrement")} />
          </div>
        </section>
 
        {/* 03 Temporal initialization */}
        <section className="space-y-5">
          <FormSectionHeader number="03" title="Temporal Initialization" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pl-9">
            <div className="space-y-2">
              <label className="font-label-mono font-medium text-[11px] tracking-widest uppercase text-outline/60">
                Auction Duration Protocol
              </label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <SegmentControl options={durationOptions} value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Input label="Schedule Deployment Time" type="datetime-local" {...register("scheduledAt")} />
              <p className="font-label-mono text-[10px] text-secondary uppercase tracking-widest">
                Note: Timezone adjusted to UTC-5
              </p>
            </div>
          </div>
        </section>
 
        {/* 04 Visual telemetry */}
        <section className="space-y-5">
          <FormSectionHeader number="04" title="Visual Telemetry" />
          <div className="pl-9">
            <Controller
              name="files"
              control={control}
              render={({ field }) => <FileDropzone value={field.value} onChange={field.onChange} />}
            />
          </div>
        </section>
 
        {/* Footer actions */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-label-mono text-[10px] text-outline uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Node Verification Processing... Key: 3A9-2K4 Duplex
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              fullWidth={false}
              onClick={() => navigate("/dashboard")}
            >
              Save_Draft
            </Button>
            <Button type="submit" size="sm" fullWidth={false} icon="bolt" loading={isSubmitting}>
              Deploy Asset To Network
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBid