"use client";

import React, { useState } from "react";
import { z } from "zod";
import { ZodForm, createZodFormConfig } from "@rachelallyson/hero-hook-form";

const typographySchema = z.object({
  fonts: z.object({
    heading: z.string().default("Inter"),
    body: z.string().default("Roboto"),
    code: z.string().default("Fira Code"),
  }),
  layout: z.object({
    fontSize: z.enum(["small", "medium", "large"]).default("medium"),
    lineHeight: z.enum(["tight", "normal", "relaxed"]).default("normal"),
  }),
  style: z.object({
    theme: z.enum(["light", "dark", "auto"]).default("auto"),
    borderRadius: z.enum(["none", "small", "medium", "large"]).default("medium"),
  }),
});

export default function FontPickerDemo() {
  const [fontLoadingStatus, setFontLoadingStatus] = useState<Record<string, boolean>>({});
  const [loadAllVariants, setLoadAllVariants] = useState(false);

  const handleFontsLoaded = (fontName: string) => (loaded: boolean) => {
    setFontLoadingStatus(prev => ({ ...prev, [fontName]: loaded }));
  };

  const config = createZodFormConfig(typographySchema, [
    // Font selections using enhanced font picker
    {
      name: "fonts.heading",
      type: "fontPicker",
      label: "Heading Font",
      description: "Font for headings and titles",
      fontPickerProps: {
        showFontPreview: true,
        loadAllVariants,
        fontsLoadedTimeout: 5000
      },
    },
    {
      name: "fonts.body",
      type: "fontPicker",
      label: "Body Font",
      description: "Font for body text and paragraphs",
      fontPickerProps: {
        showFontPreview: true,
        loadAllVariants,
        fontsLoadedTimeout: 5000
      },
    },
    {
      name: "fonts.code",
      type: "fontPicker",
      label: "Code Font",
      description: "Monospace font for code blocks",
      fontPickerProps: {
        showFontPreview: true,
        loadAllVariants,
        fontsLoadedTimeout: 5000
      },
    },
  
  // Layout settings
  {
    name: "layout.fontSize",
    type: "radio",
    label: "Font Size",
    radioOptions: [
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
  {
    name: "layout.lineHeight",
    type: "radio",
    label: "Line Height",
    radioOptions: [
      { label: "Tight", value: "tight" },
      { label: "Normal", value: "normal" },
      { label: "Relaxed", value: "relaxed" },
    ],
  },
  
  // Style settings
  {
    name: "style.theme",
    type: "radio",
    label: "Theme",
    radioOptions: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "Auto", value: "auto" },
    ],
  },
  {
    name: "style.borderRadius",
    type: "radio",
    label: "Border Radius",
    radioOptions: [
      { label: "None", value: "none" },
      { label: "Small", value: "small" },
      { label: "Medium", value: "medium" },
      { label: "Large", value: "large" },
    ],
  },
]);

  const handleSubmit = (data: any) => {
    console.log("Typography settings:", data);
    alert(`Typography settings saved!\n\nFonts:\n- Heading: ${data.fonts.heading}\n- Body: ${data.fonts.body}\n- Code: ${data.fonts.code}\n\nLayout:\n- Font Size: ${data.layout.fontSize}\n- Line Height: ${data.layout.lineHeight}\n\nStyle:\n- Theme: ${data.style.theme}\n- Border Radius: ${data.style.borderRadius}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Enhanced Font Picker Demo</h1>
      <p className="text-gray-600 mb-6">
        This demo showcases the enhanced font picker with complete Google Fonts data from react-fontpicker (1,785+ fonts), instant font previews, intelligent 4-variant loading, and font loading detection.
      </p>
      
      {/* Font Loading Status */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Font Loading Status</h3>
        <div className="space-y-2">
          {Object.entries(fontLoadingStatus).map(([fontName, loaded]) => (
            <div key={fontName} className="flex items-center gap-2">
              <span className="font-medium capitalize">{fontName}:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                loaded 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {loaded ? '✓ Loaded' : '⏳ Loading...'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Font Preview System Info */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">✨ Instant Font Previews</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Font previews are displayed instantly using the actual <a href="https://github.com/ae9is/react-fontpicker/tree/main/packages/fontpicker/font-preview" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">react-fontpicker sprite system</a> (1,785+ fonts). Pre-rendered SVG sprites provide instant previews without any network requests.
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Sprite System:</strong> Pre-rendered SVG sprites • 1,785+ Google Fonts • Zero loading time • Smart preview text • CSS sprite positioning
        </div>
      </div>

      {/* Font Loading Options */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Font Loading Options</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={loadAllVariants}
            onChange={(e) => setLoadAllVariants(e.target.checked)}
            className="rounded"
          />
          <span>Load all font variants (increases file size but provides more typography options)</span>
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {loadAllVariants 
            ? "All font variants will be loaded for maximum typography flexibility."
            : "Only 4 essential variants (regular, bold, italic, bold-italic) will be loaded for optimal performance."
          }
        </p>
      </div>
      
      <ZodForm
        config={config}
        onSubmit={handleSubmit}
        title="Typography Settings"
        subtitle="Customize your font choices and layout preferences"
        showResetButton={true}
        submitButtonText="Save Typography"
        resetButtonText="Reset to Defaults"
        layout="grid"
        columns={2}
        spacing="6"
      />
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Font Picker Features</h3>
        <ul className="text-blue-800 text-sm list-disc list-inside space-y-1">
          <li>Google Fonts integration with live preview</li>
          <li>Font category filtering (sans-serif, serif, monospace)</li>
          <li>Font weight variants support</li>
          <li>HeroUI design system integration</li>
          <li>Automatic theme adaptation (light/dark)</li>
          <li>Responsive design for all screen sizes</li>
        </ul>
      </div>
      
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-2">HeroUI Integration</h3>
        <p className="text-green-800 text-sm mb-2">
          The font picker automatically integrates with HeroUI's design system:
        </p>
        <ul className="text-green-800 text-sm list-disc list-inside space-y-1">
          <li>Uses HeroUI's design tokens and CSS variables</li>
          <li>Automatically adapts to light/dark themes</li>
          <li>Matches HeroUI component styling patterns</li>
          <li>Supports responsive design and accessibility</li>
        </ul>
      </div>
    </div>
  );
}
