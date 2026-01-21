"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { FontPickerField } from "@rachelallyson/hero-hook-form";

type FormData = {
  font: string;
};

export default function SimpleFontTest() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      font: "Inter",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Selected font:", data.font);
    alert(`Selected font: ${data.font}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Font Picker Test</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FontPickerField
          control={control}
          description="Select your preferred font"
          fontPickerProps={{
            loadAllVariants: false,
            showFontPreview: true,
          }}
          label="Choose Font"
          name="font"
        />

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
