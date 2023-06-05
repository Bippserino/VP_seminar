let months = ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj"];
let byMonth2021, byMonth2022;
let byManufacturer2021, byManufacturer2022;
let manufacturers = [];
let isTotalDrawn = false;

const byMonthSelect = document.querySelector(".by-month-select select");
const byManufacturerSelect1 = document.querySelector(
  ".by-manufacturer-select-1 select"
);
const byManufacturerSelect2 = document.querySelector(
  ".by-manufacturer-select-2 select"
);
const byModelGraph = document.querySelector(".by-model-graph");
const byManufacturerGraph = document.querySelector(".by-manufacturer-graph");
const yearSaleGraph = document.querySelector(".year-sale-graph");

var totalMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  totalWidth = yearSaleGraph.offsetWidth - totalMargin.left - totalMargin.right,
  totalHeight =
    yearSaleGraph.offsetHeight - totalMargin.top - totalMargin.bottom;

var modelMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  modelWidth = byModelGraph.offsetWidth - modelMargin.left - modelMargin.right,
  manufacturerHeight =
    byModelGraph.offsetHeight - modelMargin.top - modelMargin.bottom;

var manufacturerMargin = { top: 10, right: 30, bottom: 30, left: 60 },
  manufacturerWidth =
    byManufacturerGraph.offsetWidth -
    manufacturerMargin.left -
    manufacturerMargin.right,
  manufacturerHeight =
    byManufacturerGraph.offsetHeight -
    manufacturerMargin.top -
    manufacturerMargin.bottom;

var totalSvg = d3
  .select(".year-sale-graph")
  .append("svg")
  .attr("width", totalWidth + totalMargin.left + totalMargin.right)
  .attr("height", totalHeight + totalMargin.top + totalMargin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + totalMargin.left + "," + totalMargin.top + ")"
  );

var modelSvg = d3
  .select(".by-model-graph")
  .append("svg")
  .attr("width", modelWidth + modelMargin.left + modelMargin.right)
  .attr("height", manufacturerHeight + modelMargin.top + modelMargin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + modelMargin.left + "," + modelMargin.top + ")"
  );

var manufacturerSvg = d3
  .select(".by-manufacturer-graph")
  .append("svg")
  .attr(
    "width",
    manufacturerWidth + manufacturerMargin.left + manufacturerMargin.right
  )
  .attr(
    "height",
    manufacturerHeight + manufacturerMargin.top + manufacturerMargin.bottom
  )
  .append("g")
  .attr(
    "transform",
    "translate(" + manufacturerMargin.left + "," + manufacturerMargin.top + ")"
  );

const calculateTotalSoldByMonth = (data) => {
  let yearTotal = [];
  data.forEach((element) => {
    let total = 0;
    element.prodaja.forEach((e) => {
      total += e.broj_prodanih;
    });
    yearTotal.push(total);
  });
  return yearTotal;
};

const getManufacturersList = () => {
  // Returns array of arrays of manufacturers for years 2021 and 2022 as  [manufacturers2021, manufacturers2022]
  let manufacturers2021 = {};
  let manufacturers2022 = {};

  year2021.forEach((item) => {
    item.prodaja.forEach((man) => {
      if (!manufacturers2021[man.marka]) {
        manufacturers2021[man.marka] = {};
      }
      manufacturers2021[man.marka][item.mjesec] = man.broj_prodanih;
      if (!manufacturers.includes(man.marka)) manufacturers.push(man.marka);
    });
  });

  year2022.forEach((item) => {
    item.prodaja.forEach((man) => {
      if (!manufacturers2022[man.marka]) {
        manufacturers2022[man.marka] = {};
      }
      manufacturers2022[man.marka][item.mjesec] = man.broj_prodanih;
      if (!manufacturers.includes(man.marka)) manufacturers.push(man.marka);
    });
  });

  return [manufacturers2021, manufacturers2022];
};

const addToManufacturerSelect = (list) => {
  let selectHTML = "";
  list.forEach((item) => {
    selectHTML += `<option value="${item}">${item}</option>`;
  });
  byManufacturerSelect1.innerHTML = selectHTML;
  byManufacturerSelect2.innerHTML = selectHTML;
};

