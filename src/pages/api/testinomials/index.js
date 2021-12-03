import prisma from "@/libs/prisma";

export default async function handler(req, res) {
  try {
    const product = await prisma.testinomials.findMany({
      orderBy: [
        {
          id: "asc",
        },
      ],
    });

    res.status(200).json({
      data: product,
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
