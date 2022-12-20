const Bree = require("bree");
const bree = new Bree({ jobs: ["crawl"], interval: "1m" });

bree.start().then(() => {
  console.log("Crawling job started");
});
