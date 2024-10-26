// import { fakeProducts, Product } from '@/constants/mock-api';
// import { notFound } from 'next/navigation';
import { useParams } from 'react-router-dom';
import ProductForm from './product-form';
import { Product } from '@/models/user';

type TProductViewPageProps = {
  productId: string;
};

// export default function ProductViewPage({
//   productId
// }: TProductViewPageProps) {}

export default function ProductViewPage() {
  let product = null;
  let pageTitle = 'Create New Product';

  const { productId } = useParams();

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