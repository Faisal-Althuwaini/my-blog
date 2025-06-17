---
title: "React Query"
description: "Learn how to use React Query to fetch, manage, and cache data in React applications"
pubDate: "May 20 2025"
heroImage: "/react-query.png"
dir: "ltr"
---

React Query is often described as the missing data-fetching library for React, but in more technical terms, it makes **fetching, caching, synchronizing and updating server state** in your React applications a breeze.

## Initial Setup

First, you should wrap your `<App />` component with QueryClient:

```jsx
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}
```

This will provide the whole app with data.

## Basic Usage Example

```jsx
function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery('todos', getTodos)

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })

  return (
    <div>
      <ul>
        {query.data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}
```

## Real Project Example

Here's a real example of a project I used it in:

```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});
```

This is in the App component, the `staleTime` is when it will re-fetch the data? 0 for being always listening to new data changes.

```jsx
<QueryClientProvider client={queryClient}>
  <ReactQueryDevtools />
  <GlobalStyles />
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="cabins" element={<Cabins />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="account" element={<Account />} />
      </Route>

      <Route path="login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
</QueryClientProvider>
```

Here I used React Query Devtools also.

We should provide the client to the provider.

## Custom Hook for Data Fetching

Here's how I used it:

```jsx
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  return { isLoading, cabins, error };
}
```

This is a custom hook to get data from the database.

- `queryKey` is the name of the collection or the query in response
- `queryFn` is what function to run (async function) to store the data in it

## How to Use the Data Fetching Hook

```jsx
function CabinTable() {
  const { isLoading, cabins } = useCabins();

  console.log(cabins);
  if (isLoading) return <Spinner />;

  return (
    <Table role="table">
      <TableHeader role="row">
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </TableHeader>

      {cabins.map((cabin) => (
        <CabinRow cabin={cabin} key={cabin.id} />
      ))}
    </Table>
  );
}

export default CabinTable;
```

The console.log for the cabins is:

```json
Array(4)
0: 
{id: 30, created_at: '2025-05-19T14:04:17.61602+00:00', name: '007', maxCapacity: 2, regularPrice: 222, …}
1: 
{id: 32, created_at: '2025-05-19T14:04:41.452554+00:00', name: 'Copy of 007', maxCapacity: 2, regularPrice: 222, …}
2: 
{id: 24, created_at: '2025-05-19T13:40:59.006676+00:00', name: '002', maxCapacity: 10, regularPrice: 300, …}
3: 
{id: 26, created_at: '2025-05-19T13:48:15.840553+00:00', name: '001', maxCapacity: 2, regularPrice: 222, …}
```

These are the data gotten from the useCabin which is used to fetch the data from database and store it in a state management store.

## Custom Hook for Data Creation

Here's another custom hook I used React Query in:

```jsx
export function useCreateCabin() {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New cabin created successfully");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { isCreating, createCabin };
}
```

### Understanding `useMutation`:

- `useMutation` is a hook from **React Query** used to handle **creating, updating, or deleting** data.
- It returns a `mutate` function (renamed here as `createCabin`) and a loading flag `isLoading` (renamed as `isCreating`).
- This allows you to run the mutation (`createCabin(data)`), and React Query tracks the loading state.
- `mutate` is the function you call to trigger the mutation.

## How to Use the Creation Hook

```jsx
const { isCreating, createCabin } = useCreateCabin();
```

- `createCabin` is the function used to **submit a new cabin to the backend**.
- `isCreating` is a boolean flag to track the loading state while the cabin is being created (used to disable form inputs/buttons).

```jsx
function onSubmit(data) {
  const image = typeof data.image === "string" ? data.image : data.image[0];

  if (isEditSession)
    editCabin(
      { newCabinData: { ...data, image }, id: editId },
      { onSuccess: () => reset() }
    );
  else
    createCabin(
      { ...data, image: image },
      {
        onSuccess: () => reset(),
      }
    );
}
```

## How Does `createCabin` Receive Parameters?

```jsx
import { useMutation } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";

export function useCreateCabin() {
  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: createEditCabin, // this function DOES accept parameters
  });

  return { createCabin, isCreating };
}
```

### Here's the trick:

- `createCabin` is not a "normal function you define yourself."
- It is the **mutation function** provided by `React Query`, and it **automatically accepts parameters**.

So when you call:

```jsx
createCabin(data, {
  onSuccess: () => reset(),
});
```

React Query:

- Passes `data` to the `mutationFn` (`createEditCabin`)
- Runs `onSuccess()` after the mutation is successful

## How React Query Interprets It

When you do this:

```jsx
const mutation = useMutation({
  mutationFn: yourFunction,
});
```

Then calling:

```jsx
mutation.mutate(data, options);
```

is equivalent to:

```jsx
yourFunction(data);
options.onSuccess(); // called after the mutation is successful
```

So `createCabin` is just an alias for `mutate`.

### Summary

- `createCabin` **does accept parameters** — because it's React Query's `mutate` function.
- React Query handles the `data` and the `onSuccess` (or `onError`, etc.)
- Inside `useCreateCabin`, you don't need to define parameters — they're handled by `useMutation`.

## API Function for Creation and Update

```jsx
export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // 1. create/edit a cabin
  let query = supabase.from("cabins");

  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // B) Edit
  if (id)
    query = query
      .update({ ...newCabin, image: imagePath })
      .eq("id", id)
      .select();

  const { data, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. upload image

  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if there was an error in uploading error
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error("Cabin image could not be uploaded");
  }
  return data;
}
```

## Summary

React Query makes data management in React much easier through:

1. **Data Fetching**: Using `useQuery` to fetch data from the server
2. **State Management**: Automatically tracking loading and error states
3. **Caching**: Storing and updating data when needed
4. **Mutations**: Using `useMutation` for creating, updating, and deleting
5. **Synchronization**: Invalidating queries and refetching data when needed

This guide covers the fundamental concepts of React Query and how to use it in real projects. 