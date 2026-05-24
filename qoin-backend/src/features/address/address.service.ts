import prisma from "../../database/prisma";

interface AddressData {
  name: string;
  recipient: string;
  phone: string;
  address: string;
  is_primary?: boolean;
}

export const getUserAddressesService = async (userId: string) => {
  return await prisma.user_addresses.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      is_primary: "desc", // primary address always first
    },
  });
};

export const getPrimaryAddressService = async (userId: string) => {
  return await prisma.user_addresses.findFirst({
    where: {
      user_id: userId,
      is_primary: true,
    },
  });
};

export const saveUserAddressService = async (userId: string, data: AddressData) => {
  // Check if it's the first address
  const existingAddresses = await prisma.user_addresses.count({
    where: { user_id: userId },
  });

  const isPrimary = existingAddresses === 0 ? true : (data.is_primary ?? true);

  if (isPrimary) {
    // Set all other addresses for this user to not primary
    await prisma.user_addresses.updateMany({
      where: { user_id: userId },
      data: { is_primary: false },
    });
  }

  // Create new address (for simplicity, we always create a new one as primary for now,
  // or we could update an existing one if ID is provided. Let's just create.)
  return await prisma.user_addresses.create({
    data: {
      user_id: userId,
      name: data.name,
      recipient: data.recipient,
      phone: data.phone,
      address: data.address,
      is_primary: isPrimary,
    },
  });
};
