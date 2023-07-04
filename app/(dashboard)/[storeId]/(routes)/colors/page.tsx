import { format } from 'date-fns';
import prismadb from '@/lib/prismadb';

import { ColorClient } from './components/client';
import { ColorColumns } from './components/columns';

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  });

  const formatedSizes: ColorColumns[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do yyyy'),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formatedSizes} />
      </div>
    </div>
  );
};

export default ColorsPage;
