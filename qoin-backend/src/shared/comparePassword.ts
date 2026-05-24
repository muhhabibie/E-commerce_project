import bcrypt from "bcrypt";

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

export default comparePassword;
