import prisma from "../database/prisma";

const checkUser = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export default checkUser;
