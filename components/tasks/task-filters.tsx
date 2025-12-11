<<<<<<< HEAD
"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterState = {
  status: string[];
  priority: string[];
  categories: string[];
};

interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string[]) => void;
  categories: any[];
  counts: {
    all: number;
    active: number;
    completed: number;
    overdue: number;
    low: number;
    medium: number;
    high: number;
  };
  className?: string;
}

export function TaskFilters({
  filters,
  onFilterChange,
  categories,
  counts,
  className,
}: TaskFiltersProps) {
  const handleCheckboxChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const current = filters[key];
    let updated: string[];

    if (checked) {
      updated = [...current, value];
    } else {
      updated = current.filter((item) => item !== value);
    }

    onFilterChange(key, updated);
  };

  const clearFilters = () => {
    onFilterChange("status", []);
    onFilterChange("priority", []);
    onFilterChange("categories", []);
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.categories.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["status", "priority", "categories"]}
        className="w-full"
      >
        {/* Status Section */}
        <AccordionItem value="status">
          <AccordionTrigger className="text-sm font-medium">
            Status
            {filters.status.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">
                {filters.status.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {[
                { id: "active", label: "Active", count: counts.active },
                {
                  id: "completed",
                  label: "Completed",
                  count: counts.completed,
                },
                { id: "overdue", label: "Overdue", count: counts.overdue },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${item.id}`}
                    checked={filters.status.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "status",
                        item.id,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`status-${item.id}`}
                    className="flex-1 text-sm font-normal cursor-pointer flex justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.count}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Priority Section */}
        <AccordionItem value="priority">
          <AccordionTrigger className="text-sm font-medium">
            Priority
            {filters.priority.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">
                {filters.priority.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {[
                {
                  id: "high",
                  label: "High",
                  count: counts.high,
                  color: "bg-rose-500",
                },
                {
                  id: "medium",
                  label: "Medium",
                  count: counts.medium,
                  color: "bg-amber-500",
                },
                {
                  id: "low",
                  label: "Low",
                  count: counts.low,
                  color: "bg-sky-500",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${item.id}`}
                    checked={filters.priority.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "priority",
                        item.id,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`priority-${item.id}`}
                    className="flex-1 text-sm font-normal cursor-pointer flex justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("w-2 h-2 rounded-full", item.color)}
                      />
                      {item.label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.count}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories Section */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            Categories
            {filters.categories.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">
                {filters.categories.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {categories.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No categories found
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "categories",
                          category.id,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="flex-1 text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <span
                        className={cn("w-2 h-2 rounded-full", {
                          "bg-sky-500": category.color === "blue",
                          "bg-rose-500": category.color === "red",
                          "bg-emerald-500": category.color === "green",
                          "bg-amber-500": category.color === "yellow",
                          "bg-primary": category.color === "purple",
                          "bg-slate-500": category.color === "gray",
                        })}
                      />
                      {category.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
=======
"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterState = {
  status: string[];
  priority: string[];
  categories: string[];
};

interface TaskFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string[]) => void;
  categories: any[];
  counts: {
    all: number;
    active: number;
    completed: number;
    overdue: number;
    low: number;
    medium: number;
    high: number;
  };
  className?: string;
}

export function TaskFilters({
  filters,
  onFilterChange,
  categories,
  counts,
  className,
}: TaskFiltersProps) {
  const handleCheckboxChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const current = filters[key];
    let updated: string[];

    if (checked) {
      updated = [...current, value];
    } else {
      updated = current.filter((item) => item !== value);
    }

    onFilterChange(key, updated);
  };

  const clearFilters = () => {
    onFilterChange("status", []);
    onFilterChange("priority", []);
    onFilterChange("categories", []);
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.categories.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["status", "priority", "categories"]}
        className="w-full"
      >
        {/* Status Section */}
        <AccordionItem value="status">
          <AccordionTrigger className="text-sm font-medium">
            Status
            {filters.status.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">
                {filters.status.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {[
                { id: "active", label: "Active", count: counts.active },
                {
                  id: "completed",
                  label: "Completed",
                  count: counts.completed,
                },
                { id: "overdue", label: "Overdue", count: counts.overdue },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${item.id}`}
                    checked={filters.status.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "status",
                        item.id,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`status-${item.id}`}
                    className="flex-1 text-sm font-normal cursor-pointer flex justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.count}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Priority Section */}
        <AccordionItem value="priority">
          <AccordionTrigger className="text-sm font-medium">
            Priority
            {filters.priority.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">
                {filters.priority.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {[
                {
                  id: "high",
                  label: "High",
                  count: counts.high,
                  color: "bg-rose-500",
                },
                {
                  id: "medium",
                  label: "Medium",
                  count: counts.medium,
                  color: "bg-amber-500",
                },
                {
                  id: "low",
                  label: "Low",
                  count: counts.low,
                  color: "bg-sky-500",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${item.id}`}
                    checked={filters.priority.includes(item.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "priority",
                        item.id,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`priority-${item.id}`}
                    className="flex-1 text-sm font-normal cursor-pointer flex justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("w-2 h-2 rounded-full", item.color)}
                      />
                      {item.label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.count}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories Section */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            Categories
            {filters.categories.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs h-5 px-1.5">
                {filters.categories.length}
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {categories.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No categories found
                </p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "categories",
                          category.id,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="flex-1 text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <span
                        className={cn("w-2 h-2 rounded-full", {
                          "bg-sky-500": category.color === "blue",
                          "bg-rose-500": category.color === "red",
                          "bg-emerald-500": category.color === "green",
                          "bg-amber-500": category.color === "yellow",
                          "bg-primary": category.color === "purple",
                          "bg-slate-500": category.color === "gray",
                        })}
                      />
                      {category.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
>>>>>>> origin/main
