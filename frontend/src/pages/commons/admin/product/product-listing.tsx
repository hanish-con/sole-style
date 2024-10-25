// import { fakeProducts } from '@/constants/mock-api';

import { DataTable as ProductTable } from '@/components/layout/table/data-table';
import { columns } from './product-table/column';


type Product = {
    photo_url: string;
    name: string;
    description: string;
    created_at: string;
    price: number;
    id: number;
    category: string;
    updated_at: string;
}


export default function ProductListingPage() {
  // Showcasing the use of search params cache in nested RSCs
//   const page = searchParamsCache.get('page');
//   const search = searchParamsCache.get('q');
//   const pageLimit = searchParamsCache.get('limit');
//   const categories = searchParamsCache.get('categories');

//   const _filters = {
//     page,
//     limit: pageLimit,
//     ...(search && { search }),
//     ...(categories && { categories: categories })
//   };

//   const data = await fakeProducts.getProducts(filters);
  const data = { total_products: 10, products: []};
  const totalProducts = data.total_products;
  const products: Product[] = data.products;

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}