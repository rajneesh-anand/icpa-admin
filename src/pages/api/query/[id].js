import prisma from "@/libs/prisma";

export default async function handle(req, res) {
  try {
    const orderNumber = req.query.id;
    const { queryStatus } = req.body;

    await prisma.queries.update({
      where: { id: parseInt(orderNumber) },
      data: { status: queryStatus },
    });
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
}
