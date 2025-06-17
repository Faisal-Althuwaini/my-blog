---
title: "React Hook Form: A Powerful Form Management Library"
description: "Learn how to use React Hook Form to manage form state and validation in React applications"
pubDate: "May 19 2025"
heroImage: "/react-hook-form.png"
dir: "ltr"
---

React Hook Form is a powerful library for managing form state and validation in React.

To use it we should call the hook:

## `useForm()` Setup

```jsx
const { register, handleSubmit, reset, getValues, formState } = useForm();
```

- `register`: connects inputs to the form.
- `handleSubmit`: wraps your `onSubmit` and handles validation.
- `reset`: clears form state after successful submit.
- `getValues`: fetches current form values (used for validation).
- `formState`: contains state like `errors`.

## Registering Fields

Each `Input`, `Textarea`, etc., is registered with validation like:

```jsx
{...register("name", { required: "This field is required" })}
```

Example:

```jsx
<Input
  {...register("discount", {
    required: "This field is required",
    validate: (value) =>
      value <= getValues().regularPrice ||
      "Discount should be less than regular price",
  })}
/>
```

This means:

- This input is now **tracked** by React Hook Form.
- If it's empty, the form will show the error: **"This field is required"**

The `register()` function:

- Tracks the value automatically.
- Applies validation.
- Adds the field to the form data.

## Handling Submission

I used `handleSubmit` to manage the submit logic:

```jsx
<Form onSubmit={handleSubmit(onSubmit, onError)}>
```

When the user clicks "Submit":

- `React Hook Form` validates all the inputs.
- If all fields are valid, it calls `onSubmit(data)`.
- If any field has an error, it calls `onError(errors)`.

## Displaying Error Messages

```jsx
<FormRow label="Cabin name" error={errors?.name?.message}>
```

`formState.errors` holds all the validation messages. If there's an error with `name`, it shows the message.

If you submit the form, the `data` object will look like this (assuming these example values):

```json
{
  name: "Cozy Cabin",
  maxCapacity: "5",
  regularPrice: "200",
  discount: "20",
  description: "A beautiful cabin in the woods",
  image: [File]  // This is a File object 
}
```

All of these because we used the register function to all the input fields.

## Full Code Example

```jsx
<Form onSubmit={handleSubmit(onSubmit, onError)}>
  <FormRow label="Cabin name" error={errors?.name?.message}>
    <Input
      type="text"
      id="name"
      {...register("name", { required: "This field is required" })}
      disabled={isCreating}
    />
  </FormRow>

  <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
    <Input
      type="number"
      id="maxCapacity"
      disabled={isCreating}
      {...register("maxCapacity", {
        required: "This field is required",
        min: {
          value: 1,
          message: "Capacity should be at least 1",
        },
      })}
    />
  </FormRow>

  <FormRow label="Regular price" error={errors?.regularPrice?.message}>
    <Input
      type="number"
      id="regularPrice"
      disabled={isCreating}
      {...register("regularPrice", {
        required: "This field is required",
        min: {
          value: 1,
          message: "Capacity should be at least 1",
        },
      })}
    />
  </FormRow>

  <FormRow label="Discount" error={errors?.discount?.message}>
    <Input
      type="number"
      id="discount"
      defaultValue={0}
      disabled={isCreating}
      {...register("discount", {
        required: "This field is required",
        validate: (value) =>
          value <= getValues().regularPrice ||
          "Discount should be less than regular price",
      })}
    />
  </FormRow>

  <FormRow
    label="Description for website"
    error={errors?.description?.message}
  >
    <Textarea
      type="number"
      id="description"
      disabled={isCreating}
      defaultValue=""
      {...register("description", { required: "This field is required" })}
    />
  </FormRow>

  <FormRow label="Cabin photo">
    <FileInput
      id="image"
      accept="image/*"
      {...register("image", { required: "This field is required" })}
    />
  </FormRow>

  <FormRow>
    {/* type is an HTML attribute! */}
    <Button variation="secondary" type="reset">
      Cancel
    </Button>
    <Button disabled={isCreating}>Add cabin</Button>
  </FormRow>
</Form>
```

## Summary

React Hook Form provides a powerful and efficient way to manage forms in React applications through:

1. **Simple Setup**: Just call `useForm()` to get all the necessary functions
2. **Easy Registration**: Use `register()` to connect inputs to the form
3. **Built-in Validation**: Apply validation rules directly in the register function
4. **Error Handling**: Automatic error state management and display
5. **Form Submission**: Clean submission handling with `handleSubmit`

This approach makes form management much simpler compared to manually managing form state and validation in React. 