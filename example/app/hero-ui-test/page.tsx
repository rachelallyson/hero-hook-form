"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Switch } from "@heroui/switch";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Radio, RadioGroup } from "@heroui/radio";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Slider } from "@heroui/slider";
import { DateInput } from "@heroui/date-input";

export default function HeroUITestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">HeroUI Component Testing</h1>

      <div className="space-y-6">
        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Input Component</h2>
          <Input
            data-testid="test-input"
            description="This is a test input field"
            label="Test Input"
            placeholder="Type something..."
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Input
              description="This input has name='test-name-attribute' prop"
              label="Input with name prop"
              name="test-name-attribute"
              placeholder="Check if name appears in DOM"
            />
            <p className="text-sm text-gray-600 mt-2">
              Open DevTools and inspect the input element to see if it has a
              name attribute.
            </p>
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Select Component</h2>
          <Select
            data-testid="test-select"
            label="Test Select"
            placeholder="Choose an option"
          >
            <SelectItem key="option1">Option 1</SelectItem>
            <SelectItem key="option2">Option 2</SelectItem>
            <SelectItem key="option3">Option 3</SelectItem>
          </Select>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Select
              label="Select with name prop"
              name="test-select-name"
              placeholder="Choose an option"
            >
              <SelectItem key="option1">Option 1</SelectItem>
              <SelectItem key="option2">Option 2</SelectItem>
            </Select>
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Checkbox Component</h2>
          <Checkbox data-testid="test-checkbox">Test Checkbox</Checkbox>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Checkbox name="test-checkbox-name">
              Checkbox with name prop
            </Checkbox>
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Switch Component</h2>
          <Switch data-testid="test-switch">Test Switch</Switch>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Switch name="test-switch-name">Switch with name prop</Switch>
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Textarea Component</h2>
          <Textarea
            data-testid="test-textarea"
            label="Test Textarea"
            placeholder="Type a message..."
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Textarea
              label="Textarea with name prop"
              name="test-textarea-name"
              placeholder="Type a message..."
            />
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Radio Component</h2>
          <RadioGroup label="Test Radio Group">
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
            <Radio value="option3">Option 3</Radio>
          </RadioGroup>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <RadioGroup
              label="Radio Group with name prop"
              name="test-radio-name"
            >
              <Radio value="option1">Option 1</Radio>
              <Radio value="option2">Option 2</Radio>
            </RadioGroup>
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Autocomplete Component</h2>
          <Autocomplete label="Test Autocomplete" placeholder="Search...">
            <AutocompleteItem key="1">Option 1</AutocompleteItem>
            <AutocompleteItem key="2">Option 2</AutocompleteItem>
          </Autocomplete>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Autocomplete
              label="Autocomplete with name prop"
              name="test-autocomplete-name"
              placeholder="Search..."
            >
              <AutocompleteItem key="1">Option 1</AutocompleteItem>
              <AutocompleteItem key="2">Option 2</AutocompleteItem>
            </Autocomplete>
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Slider Component</h2>
          <Slider defaultValue={50} label="Test Slider" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Slider
              defaultValue={50}
              label="Slider with name prop"
              name="test-slider-name"
            />
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">DateInput Component</h2>
          <DateInput label="Test Date Input" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <DateInput label="DateInput with name prop" name="test-date-name" />
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">File Input Component</h2>
          <Input label="Test File Input" type="file" />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing name prop:</h3>
            <Input
              label="File Input with name prop"
              name="test-file-name"
              type="file"
            />
          </div>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Button Component</h2>
          <Button data-testid="test-button">Test Button</Button>
        </section>
      </div>
    </div>
  );
}
