import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDataByParams = async (req, res, next) => {
    const { city, cityName } = req.params
    let data = await prisma.city.findMany({
        where: {
            city: {
                equals: city,
                mode: 'insensitive',
            },
        },
        include: {
            cityName: {
                where: {
                    ...(cityName ? { cityName: cityName } : {}),
                },
            },
        },
    })
    if (cityName) data = data.map(({ city, ...rest }) => rest)
    res.status(200).send(data)
}