'use client';

import { useCallback, useMemo, useState } from 'react';

export const CATEGORY_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'kids' },
];

export const SUBCATEGORY_OPTIONS = [
  { value: 'winter shoes', label: 'Winter Shoes' },
  { value: 'regular shoes', label: 'Regular Shoes' },
];

export const SIZE_OPTIONS = [
  { value: '2', label: 'Size 2' },
  { value: '3', label: 'Size 3' },
  { value: '4', label: 'Size 4' },
  { value: '5', label: 'Size 5' },
  { value: '6', label: 'Size 6' },
  { value: '7', label: 'Size 7' },
  { value: '8', label: 'Size 8' },
  { value: '9', label: 'Size 9' },
  { value: '10', label: 'Size 10' },
  { value: '11', label: 'Size 11' },
  { value: '12', label: 'Size 12' },
  { value: '13', label: 'Size 13' },
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
    const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [sizeFilter, setSizeFilter] = useState(null); 
    const [page, setPage] = useState(1);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategoriesFilter(null);
    setSubcategoryFilter(null); 
    setSizeFilter(null);

    setPage(1);
  }, [setSearchQuery, setCategoriesFilter, setSubcategoryFilter, setSizeFilter, setPage]);


  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoriesFilter || !!subcategoryFilter || !!sizeFilter;
  }, [searchQuery, categoriesFilter, subcategoryFilter, sizeFilter]);


  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    categoriesFilter,
    setCategoriesFilter,
    subcategoryFilter,
    setSubcategoryFilter, 
    sizeFilter,
    setSizeFilter 
  };
}