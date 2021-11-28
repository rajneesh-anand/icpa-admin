import prisma from "@/libs/prisma";

export default async function handler(req, res) {
  try {
    const users = await prisma.user.findMany({
      where: {
        userType: "Admin",
      },
    });
    console.log(users);

    res.status(200).json({
      msg: "success",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
