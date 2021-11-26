import prisma from "../../../libs/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const id = req.query.id;
      try {
        const course = await prisma.products.findUnique({
          where: {
            id: Number(id),
          },
        });

        res.status(200).json({
          msg: "success",
          data: course,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      } finally {
        async () => {
          await prisma.$disconnect();
        };
      }
      break;

    default:
      res.status(405).end();
      break;
  }
}
