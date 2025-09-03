"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Switch } from "@heroui/switch";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";

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
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Checkbox Component</h2>
          <Checkbox data-testid="test-checkbox">Test Checkbox</Checkbox>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Switch Component</h2>
          <Switch data-testid="test-switch">Test Switch</Switch>
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Textarea Component</h2>
          <Textarea
            data-testid="test-textarea"
            label="Test Textarea"
            placeholder="Type a message..."
          />
        </section>

        <section className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Button Component</h2>
          <Button data-testid="test-button">Test Button</Button>
        </section>
      </div>
    </div>
  );
}
