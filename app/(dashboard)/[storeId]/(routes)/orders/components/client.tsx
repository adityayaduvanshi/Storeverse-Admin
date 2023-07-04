'use client';

import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { OrderColumns, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

interface OrderProps {
  data: OrderColumns[];
}

export const OrderClient: React.FC<OrderProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />

      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
