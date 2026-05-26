import prisma from "../../database/prisma";
import checkUser from "../../shared/checkUser";
import comparePassword from "../../shared/comparePassword";
import bcrypt from "bcrypt";

export const createAccountService = async (email: string, password: string) => {
  const emailIsAvailable = await checkUser(email);

  if (emailIsAvailable) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginAccountService = async (email: string, password: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
};

export const getUserService = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const getUserPointsService = async (userId: string) => {
  const points = await prisma.points.findMany({
    where: {
      user_id: userId,
    },
  });


  return points;
};

export const getQoinTransactionsService = async (userId: string) => {
  const points = await prisma.points.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const orders = await prisma.selled_stocks.findMany({
    where: {
      user_id: userId,
    },
    include: {
      merchant: {
        select: {
          name: true,
          type: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return points.map((point) => {
    const matchingOrder = orders.find(
      (order) =>
        Math.abs(new Date(order.created_at).getTime() - new Date(point.created_at).getTime()) < 10000
    );

    const merchantName = matchingOrder?.merchant?.name || "Mitra UMKM";
    const category = matchingOrder?.merchant?.type || "Bonus";

    return {
      id: point.id,
      type: point.amount >= 0 ? "earning" : "spending",
      description: point.amount >= 0 ? `Cashback Pembelian di ${merchantName}` : `Penukaran Qoin di ${merchantName}`,
      amount: point.amount,
      date: point.created_at,
      merchant: merchantName,
      category: category,
    };
  });
};

export const redeemQoinService = async (userId: string, amount: number) => {
  // Ambil saldo terkini
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { total_point: true },
  });

  if (!user) throw new Error("User not found");
  if ((user.total_point ?? 0) < amount) {
    throw new Error(`Qoin tidak mencukupi. Saldo: ${user.total_point}, dibutuhkan: ${amount}`);
  }
  if (amount <= 0) throw new Error("Jumlah penukaran harus lebih dari 0");

  // Atomic: kurangi total_point + tambah balance + buat record points negatif
  const [updatedUser, pointRecord] = await prisma.$transaction([
    prisma.users.update({
      where: { id: userId },
      data: {
        total_point: { decrement: amount },
        balance: { increment: amount * 1000 },
      },
      select: { total_point: true, email: true, balance: true },
    }),
    prisma.points.create({
      data: {
        user_id: userId,
        amount: -amount, // negatif = pengeluaran
        expires_in: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: "used",
      },
    }),
  ]);

  return {
    remainingBalance: updatedUser.total_point,
    redeemedAmount: amount,
    equivalentRupiah: amount * 1000,
    pointRecord,
  };
};

export const topUpBalanceService = async (userId: string, amount: number) => {
  if (amount <= 0) throw new Error("Jumlah top-up harus lebih dari 0");

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      balance: {
        increment: amount,
      },
    },
    select: { id: true, email: true, balance: true },
  });

  return updatedUser;
};

