import prisma from "@/libs/prisma";

export default async function handler(req, res) {
  const query = req.query;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const totalCount = await prisma.queries.count();

  try {
    const product = await prisma.queries.findMany({
      take: limit,
      skip: startIndex,
    });

    res.status(200).json({
      msg: "success",
      data: product,
      maxPage: Math.ceil(totalCount / limit),
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
