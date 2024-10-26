'use client';
// import { Product } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
// import Image from 'next/image';
import { CellAction } from './cell-action';
import { Product } from '@/models/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AspectRatio } from '@/components/ui/aspect-ratio';


export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'imageURL',
    header: 'IMAGE',
    cell: ({ row }) => {
      return (
        <div className="w-[100px]">
          <AspectRatio ratio={4 / 3} className="bg-muted">
            <img
              src={row.getValue('imageURL')}
              alt={row.getValue('name')}
              className="h-full w-full rounded-md object-cover"
            />
          </AspectRatio>
        </div>
      );
    }
  },
  {
    accessorKey: 'name',
    header: 'NAME',
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY',
  },
  {
    accessorKey: 'price',
    // header: 'PRICE',
    header: () => <div className="text-right">PRICE</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'stock',
    header: () => <div className="text-center">STOCK</div>,
    cell: ({ row }) => {
      const stock = parseFloat(row.getValue("stock"));
      return <div className="text-center bg-gray-100 text-gray-800 text-xs font-bold px-1.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">{stock}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];