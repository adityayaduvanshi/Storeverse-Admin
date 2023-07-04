import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// for update
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!name) {
      return new NextResponse('Name is requried', { status: 400 });
    }
    if (!value) {
      return new NextResponse('Value is requried', { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    const storebyUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storebyUserId) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    const color = await prismadb.color.updateMany({
      where: { id: params.colorId },
      data: { name, value },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

//for deleting
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }
    const storebyUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });
    if (!storebyUserId) {
      return new NextResponse('Unauthorized', { status: 400 });
    }
    const color = await prismadb.color.deleteMany({
      where: { id: params.colorId },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
