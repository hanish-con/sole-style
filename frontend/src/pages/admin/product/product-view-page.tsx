// import { fakeProducts, Product } from '@/constants/mock-api';
// import { notFound } from 'next/navigation';
import { useParams } from 'react-router-dom';
import ProductForm from './product-form';
import { Product } from '@/models/user';
import { useEffect, useState } from 'react';
import { getProductByID } from '@/utils/api';

// type TProductViewPageProps = {
//   productId: string;
// };

// export default function ProductViewPage({
//   productId
// }: TProductViewPageProps) {}

export default function ProductViewPage() {
  let pageTitle = 'Create New Product';

  const { productId } = useParams();
  const [product, setProduct] = useState<Product>(null!);

  useEffect(() => {
    if (productId !== "new") {
      getProductByID(productId!).then(product => setProduct(product!));
    }
  }, [productId]);

  if (productId !== 'new') {
    if (!product) {
      // notFound();
      // navigate to product not found ?
      return;
    }
    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}