const drawTotalChart = (data) => {
  let dataset = [];
  for (let i = 0; i < data.length; i++) {
    dataset.push({ month: months[i], data: data[i] });
  }

  var xScale = d3.scaleBand().domain(months).range([0, totalWidth]);
  var yScale = d3
    .scaleLinear()
    .domain([0, Math.max(...data)])
    .range([totalHeight, 0]);

  const line = d3
    .line()
    .x((d) => xScale(d.month))
    .y((d) => yScale(d.data));

  totalSvg
    .append("path")
    .datum(dataset)
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", isTotalDrawn === false ? "steelblue" : "red")
    .attr("stroke-width", 2)
    .attr(
      "transform",
      "translate(" + xScale("Veljača") / 2 + "," + totalMargin.top + ")"
    );

  if (!isTotalDrawn) {
    var g = totalSvg.append("g");

    g.append("g")
      .attr("transform", "translate(0," + totalHeight + ")")
      .call(d3.axisBottom(xScale));

    g.append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end");

    var legend = totalSvg.append("g");

    legend
      .append("circle")
      .attr("cx", totalWidth - 100)
      .attr("cy", totalHeight - 50)
      .attr("r", 6)
      .style("fill", "steelblue");
    legend
      .append("circle")
      .attr("cx", totalWidth - 100)
      .attr("cy", totalHeight - 75)
      .attr("r", 6)
      .style("fill", "red");
    legend
      .append("text")
      .attr("x", totalWidth - 90)
      .attr("y", totalHeight - 50)
      .text("2022. godina")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    legend
      .append("text")
      .attr("x", totalWidth - 90)
      .attr("y", totalHeight - 75)
      .text("2021. godina")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    isTotalDrawn = true;
  }
};

const drawModelChart = (month) => {
  modelSvg.selectAll("*").remove();
  var outerRadius = modelWidth / 5;
  var innerRadius = 0;

  var arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
  let index = months.findIndex((item) => item.toLowerCase() === month);
  var color = [
    "#4e79a7",
    "#f28e2c",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc949",
    "#af7aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ab",
  ];
  var pie = d3.pie().value(function (d) {
    return d.broj_prodanih;
  });

  var pieArcs = modelSvg
    .selectAll("g.pie")
    .data(pie(year2022[index].modeli))
    .enter()
    .append("g")
    .attr("class", "model-pie")
    .attr(
      "transform",
      "translate(" + modelWidth / 2 + ", " + manufacturerHeight / 2 + ")"
    );

  pieArcs
    .append("path")
    .attr("fill", function (d, i) {
      return color[i];
    })
    .attr("data-model", function (d, i) {
      return d.data.model;
    })
    .attr("data-number", function (d, i) {
      return d.data.broj_prodanih;
    })
    .attr("d", arc);

  document.querySelector(".model-legend-items").innerHTML = "";
  year2022[index].modeli.forEach((m, index) => {
    document.querySelector(
      ".model-legend-items"
    ).innerHTML += ` <div class="model-legend-item">
        <div class="model-legend-color" style="background-color: ${color[index]};"></div>
        <div class="model-legend-model">${m.model}</div>
      </div>`;
  });

  document.querySelectorAll(".model-pie").forEach((item) => {
    item.addEventListener("mouseover", onModelMouseOver);
    item.addEventListener("mouseleave", onModelLeave);
  });
};

const onModelMouseOver = (e) => {
  let modelStats = document.querySelector(".model-stats");
  var rect = byModelGraph.getBoundingClientRect();
  var x = Math.abs(e.clientX - rect.left);
  var y = Math.abs(e.clientY - rect.bottom);

  modelStats.innerHTML =
    e.target.__data__.data.model + " " + e.target.__data__.data.broj_prodanih;
  modelStats.style.left = x + "px";
  modelStats.style.bottom = y + "px";
  modelStats.style.visibility = "visible";
};

const onModelLeave = (e) => {
  let modelStats = document.querySelector(".model-stats");
  modelStats.style.visibility = "hidden";
};

