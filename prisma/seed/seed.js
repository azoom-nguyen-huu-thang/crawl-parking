const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs/promises");

const prisma = new PrismaClient();

async function readFiles() {
  const cityMap = new Map();
  const appDir = process.env.PWD;
  const dirPath = path.join(appDir, "json");
  const files = await fs.readdir(dirPath);

  const getFileInfo = files.map(async (file) => {
    const fileName = file.split(".")[0];
    const info = await fs.readFile(path.join(dirPath, file));
    const infoParse = JSON.parse(info.toString());
    cityMap.set(fileName, infoParse);
  });

  await Promise.all(getFileInfo);
  return cityMap;
}

async function main() {
  const cityMap = await readFiles();

  cityMap.forEach(async (info, city) => {
    console.log(city);
    await prisma.city.create({
      data: {
        name: city,
        citiInfo: {
          createMany: {
            data: info.map((item) => ({
              cityName: item["市区名"],
              townName: item["町村名"],
              count: item["件数"],
            })),
          },
        },
      },
    });
  });
}

main()
  .then(async () => {
    console.log("Seeding successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
