import Xray from "x-ray";
import fs from "fs/promises";
import csvWriter from "csv-writer";
import path from "path";

const x = Xray();
const createCsvWriter = csvWriter.createObjectCsvWriter;

const listUrl = [
  "https://www.at-parking.jp/search/hokkaido/",
  "https://www.at-parking.jp/search/aomori/",
  "https://www.at-parking.jp/search/akita/",
  "https://www.at-parking.jp/search/iwate/",
  "https://www.at-parking.jp/search/yamagata/",
  "https://www.at-parking.jp/search/miyagi/",
  "https://www.at-parking.jp/search/fukushima/",
  "https://www.at-parking.jp/search/niigata/",
  "https://www.at-parking.jp/search/fukui/",
  "https://www.at-parking.jp/search/toyama/",
  "https://www.at-parking.jp/search/yamanashi/",
  "https://www.at-parking.jp/search/ishikawa/",
  "https://www.at-parking.jp/search/nagano/",
  "https://www.at-parking.jp/search/shiga/",
  "https://www.at-parking.jp/search/osaka/",
  "https://www.at-parking.jp/search/kyoto/",
  "https://www.at-parking.jp/search/hyogo/",
  "https://www.at-parking.jp/search/nara/",
  "https://www.at-parking.jp/search/wakayama/",
  "https://www.at-parking.jp/search/tottori/",
  "https://www.at-parking.jp/search/okayama/",
  "https://www.at-parking.jp/search/shimane/",
  "https://www.at-parking.jp/search/hiroshima/",
  "https://www.at-parking.jp/search/yamaguchi/",
  "https://www.at-parking.jp/search/oita/",
  "https://www.at-parking.jp/search/fukuoka/",
  "https://www.at-parking.jp/search/saga/",
  "https://www.at-parking.jp/search/nagasaki/",
  "https://www.at-parking.jp/search/kumamoto/",
  "https://www.at-parking.jp/search/miyazaki/",
  "https://www.at-parking.jp/search/kagoshima/",
  "https://www.at-parking.jp/search/okinawa/",
  "https://www.at-parking.jp/search/kagawa/",
  "https://www.at-parking.jp/search/tokushima/",
  "https://www.at-parking.jp/search/ehime/",
  "https://www.at-parking.jp/search/kochi/",
  "https://www.at-parking.jp/search/gifu/",
  "https://www.at-parking.jp/search/aichi/",
  "https://www.at-parking.jp/search/shizuoka/",
  "https://www.at-parking.jp/search/mie/",
  "https://www.at-parking.jp/search/gunma/",
  "https://www.at-parking.jp/search/saitama/",
  "https://www.at-parking.jp/search/tochigi/",
  "https://www.at-parking.jp/search/chiba/",
  "https://www.at-parking.jp/search/ibaraki/",
  "https://www.at-parking.jp/search/tokyo/",
  "https://www.at-parking.jp/search/kanagawa/",
];

const crawlingData = async (url) => {
  let data = [];
  try {
    const scrapedData = await x(url, "span .clrBlue", [
      {
        link: "a @href",
        title: "",
      },
    ]);

    await Promise.all(
      scrapedData.map(async (e) => {
        const 市区名 = e.title
          .replaceAll("\t", "")
          .replaceAll("\n", "")
          .split("（")[0];

        const scrapedChildData = await x(e.link, "span .clrBlue", [
          {
            link: "a @href",
            title: "",
          },
        ]);

        scrapedChildData.map((i) => {
          let 町村名 = i.title
            .replaceAll("\t", "")
            .replaceAll("\n", "")
            .split("）")[0];

          if (i.title.split("）").length - 1) 町村名 += "）";

          const 件数 =
            i.title
              .replaceAll("\t", "")
              .replaceAll("\n", "")
              .split("")
              .filter((i) => !!Number(i))
              .join() + "件";

          data = [
            ...data,
            {
              市区名,
              町村名,
              件数,
            },
          ];
        });
      })
    );
    console.log(data);
    return {
      city: url.split("https://www.at-parking.jp/search/")[1].split("/")[0],
      data,
    };
  } catch (err) {
    console.error(err);
  }
};

async function main() {
  try {
    const res = await Promise.all(listUrl.map((url) => crawlingData(url)));
    await Promise.all(
      res.map(async ({ city, data }) => {
        fs.writeFile(`./json/${city}.json`, JSON.stringify(data));
      })
    );

    res.map(async ({ city }) => {
      const file = await fs.readFile(`./json/${city}.json`, "utf-8");
      const jsonData = JSON.parse(file);
      const header = Object.keys(jsonData[0]).map((k) => {
        return {
          id: k,
          title: k,
        };
      });
      const csvWriter = createCsvWriter({
        path: `csv/${city}.csv`,
        header,
      });
      csvWriter.writeRecords(jsonData).then(() => {
        console.log(`Done writing CSV file for ${city}`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

main();
