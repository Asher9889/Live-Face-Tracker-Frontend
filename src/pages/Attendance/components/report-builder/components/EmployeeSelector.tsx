import { useMemo, useState } from 'react';
import { useEmployee } from '@/components/employees/hooks/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Users } from 'lucide-react';

interface EmployeeSelectorProps {
  selectedIds: string[];
  onSelectedChange: (ids: string[]) => void;
  disabled?: boolean;
}

interface EmployeeItem {
  id: string;
  name: string;
  department?: string;
  role?: string;
  email?: string;
  avatar?: string;
  code?: string;
}

export const EmployeeSelector = ({
  selectedIds,
  onSelectedChange,
  disabled = false,
}: EmployeeSelectorProps) => {
  const [search, setSearch] = useState('');
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useEmployee();

  const employees = useMemo<EmployeeItem[]>(() => {
    return data?.pages.flatMap((page) => page.data ?? []) ?? [];
  }, [data]);

  const filteredEmployees = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return employees;
    }

    return employees.filter((emp) => {
      const haystack = [emp.name, emp.department, emp.role, emp.email, emp.code]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [employees, search]);

  const allVisibleSelected =
    filteredEmployees.length > 0 &&
    filteredEmployees.every((emp) => selectedIds.includes(emp.id));

  const toggleEmployee = (employeeId: string) => {
    onSelectedChange(
      selectedIds.includes(employeeId)
        ? selectedIds.filter((id) => id !== employeeId)
        : [...selectedIds, employeeId]
    );
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      onSelectedChange(
        selectedIds.filter((id) => !filteredEmployees.some((emp) => emp.id === id))
      );
    } else {
      onSelectedChange(
        Array.from(
          new Set([...selectedIds, ...filteredEmployees.map((emp) => emp.id)])
        )
      );
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop < 500 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Select Employees
        </h3>
        <p className="text-xs text-muted-foreground">
          Leave empty to include all employees
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-sm"
          disabled={disabled}
        />
      </div>

      {/* Selected Count Badge */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-primary/10 rounded-md">
          <span className="text-xs text-foreground font-medium">
            <Users className="w-3 h-3 inline mr-1" />
            {selectedIds.length} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => onSelectedChange([])}
            disabled={disabled}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Select All Visible */}
      {filteredEmployees.length > 0 && (
        <button
          onClick={toggleAllVisible}
          disabled={disabled}
          className={`w-full p-2 rounded-md border text-sm font-medium transition-colors ${
            allVisibleSelected
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border hover:border-border/50 hover:bg-accent text-muted-foreground'
          }`}
        >
          {allVisibleSelected ? '✓' : ''} Select All ({filteredEmployees.length})
        </button>
      )}

      {/* Employees List */}
      <ScrollArea className="h-60 border rounded-md bg-background">
        <div onScroll={handleScroll} className="p-3 space-y-1">
          {isLoading && search === '' ? (
            <div className="text-center text-xs text-muted-foreground py-8">
              Loading employees...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8">
              No employees found
            </div>
          ) : (
            filteredEmployees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => !disabled && toggleEmployee(emp.id)}
                disabled={disabled}
                className={`w-full p-2 rounded-md text-left transition-colors ${
                  selectedIds.includes(emp.id)
                    ? 'bg-primary/10 hover:bg-primary/15'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedIds.includes(emp.id)}
                    disabled={disabled}
                    className="pointer-events-none"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{emp.name}</p>
                    {emp.department && (
                      <p className="text-xs text-muted-foreground truncate">
                        {emp.department}
                        {emp.role && ` • ${emp.role}`}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}

          {isFetchingNextPage && (
            <div className="text-center text-xs text-muted-foreground py-2">
              Loading more...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
