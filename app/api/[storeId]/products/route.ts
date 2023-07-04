import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// for creating products
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isArchived,
      isFeatured,
      description,
    } = body;
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!name) {
      return new NextResponse('Name is requried', { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse('Image is requried', { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse('Category Id is requried', { status: 400 });
    }
    if (!colorId) {
      return new NextResponse('Color id is requried', { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse('Size id requried', { status: 400 });
    }
    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    const storebyUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storebyUserId) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
        description: description,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        sizeId,
        isArchived: false,
      },
      include: { images: true, color: true, category: true, size: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
