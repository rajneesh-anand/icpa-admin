import prisma from "@/libs/prisma";

export default async function handler(req, res) {
  const curPage = req.query.page || 1;
  const perPage = req.query.limit || 50;

  try {
    const product = await prisma.coursemedia.findMany({
      take: perPage * curPage,
      include: {
        course: {
          select: { courseName: true },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    console.log(product);
    const totalProducts = product.length;

    res.status(200).json({
      msg: "success",
      data: product,
      curPage: curPage,
      maxPage: Math.ceil(totalProducts / perPage),
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
