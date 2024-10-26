// import { fakeProducts } from '@/constants/mock-api';

import { DataTable as ProductTable } from '@/components/layout/table/data-table';
import { columns } from './product-table/column';
import { Product } from '@/models/user';
import { getProducts } from '@/utils/api';
import { useEffect, useState } from 'react';



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
  // const data = { total_products: 10, products: []};

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    getProducts(null).then(data => {
      setProducts(data.products);
      setTotalProducts(data.totalProducts);
    });
  }, []);

  // const totalProducts = data.totalProducts;
  // const products: Product[] = data.products;

  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}