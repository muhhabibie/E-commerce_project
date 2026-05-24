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
      description: point.amount >= 0 ? `Cashback Pembelian di ${merchantName}` : `Penukaran di ${merchantName}`,
      amount: point.amount,
      date: point.created_at,
      merchant: merchantName,
      category: category,
    };
  });
};
