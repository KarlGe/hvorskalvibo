function goTo(index) {
  console.log("Going to", index);
  document.getElementById('form').scrollTo(0, 0);
  document.body.style.setProperty("--offset-amount", `-${index * 100}vw`);
}

function submitForm(event) {
  event.preventDefault();
  goTo(2);
}

const form = document.querySelector("form");
form.addEventListener("submit", submitForm, true);

const responses = document.querySelectorAll("#response p");
const visibleResponse = responses[Math.floor(Math.random() * responses.length)];
const selectedContainer = document.getElementById("selected-response");
visibleResponse.classList.add("selected-response");
selectedContainer.appendChild(visibleResponse.cloneNode(true));

const rangeInputs = document.querySelectorAll('input[type="range"]');
rangeInputs.forEach((rangeInput) => {
  const rangeValue = document.createElement("div");
  rangeValue.classList.add("range-value");
  const suffix = rangeInput.getAttribute("data-suffix") || "";
  rangeValue.textContent = parseInt(rangeInput.value).toLocaleString() + suffix;
  rangeInput.insertAdjacentElement("beforebegin", rangeValue);
  rangeInput.addEventListener("input", (e) => {
    rangeValue.textContent = parseInt(e.target.value).toLocaleString() + suffix;
  });
});
