'use client';

import { DataTableFilterBox } from '@/components/layout/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/layout/table/data-table-reset-filters';
import { DataTableSearch } from '@/components/layout/table/data-table-search';

import {
  CATEGORY_OPTIONS,
  useProductTableFilters
} from './product-table-filters';

export default function ProductTableAction() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useProductTableFilters();
  return (
    <div className="flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey="categories"
        title="Categories"
        options={CATEGORY_OPTIONS}
        setFilterValue={setCategoriesFilter}
        filterValue={categoriesFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}