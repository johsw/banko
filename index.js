const totalNumbers = 15;
const minNumber = 1;
const maxNumber = 90;
const maxPerInterval = 2;
const numbers = [];
const intervals = [];

const noRows = 3;
const noCols = 9;

let rows = [];
const rowCounts = [];

let layouts;

function isValid(number) {
  if (numbers.indexOf(number) > -1) {
    return false;
  }
  const interval = Math.floor((number - 1) / 10);
  if (intervals[interval] && intervals[interval].length >= maxPerInterval) {
    return false;
  }
  if (!intervals[interval]) {
    intervals[interval] = [];
  }
  intervals[interval].push(number);

  return true;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function setNumbers() {
  // one in each interval
  console.log("start");

  for (n = 0; n < Math.ceil(maxNumber / 10); n++) {
    const min = n * 10;
    let max = min + 9;
    if (max === 89) {
      max = 90;
    }

    const number = getRandomInt(min, max);
    if (!intervals[n]) {
      intervals[n] = [];
    }
    intervals[n].push(number);
    numbers.push(number);
  }

  // and then random
  while (numbers.length < totalNumbers) {
    const shot = Math.floor(Math.random() * maxNumber) + 1;
    if (isValid(shot)) {
      numbers.push(shot);
    }
  }
  console.log(numbers.sort((a, b) => a - b));
}

function setTable() {
  intervals.forEach((interval) => {
    if (interval.length == 1) {
      rows[0].push(0);
      rows[1].push(interval[0]);
      rows[2].push(0);
    } else if (interval.length == 2) {
      const layoutIndex = Math.floor(Math.random() * layouts.length);
      const layout = layouts[layoutIndex];
      layouts.splice(layoutIndex, 1);
      interval = interval.sort((a, b) => a - b);
      switch (layout) {
        case "top":
          rows[0].push(interval[0]);
          rows[1].push(interval[1]);
          rows[2].push(0);
          break;
        case "split":
          rows[0].push(interval[0]);
          rows[1].push(0);
          rows[2].push(interval[1]);
          break;
        case "bottom":
          rows[0].push(0);
          rows[1].push(interval[0]);
          rows[2].push(interval[1]);
          break;
      }
    }
  });
  console.log(rows);
}

function setValueInRow() {
  let selectedIndex = 0;
  let min = 4;
  rowCounts.forEach((val, index) => {
    if (val < min) {
      selectedIndex = index;
      min = val;
    }
  });
  return selectedIndex;
}
function createDomEls() {
  const table = document.getElementById("table");
  rows.forEach((row, index) => {
    const rowEl = document.createElement("div");
    rowEl.classList.add("row");
    rowEl.classList.add("row-" + index);
    table.appendChild(rowEl);
    row.forEach((val) => {
      const celEl = document.createElement("div");
      celEl.classList.add("cell");

      rowEl.appendChild(celEl);
      if (val) {
        const numberEl = document.createElement("div");
        numberEl.classList.add("val");
        celEl.appendChild(numberEl);
        numberEl.innerText = val;
        console.log(numberEl);
        numberEl.addEventListener("click", (event) => {
          console.log("asdasd");
          numberEl.classList.toggle("active");
        });
      } else {
        celEl.classList.add("cell-empty");
      }
    });
  });
}
function setHash() {
  const hash = window.btoa(JSON.stringify(rows));

  const url = window.location.href.split("#")[0];

  const urlField = document.getElementById("url-field");

  console.log(urlField);
  urlField.value = url + "#" + hash;
}
function parseHash(hash) {
  return JSON.parse(window.atob(location.hash.replace("#", "")));
}
function main() {
  layouts = ["top", "bottom", "split", "split", "split", "split"];
  for (n = 0; n < noRows; n++) {
    rows[n] = [];
    rowCounts[n] = 0;
  }

  if (location.hash) {
    rows = parseHash(location.hash);
  } else {
    setNumbers();
    setTable();
  }
  createDomEls();
  setHash();
}
function setup() {
  main();
  document.getElementById("new").addEventListener("click", () => {
    location.hash = "";
    document.getElementById("table").innerHTML = "";
    rows.splice(0, rows.length);
    intervals.splice(0, intervals.length);
    numbers.splice(0, numbers.length);

    main();
  });
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    setup();
  },
  false
);
