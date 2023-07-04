import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
      include: { billboard: true },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// for update
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!name) {
      return new NextResponse('Name is requried', { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse('Billboard Id is requried', { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const storebyUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storebyUserId) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    const category = await prismadb.category.updateMany({
      where: { id: params.categoryId },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

//for deleting
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }
    const storebyUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storebyUserId) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    const category = await prismadb.category.deleteMany({
      where: { id: params.categoryId },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
