import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDataByParams = async (req, res, next) => {
  const { city, cityName } = req.query;
  let data;

  if (!cityName) {
    data = await prisma.city.findMany({
      where: {
        name: city,
      },
    });
  } else {
    data =
      await prisma.$queryRaw`select * from city as ct inner join CitiInfo as ct_info 
        where ct.id = ct_info.city_id
        and ct.name = ${city} and ct_info.city_name = ${cityName}`;
  }

  res.status(200).send(data);
};
