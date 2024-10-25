// import { fakeProducts, Product } from '@/constants/mock-api';
// import { notFound } from 'next/navigation';
import ProductForm from './product-form';

type TProductViewPageProps = {
  productId: string;
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};


export default function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    // const data = await fakeProducts.getProductById(Number(productId));
    const data = { total_products: 10, product: []};
    product = data.product as Product;
    if (!product) {
      // notFound();
      return;
    }
    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}