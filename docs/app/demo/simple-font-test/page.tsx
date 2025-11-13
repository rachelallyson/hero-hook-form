"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontPickerField } from "@rachelallyson/hero-hook-form";

export default function SimpleFontTest() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      font: "Inter",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Selected font:", data.font);
    alert(`Selected font: ${data.font}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Font Picker Test</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FontPickerField
          control={control}
          name="font"
          label="Choose Font"
          description="Select your preferred font"
          fontPickerProps={{
            loadAllVariants: false,
            showFontPreview: true,
          }}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
