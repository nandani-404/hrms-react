# TanStack Query Integration Guide

## Overview

The HR Portal uses TanStack Query (React Query) for efficient data fetching, caching, and state management.

## Benefits

- **Automatic Caching** - Data is cached and reused across components
- **Background Refetching** - Keeps data fresh automatically
- **Optimistic Updates** - UI updates instantly before server confirms
- **Error Handling** - Built-in error states and retry logic
- **Loading States** - Automatic loading indicators
- **Reduced Boilerplate** - Less code for data fetching

## Setup

### 1. Query Client Configuration

Located in `src/lib/queryClient.js`:

```javascript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

### 2. Provider Setup

In `src/main.jsx`:

```javascript
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

## Custom Hooks

### Employee Hooks (`src/hooks/useEmployees.js`)

#### Fetch All Employees
```javascript
import { useEmployees } from '../hooks/useEmployees'

const { data: employees, isLoading, error } = useEmployees()
```

#### Create Employee
```javascript
import { useCreateEmployee } from '../hooks/useEmployees'

const createMutation = useCreateEmployee()

const handleCreate = async (employeeData) => {
  try {
    await createMutation.mutateAsync(employeeData)
    // Success!
  } catch (error) {
    // Handle error
  }
}
```

#### Update Employee
```javascript
import { useUpdateEmployee } from '../hooks/useEmployees'

const updateMutation = useUpdateEmployee()

const handleUpdate = async (id, data) => {
  await updateMutation.mutateAsync({ id, data })
}
```

#### Delete Employee
```javascript
import { useDeleteEmployee } from '../hooks/useEmployees'

const deleteMutation = useDeleteEmployee()

const handleDelete = async (id) => {
  await deleteMutation.mutateAsync(id)
}
```

### Attendance Hooks (`src/hooks/useAttendance.js`)

#### Fetch Attendance
```javascript
import { useAttendance } from '../hooks/useAttendance'

const { data: attendance, isLoading } = useAttendance({
  date: '2024-01-15',
  employee_id: 1
})
```

#### Attendance Report
```javascript
import { useAttendanceReport } from '../hooks/useAttendance'

const { data: report } = useAttendanceReport('2024-01-01', '2024-01-31')
```

### Payroll Hooks (`src/hooks/usePayroll.js`)

#### Fetch Payroll
```javascript
import { usePayroll } from '../hooks/usePayroll'

const { data: payroll, isLoading } = usePayroll('2024-01-01', '2024-01-31')
```

#### Payroll Summary
```javascript
import { usePayrollSummary } from '../hooks/usePayroll'

const { data: summary } = usePayrollSummary('2024-01-01', '2024-01-31')
```

## Usage Examples

### Basic Query

```javascript
import { useEmployees } from '../hooks/useEmployees'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const EmployeeList = () => {
  const { data: employees, isLoading, error, refetch } = useEmployees()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div>
      {employees.map(emp => (
        <div key={emp.id}>{emp.full_name}</div>
      ))}
    </div>
  )
}
```

### Mutation with Loading State

```javascript
import { useCreateEmployee } from '../hooks/useEmployees'

const AddEmployeeForm = () => {
  const createMutation = useCreateEmployee()

  const handleSubmit = async (formData) => {
    try {
      await createMutation.mutateAsync(formData)
      alert('Employee created!')
    } catch (error) {
      alert('Failed to create employee')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button 
        type="submit" 
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? 'Creating...' : 'Create Employee'}
      </button>
    </form>
  )
}
```

### Conditional Query

```javascript
import { useAttendance } from '../hooks/useAttendance'

const AttendanceView = ({ selectedDate }) => {
  const { data, isLoading } = useAttendance(
    { date: selectedDate },
    { enabled: !!selectedDate } // Only fetch when date is selected
  )

  if (!selectedDate) return <div>Select a date</div>
  if (isLoading) return <LoadingSpinner />

  return <div>{/* render attendance */}</div>
}
```

## Query Keys

Query keys are used for caching and invalidation:

- `['employees']` - All employees
- `['attendance', params]` - Attendance with filters
- `['attendance-report', startDate, endDate]` - Attendance report
- `['payroll', startDate, endDate, filters]` - Payroll data
- `['payroll-summary', startDate, endDate]` - Payroll summary

## Cache Invalidation

When data changes, invalidate related queries:

```javascript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['employees'] })

// Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['attendance'] })
```

## Best Practices

1. **Use Custom Hooks** - Encapsulate query logic in custom hooks
2. **Handle Loading States** - Always show loading indicators
3. **Handle Errors** - Provide error messages and retry options
4. **Optimize Refetching** - Set appropriate staleTime and cacheTime
5. **Use Query Keys Wisely** - Include all variables that affect the query
6. **Invalidate on Mutations** - Keep cache fresh after updates

## Common Patterns

### Dependent Queries

```javascript
const { data: employee } = useEmployees()
const employeeId = employee?.[0]?.id

const { data: payroll } = useEmployeePayroll(
  employeeId,
  startDate,
  endDate,
  { enabled: !!employeeId }
)
```

### Parallel Queries

```javascript
const employeesQuery = useEmployees()
const attendanceQuery = useAttendance({ date: today })
const payrollQuery = usePayroll(startDate, endDate)

const isLoading = employeesQuery.isLoading || 
                  attendanceQuery.isLoading || 
                  payrollQuery.isLoading
```

### Optimistic Updates

```javascript
const updateMutation = useUpdateEmployee({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['employees'] })

    // Snapshot previous value
    const previous = queryClient.getQueryData(['employees'])

    // Optimistically update
    queryClient.setQueryData(['employees'], (old) => 
      old.map(emp => emp.id === newData.id ? newData : emp)
    )

    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['employees'], context.previous)
  },
})
```

## Debugging

### Enable DevTools (Development Only)

```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Performance Tips

1. **Set Appropriate Stale Times** - Reduce unnecessary refetches
2. **Use Pagination** - For large datasets
3. **Prefetch Data** - Load data before it's needed
4. **Disable Refetch on Focus** - For stable data
5. **Use Select Option** - Transform data in the query

## Migration from useState/useEffect

### Before (useState/useEffect)
```javascript
const [employees, setEmployees] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await api.get('/employees')
      setEmployees(response.data.data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  fetchEmployees()
}, [])
```

### After (TanStack Query)
```javascript
const { data: employees, isLoading, error } = useEmployees()
```

Much cleaner! 🎉

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Tutorial](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)

---

**Happy Querying! 🚀**
