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
    header: 'NAME'
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY'
  },
  {
    accessorKey: 'price',
    header: 'PRICE'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION'
  },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];