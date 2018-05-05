let express = require("express");

let app = express();

let fortune = require("./lib/fortune");

let handlebars = require("express3-handlebars").create({
  defaultLayout: "main"
});

if (app.thing == null) console.log("bleat!");

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);

app.use(express.static(`${__dirname}/public`));

// 检测是否加载测试
app.use((req, res, next) => {
  res.locals.showTests =
    app.get("env") !== "production" && req.query.test === "1";
  next();
});

// 路由
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", function(req, res) {
  res.render("about", {
    fortune: fortune.getFortune(),
    pageTestScript: "/qa/tests_about.js"
  });
});

app.get("/tours/hood-river", (req, res) => {
  res.render("tours/hood_river");
});

app.get("/tours/request-group-rate", (req, res) => {
  res.render("tours/request_group_rate");
});

// 定制404页面
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// 定制500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log(
    `Express started on http://localhost:${app.get(
      "port"
    )}; press Ctrl-C to terminate`
  );
});
