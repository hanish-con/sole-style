import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/layout/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import ProductListingPage from './product/product-listing';
import ProductTableAction from './product/product-table/product-table-action';
import { Heading } from '@/components/ui/heading';

export const metadata = {
  title: 'Dashboard: Products'
};



export default function ProductPage() {
  const key = "";

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Products"
            description="Manage products"
          />
          <Link
            to="/admin/product/new"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <ProductTableAction />
        <Suspense
          key={key}
          fallback={<DataTableSkeleton columnCount={5} rowCount={10} />}
        >
          <ProductListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}