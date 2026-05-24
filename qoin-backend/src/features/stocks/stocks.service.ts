import prisma from "../../database/prisma";

export const addStocksService = async (
  name: string,
  quantity: number,
  price: number,
  photo_url: string,
  merchant_id: string,
  description: string,
  user_id: string
) => {
  const stocks = await prisma.stocks.create({
    data: {
      name,
      quantity: Number(quantity),
      photo_url,
      merchant_id,
      user_id,
      price: Number(price),
      description,
    },
  });

  return stocks;
};

export const getStocksByMerchantIdService = async (merchant_id: string) => {
  const stocks = await prisma.stocks.findMany({
    where: {
      merchant_id,
    },
  });

  return stocks;
};

export const updateStocksService = async (
  stock_id: string,
  data: {
    name?: string;
    quantity?: number;
    price?: number;
    description?: string;
    is_displayed?: boolean;
  }
) => {
  const stocks = await prisma.stocks.update({
    where: {
      id: stock_id,
    },
    data,
  });

  return stocks;
};

export const deleteStocksService = async (stock_id: string) => {
  const stocks = await prisma.stocks.delete({
    where: {
      id: stock_id,
    },
  });

  return stocks;
};

export const deleteManyStocksService = async (stock_ids: string[]) => {
  const deleted = await prisma.stocks.deleteMany({
    where: {
      id: {
        in: stock_ids,
      },
    },
  });

  return deleted;
};

export type SelledStockItem = {
  id: string;
  quantity: number;
  price: number;
  merchant_id: string;
};

interface SelledStockServiceParams {
  paymentId: string;
  userId: string;
  items: SelledStockItem[];
}

export const selledStockService = async ({
  paymentId,
  userId,
  items,
}: SelledStockServiceParams) => {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      count: 0,
    };
  }
  const fixedPoints = 150;
  const payload = items.map((item) => ({
    payment_id: paymentId,
    user_id: userId,
    stock_id: item.id,
    quantity: item.quantity,
    merchant_id: item.merchant_id,
    total_price: item.quantity * item.price,
  }));

  const result = await prisma.$transaction(async (tx: any) => {
    // 1. Catat data stok yang terjual
    const created = await tx.selled_stocks.createMany({
      data: payload,
    });

    // 2. Kurangi kuantitas stok masing-masing barang secara async (HOF: items.map + Promise.all)
    await Promise.all(
      items.map(async (item) => {
        const currentStock = await tx.stocks.findUnique({
          where: { id: item.id },
        });

        if (!currentStock || currentStock.quantity < item.quantity) {
          throw new Error(`Kuantitas stok tidak mencukupi untuk barang: ${currentStock?.name || item.id}`);
        }

        await tx.stocks.update({
          where: { id: item.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      })
    );

    // 3. Catat riwayat perolehan poin baru
    await tx.points.create({
      data: {
        user_id: userId,
        amount: fixedPoints,
        expires_in: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // 4. Sinkronisasikan total poin user di tabel users
    await tx.users.update({
      where: { id: userId },
      data: {
        total_point: {
          increment: fixedPoints,
        },
      },
    });

    return created;
  });

  return result;
};

export const getUserTransactionsService = async (userId: string) => {
  const transactions = await prisma.selled_stocks.findMany({
    where: {
      user_id: userId,
    },
    include: {
      merchant: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return transactions;
};
