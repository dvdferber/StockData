const userInput = document.getElementById("text-stock");
const buttonEl = document.getElementById("send-button");
buttonEl.addEventListener("click", () => getDataFromAPI());
let dataDisplaydOlredy = false;

function getDataFromAPI() {
  const stockForSearch = createStringToUrl(userInput.value);

  const URL = `https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=US&symbols=${stockForSearch}`;
  let dataFromStorge = localStorage.getItem("ceshdata");
  dataFromStorge = JSON.parse(dataFromStorge);
  if (dataFromStorge && !userInput.value) {
    createTableUI(dataFromStorge, true);
  } else {
    fetch(URL, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "yh-finance.p.rapidapi.com",
        "x-rapidapi-key": "",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => createTableUI(data, false))
      .catch((err) => {
        console.error(err);
      });
  }
}
function createStringToUrl(userValue) {
  if (userValue == "") {
    userValue = "ADAP, MFA, BA, IMVT, KDP, ABNB, FRT";
  }
  //console.log(userValue);
  const withoutSpace = userValue.replace(/\s/g, "");
  return withoutSpace.replace(/,/g, "%2C").toUpperCase();
}
function createTableUI(respObj, fromCash) {
  if (dataDisplaydOlredy) return;
  const clearData = fromCash ? respObj : getClearData(respObj);
  console.log("==================================");
  //console.log(clearData);
  const loopCount = clearData.length;
  const tableBodyEl = document.getElementById("table-body");

  for (let i = 0; i < loopCount; i++) {
    let trEl = document.createElement("tr");

    let tdfullNameEl = document.createElement("td");
    let tdsymbolEl = document.createElement("td");
    let tdlongNameEl = document.createElement("td");
    let tdpostMarketPriceEl = document.createElement("td");
    let tdMarketPriceEl = document.createElement("td");
    let tdDayRangeEl = document.createElement("td");

    tdfullNameEl.innerText = clearData[i].fullName;
    tdsymbolEl.innerText = clearData[i].symbol;
    tdlongNameEl.innerText = clearData[i].longName;
    tdpostMarketPriceEl.innerText = clearData[i].postMarketPrice;
    tdMarketPriceEl.innerText = clearData[i].MarketPrice;
    tdDayRangeEl.innerText = clearData[i].DayRange;

    tdfullNameEl.id = i % 2 === 0 ? "even" : "odd";
    tdsymbolEl.id = i % 2 === 0 ? "even" : "odd";
    tdlongNameEl.id = i % 2 === 0 ? "even" : "odd";
    tdpostMarketPriceEl.id = i % 2 === 0 ? "even" : "odd";
    tdMarketPriceEl.id = i % 2 === 0 ? "even" : "odd";
    tdDayRangeEl.id = i % 2 === 0 ? "even" : "odd";

    trEl.appendChild(tdfullNameEl);
    trEl.appendChild(tdsymbolEl);
    trEl.appendChild(tdlongNameEl);
    trEl.appendChild(tdpostMarketPriceEl);
    trEl.appendChild(tdMarketPriceEl);
    trEl.appendChild(tdDayRangeEl);
    tableBodyEl.appendChild(trEl);
    dataDisplaydOlredy = true;
  }
}
function getClearData(respObj, fromCash) {
  const arrayData = respObj.quoteResponse.result;
  console.log(arrayData);
  const dataLength = arrayData.length;
  let tableArray = [];
  for (let i = 0; i < dataLength; i++) {
    const newJson = {
      postMarketChangePercent: arrayData[i].postMarketChangePercent,
      symbol: arrayData[i].symbol,
      fullName: arrayData[i].fullExchangeName,
      longName: arrayData[i].longName,
      MarketPrice: arrayData[i].regularMarketPrice,
      postMarketPrice: arrayData[i].postMarketPrice,
      DayRange: arrayData[i].regularMarketDayRange,
    };
    tableArray.push(newJson);
  }
  localStorage.setItem("ceshdata", JSON.stringify(tableArray));
  return tableArray;
}
