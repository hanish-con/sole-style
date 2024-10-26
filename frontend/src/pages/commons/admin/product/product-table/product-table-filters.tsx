'use client';

import { useCallback, useMemo, useState } from 'react';

export const CATEGORY_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'kids' },
];



export function useProductTableFilters() {
//   const [searchQuery, setSearchQuery] = useQueryState(
//     'q',
//     searchParams.q
//       .withOptions({ shallow: false, throttleMs: 1000 })
//       .withDefault('')
//   );

//   const [categoriesFilter, setCategoriesFilter] = useQueryState(
//     'categories',
//     searchParams.categories.withOptions({ shallow: false }).withDefault('')
//   );

//   const [page, setPage] = useQueryState(
//     'page',
//     searchParams.page.withDefault(1)
//   );

    const [searchQuery, setSearchQuery] = useState(null);
    const [categoriesFilter, setCategoriesFilter] = useState(null);
    const [page, setPage] = useState(1);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoriesFilter(null);

    setPage(1);
  }, [setSearchQuery, setCategoriesFilter, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoriesFilter;
  }, [searchQuery, categoriesFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    categoriesFilter,
    setCategoriesFilter
  };
}