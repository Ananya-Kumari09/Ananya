const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let option = document.createElement("option");
    option.innerText = currcode;
    option.value = currcode;

    if (select.name === "from" && currcode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currcode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });

  updateFlag(select);
}

// Flag update function
function updateFlag(element) {
  let currcode = element.value;
  let countryCode = countryList[currcode];
  let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newsrc;
  }
}

// Get exchange rate on button click
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector("#amountinput");
  let amtvalue = parseFloat(amount.value);

  if (isNaN(amtvalue) || amtvalue < 1) {
    amtvalue = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value.toUpperCase()}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    let rate = data.rates[toCurr.value.toUpperCase()];

    if (!rate) {
      msg.innerText = "Conversion rate not found.";
      return;
    }

    let finalAmount = amtvalue * rate;
    msg.innerText = `${amtvalue} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
});