const drawManufacturerChart = (data1, data2) => {
  manufacturerSvg.selectAll("*").remove();

  const d1 = { months: Object.keys(data1), values: Object.values(data1) };
  const d2 = { months: Object.keys(data2), values: Object.values(data2) };

  var xScale1 = d3
    .scaleBand()
    .domain(d3.range(d1.months.length))
    .range([0, manufacturerWidth]);

  var yScale1 = d3
    .scaleLinear()
    .domain([0, d3.max([...d1.values, ...d2.values])])
    .range([manufacturerHeight, 0]);

  var yScale2 = d3
    .scaleLinear()
    .domain([0, d3.max([...d1.values, ...d2.values])])
    .range([manufacturerHeight, 0]);

  var xAxis1 = d3.axisBottom(xScale1).tickFormat((i) => d1.months[i]);
  var yAxis1 = d3.axisLeft(yScale1);

  xScale1 = d3.scaleBand().domain(d1.months).range([0, manufacturerWidth]);

  xScale2 = d3.scaleBand().domain(d1.months).range([0, manufacturerWidth]);

  var g = manufacturerSvg.append("g");

  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${manufacturerHeight})`)
    .call(xAxis1)
    .selectAll("text")
    .style("text-anchor", "middle")
    .style("text-transform", "capitalize");

  g.append("g").call(yAxis1);

  // Transparent

  manufacturerSvg
    .selectAll("bar")
    .data(d2.values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return xScale1(d1.months[i]) + xScale1.bandwidth() / 2;
    })
    .attr("y", 0)
    .attr("width", xScale1.bandwidth() / 3)
    .attr("height", manufacturerHeight)
    .attr("fill", "white")
    .attr("data-value", (d) => d)
    .attr("data-manufacturer", byManufacturerSelect2.value);

  manufacturerSvg
    .selectAll("bar")
    .data(d1.values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return (
        xScale1(d1.months[i]) +
        xScale1.bandwidth() / 2 -
        xScale1.bandwidth() / 3
      );
    })
    .attr("y", 0)
    .attr("width", xScale1.bandwidth() / 3)
    .attr("height", manufacturerHeight)
    .attr("fill", "white")
    .attr("data-value", (d) => d)
    .attr("data-manufacturer", byManufacturerSelect1.value);

  // Visible
  manufacturerSvg
    .selectAll("bar")
    .data(d1.values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return (
        xScale1(d1.months[i]) +
        xScale1.bandwidth() / 2 -
        xScale1.bandwidth() / 3
      );
    })
    .attr("y", function (d) {
      return yScale1(d);
    })
    .attr("width", xScale1.bandwidth() / 3)
    .attr("height", function (d) {
      return manufacturerHeight - yScale1(d);
    })
    .attr("fill", "steelblue")
    .attr("data-value", (d) => d)
    .attr("data-manufacturer", byManufacturerSelect1.value);

  manufacturerSvg
    .selectAll("bar")
    .data(d2.values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return xScale1(d1.months[i]) + xScale1.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return yScale2(d);
    })
    .attr("width", xScale1.bandwidth() / 3)
    .attr("height", function (d) {
      return manufacturerHeight - yScale2(d);
    })
    .attr("fill", "red")
    .attr("data-value", (d) => d)
    .attr("data-manufacturer", byManufacturerSelect2.value);

  document.querySelectorAll(".bar").forEach((item) => {
    item.addEventListener("mouseover", onManufacturerMouseOver);
    item.addEventListener("mouseleave", onManufacturerLeave);
  });
};

const onManufacturerMouseOver = (e) => {
  let modelStats = document.querySelector(".manufacturer-stats");
  var rect = byManufacturerGraph.getBoundingClientRect();
  var x = Math.abs(e.clientX - rect.left);
  var y = Math.abs(e.clientY - rect.bottom);
  modelStats.innerHTML =
    e.target.dataset.manufacturer + " " + e.target.dataset.value;

  modelStats.style.left = x + "px";
  modelStats.style.bottom = y + "px";
  modelStats.style.visibility = "visible";
};

const onManufacturerLeave = (e) => {
  let modelStats = document.querySelector(".manufacturer-stats");
  modelStats.style.visibility = "hidden";
};

const optionSelector = () => {
  let option1 = byManufacturerSelect1.value;
  let option2 = byManufacturerSelect2.value;

  if (option1 === option2) {
    drawManufacturerChart(
      byManufacturer2021[byManufacturerSelect1.value],
      byManufacturer2022[byManufacturerSelect2.value]
    );
  } else {
    drawManufacturerChart(
      byManufacturer2022[byManufacturerSelect1.value],
      byManufacturer2022[byManufacturerSelect2.value]
    );
  }
};
// -----------------------------------------------------------------------------

byMonth2021 = calculateTotalSoldByMonth(year2021);
byMonth2022 = calculateTotalSoldByMonth(year2022);
[byManufacturer2021, byManufacturer2022] = getManufacturersList();

drawTotalChart(byMonth2021);
drawTotalChart(byMonth2022);
drawModelChart("siječanj");

addToManufacturerSelect(manufacturers);
drawManufacturerChart(
  byManufacturer2021[byManufacturerSelect1.value],
  byManufacturer2022[byManufacturerSelect2.value]
);
document.querySelector(".logo1 img").src = `./img/${byManufacturerSelect1.value}.png`
document.querySelector(".logo2  img").src = `./img/${byManufacturerSelect2.value}.png`

byMonthSelect.onchange = () => {
  drawModelChart(byMonthSelect.value);
};
byManufacturerSelect1.onchange = () => {
  optionSelector();
  document.querySelector(".logo1 img").src = `./img/${byManufacturerSelect1.value}.png`
};

byManufacturerSelect2.onchange = () => {
  optionSelector();
  document.querySelector(".logo2 img").src = `./img/${byManufacturerSelect2.value}.png`
};
