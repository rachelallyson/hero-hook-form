"use client";

import type { FormFieldConfig } from "@rachelallyson/hero-hook-form";

import React, { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { ConfigurableForm } from "@rachelallyson/hero-hook-form";

interface CheckoutFormData {
  // Customer Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Shipping Address
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Billing Information
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Payment Information
  paymentMethod: "credit" | "debit" | "paypal";
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;

  // Order Options
  deliveryMethod: "standard" | "express" | "overnight";
  deliveryDate: CalendarDate | null;
  specialInstructions: string;

  // Terms and Marketing
  terms: boolean;
  marketing: boolean;
  saveInfo: boolean;
}

// Mock product data
const mockProducts = [
  {
    id: 1,
    image: "🎧",
    name: "Premium Wireless Headphones",
    price: 299.99,
    quantity: 1,
  },
  {
    id: 2,
    image: "⌚",
    name: "Smart Fitness Watch",
    price: 199.99,
    quantity: 1,
  },
];

const subtotal = mockProducts.reduce((sum, product) => sum + product.price, 0);
const tax = subtotal * 0.08; // 8% tax
const shipping = 15.99;

const checkoutFields: FormFieldConfig<CheckoutFormData>[] = [
  // Customer Information Section
  {
    group: "customer",
    label: "First Name",
    name: "firstName",
    rules: { required: "First name is required" },
    type: "input",
  },
  {
    group: "customer",
    label: "Last Name",
    name: "lastName",
    rules: { required: "Last name is required" },
    type: "input",
  },
  {
    group: "customer",
    inputProps: { type: "email" },
    label: "Email Address",
    name: "email",
    rules: {
      pattern: {
        message: "Invalid email address",
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      },
      required: "Email is required",
    },
    type: "input",
  },
  {
    group: "customer",
    inputProps: { type: "tel" },
    label: "Phone Number",
    name: "phone",
    rules: {
      pattern: {
        message: "Invalid phone number",
        value: /^[+]?[1-9][\d]{0,15}$/,
      },
    },
    type: "input",
  },

  // Shipping Address Section
  {
    group: "shipping",
    label: "Street Address",
    name: "shippingAddress.street",
    rules: { required: "Street address is required" },
    type: "input",
  },
  {
    group: "shipping",
    label: "City",
    name: "shippingAddress.city",
    rules: { required: "City is required" },
    type: "input",
  },
  {
    group: "shipping",
    label: "State/Province",
    name: "shippingAddress.state",
    rules: { required: "State is required" },
    type: "input",
  },
  {
    group: "shipping",
    label: "ZIP/Postal Code",
    name: "shippingAddress.zipCode",
    rules: { required: "ZIP code is required" },
    type: "input",
  },
  {
    group: "shipping",
    label: "Country",
    name: "shippingAddress.country",
    options: [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Australia", value: "au" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
    ],
    rules: { required: "Country is required" },
    type: "select",
  },

  // Billing Address Section
  {
    group: "billing",
    label: "Street Address",
    name: "billingAddress.street",
    rules: { required: "Street address is required" },
    type: "input",
  },
  {
    group: "billing",
    label: "City",
    name: "billingAddress.city",
    rules: { required: "City is required" },
    type: "input",
  },
  {
    group: "billing",
    label: "State/Province",
    name: "billingAddress.state",
    rules: { required: "State is required" },
    type: "input",
  },
  {
    group: "billing",
    label: "ZIP/Postal Code",
    name: "billingAddress.zipCode",
    rules: { required: "ZIP code is required" },
    type: "input",
  },
  {
    group: "billing",
    label: "Country",
    name: "billingAddress.country",
    options: [
      { label: "United States", value: "us" },
      { label: "Canada", value: "ca" },
      { label: "United Kingdom", value: "uk" },
      { label: "Australia", value: "au" },
      { label: "Germany", value: "de" },
      { label: "France", value: "fr" },
    ],
    rules: { required: "Country is required" },
    type: "select",
  },

  // Payment Method Section
  {
    group: "payment",
    label: "Payment Method",
    name: "paymentMethod",
    options: [
      { label: "Credit Card", value: "credit" },
      { label: "Debit Card", value: "debit" },
      { label: "PayPal", value: "paypal" },
    ],
    rules: { required: "Please select a payment method" },
    type: "select",
  },
  {
    group: "payment",
    inputProps: {
      maxLength: 19,
      placeholder: "1234 5678 9012 3456",
    },
    label: "Card Number",
    name: "cardNumber",
    rules: {
      pattern: {
        message: "Invalid card number",
        value: /^[\d\s]{13,19}$/,
      },
      required: "Card number is required",
    },
    type: "input",
  },
  {
    group: "payment",
    label: "Cardholder Name",
    name: "cardHolder",
    rules: { required: "Cardholder name is required" },
    type: "input",
  },
  {
    group: "payment",
    label: "Expiry Month",
    name: "expiryMonth",
    options: [
      { label: "01", value: "01" },
      { label: "02", value: "02" },
      { label: "03", value: "03" },
      { label: "04", value: "04" },
      { label: "05", value: "05" },
      { label: "06", value: "06" },
      { label: "07", value: "07" },
      { label: "08", value: "08" },
      { label: "09", value: "09" },
      { label: "10", value: "10" },
      { label: "11", value: "11" },
      { label: "12", value: "12" },
    ],
    rules: { required: "Expiry month is required" },
    type: "select",
  },
  {
    group: "payment",
    label: "Expiry Year",
    name: "expiryYear",
    options: Array.from({ length: 10 }, (_, i) => {
      const year = new Date().getFullYear() + i;

      return { label: year.toString(), value: year.toString() };
    }),
    rules: { required: "Expiry year is required" },
    type: "select",
  },
  {
    group: "payment",
    inputProps: {
      maxLength: 4,
      placeholder: "123",
      type: "password",
    },
    label: "CVV",
    name: "cvv",
    rules: {
      pattern: {
        message: "Invalid CVV",
        value: /^\d{3,4}$/,
      },
      required: "CVV is required",
    },
    type: "input",
  },

  // Delivery Options
  {
    group: "delivery",
    label: "Delivery Method",
    name: "deliveryMethod",
    options: [
      { label: "Standard (3-5 business days) - $15.99", value: "standard" },
      { label: "Express (1-2 business days) - $25.99", value: "express" },
      { label: "Overnight - $45.99", value: "overnight" },
    ],
    rules: { required: "Please select a delivery method" },
    type: "select",
  },
  {
    dateProps: {
      variant: "bordered",
    },
    group: "delivery",
    label: "Preferred Delivery Date",
    name: "deliveryDate",
    type: "date",
  },
  {
    group: "delivery",
    label: "Special Instructions",
    name: "specialInstructions",
    textareaProps: {
      minRows: 2,
      placeholder: "Any special delivery instructions...",
    },
    type: "textarea",
  },

  // Terms and Options
  {
    group: "terms",
    label: "I agree to the terms and conditions",
    name: "terms",
    rules: { required: "You must agree to the terms" },
    type: "checkbox",
  },
  {
    group: "terms",
    label: "Subscribe to marketing emails",
    name: "marketing",
    type: "checkbox",
  },
  {
    group: "terms",
    label: "Save payment information for future orders",
    name: "saveInfo",
    type: "checkbox",
  },
];

export default function RealWorldDemoPage() {
  const [formState, setFormState] = useState<{
    isSubmitting: boolean;
    isSubmitted: boolean;
    orderNumber: string;
  }>({
    isSubmitted: false,
    isSubmitting: false,
    orderNumber: "",
  });

  const handleSubmit = async (data: CheckoutFormData) => {
    setFormState({ isSubmitted: false, isSubmitting: true, orderNumber: "" });

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;

    setFormState({
      isSubmitted: true,
      isSubmitting: false,
      orderNumber,
    });

    console.log("Checkout completed:", data);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">E-commerce Checkout Demo</h1>
        <p className="text-lg text-default-600 max-w-2xl mx-auto">
          Experience a realistic e-commerce checkout flow with payment
          processing, address validation, and order management. This demo
          showcases how Hero Hook Form handles complex real-world scenarios.
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-content1 rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {mockProducts.map((product) => (
            <div key={product.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{product.image}</span>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-default-600">
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold">${product.price.toFixed(2)}</p>
            </div>
          ))}
          <hr className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>${(subtotal + tax + shipping).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {formState.isSubmitted && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-success-800 font-semibold text-xl mb-2">
              ✅ Order Placed Successfully!
            </h3>
            <p className="text-success-700 mb-4">
              Thank you for your order. Your order number is:
            </p>
            <p className="text-2xl font-mono font-bold text-success-800 mb-4">
              {formState.orderNumber}
            </p>
            <p className="text-success-700">
              You will receive a confirmation email shortly.
            </p>
          </div>
        </div>
      )}

      {/* Checkout Form */}
      {!formState.isSubmitted && (
        <div className="bg-content1 rounded-lg border shadow-sm">
          <ConfigurableForm
            fields={checkoutFields}
            layout="vertical"
            showResetButton={true}
            spacing="6"
            submitButtonProps={{
              color: "success",
              disabled: formState.isSubmitting,
              isLoading: formState.isSubmitting,
              size: "lg",
            }}
            submitButtonText={
              formState.isSubmitting
                ? "Processing Payment..."
                : "Complete Order"
            }
            subtitle="Complete your purchase securely"
            title="Checkout Information"
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-content1 p-6 rounded-lg border">
          <h3 className="font-semibold text-primary mb-3">
            💳 Payment Processing
          </h3>
          <p className="text-sm text-default-600">
            Secure payment form with credit card validation, CVV verification,
            and multiple payment options including PayPal.
          </p>
        </div>
        <div className="bg-content1 p-6 rounded-lg border">
          <h3 className="font-semibold text-primary mb-3">
            📦 Address Management
          </h3>
          <p className="text-sm text-default-600">
            Separate shipping and billing addresses with smart defaults and
            validation for international addresses.
          </p>
        </div>
        <div className="bg-content1 p-6 rounded-lg border">
          <h3 className="font-semibold text-primary mb-3">
            🚚 Delivery Options
          </h3>
          <p className="text-sm text-default-600">
            Multiple delivery methods with date selection and special
            instructions for flexible shipping preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
