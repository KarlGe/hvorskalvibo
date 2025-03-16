const form = document.querySelector("form");
form.addEventListener("submit", submitForm, true);

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

function goTo(index) {
  console.log("Going to", index);
  document.getElementById("form").scrollTo(0, 0);
  document.body.style.setProperty("--offset-amount", `-${index * 100}vw`);
}

function setResponse(response) {
  const responseWrapper = document.querySelector("#selected-response p");
  responseWrapper.innerHTML = response;
}

const specificResponses = {
  rent: { responses: ["Øh å eie 0% av boligen din heter vanligvis å leie..."] },
};
const responses = [
  { range: [0, 20], responses: ["Ja deg vil vi ha! Velg og vrak!"] },
  {
    range: [20, 80],
    responses: [
      "Dette kan vi jobbe med, hva med et oppussingsprosjekt i et område regulert for industri? Litt støy 24/7 venner du deg fort til.",
    ],
  },
  {
    range: [80, 90],
    responses: [
      "I din situasjon tenker vi at du kan ha godt av å komme deg ut av byen. Oslo er overvurdert uansett.",
    ],
  },
  {
    range: [90, 150],
    responses: [
      "Vi har funnet den perfekte boligen til deg, det er bare 2 timer til og fra jobb, og toget går ca. 40% av de gangene det sier det skal",
    ],
  },
  {
    range: [150, 300],
    responses: [
      "Tror nok det er best du tar kontakt med de 15 beste vennene dine og håper på at dere kan finne en løsning.",
      "Se deg rundt, kanskje det er noen du kan flytte inn med?",
      "Du må da ha litt arv liggende et eller annet sted? Ta og gå igjennom familietreet før du fyller ut skjemaet på nytt",
      'Kanskje bolig ikke er helt din greie? Du kan finne mye fint <a href="https://www.finn.no/mobility/search/car/mobilehome">her</a>',
    ],
  },
  {
    range: [300, 1000],
    responses: [
      'Ha ha, veldig morsomt, <button class="link-style" onclick="goTo(0)">Prøv igjen.</button>',
    ],
  },
];

function getScore(key, value) {
  if (key.startsWith("luxuries_")) {
    return parseInt(value);
  }
  if (key === "parentFunding") {
    return (parseInt(value) / 200000) * -1;
  }
  if (key === "shareExpenses") {
    const shareExpenses = parseInt(value);
    if (shareExpenses < 2) {
      return 100;
    } else if (shareExpenses < 3) {
      return 50;
    } else {
      return (parseInt(value) - 3) * 50 * -1;
    }
  }
  if (key === "teenagersShareRoom") {
    return parseInt(value);
  }
  if (key === "kitchenmerged") {
    return parseInt(value);
  }
  if (key === "debtYears") {
    const debtYears = parseInt(value);
    if (debtYears < 30) {
      return 50;
    }
  }
  return 0;
}

function submitForm(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  let possibleResponses;
  var score = 0;
  for (var pair of formData.entries()) {
    const [key, value] = pair;
    if (key === "ownPercentage" && value === "0") {
      possibleResponses = specificResponses.rent.responses;
    }

    const scoreToAdd = getScore(key, value);
    if (scoreToAdd !== 0) {
      console.log(`Adding ${scoreToAdd} for ${key} - ${value}`);
      score += getScore(key, value);
    }
  }
  if (score < 0) {
    score = 0;
  }
  const ownPercentage = parseInt(formData.get("ownPercentage"));
  score = (score / 100) * ownPercentage;

  possibleResponses = responses.find((response) => {
    const [min, max] = response.range;
    return score >= min && score < max;
  }).responses;

  const visibleResponse =
    possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
  setResponse(visibleResponse);
  console.log(score);
  goTo(2);
}
