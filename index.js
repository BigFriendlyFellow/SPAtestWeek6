import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = new Navigo(window.location.origin);

// move router to the end and add router.hooks

function render(st) {
  document.querySelector("#root").innerHTML = `
    ${Header(st)}
    ${Nav(state.Links)}
    ${Main(st)}
    ${Footer()}
  `;
  router.updatePageLinks();
  addEventListeners(st);
}

function addEventListeners(st) {
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(state[event.target.title]);
    })
  );

  // add menu toggle to bars icon in nav bar
  // when you click hamburger, this function makes the menu come down
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );
}

router.hooks({
  before: (done, params) => {
    const page =
      params && params.hasOwnProperty("page")
        ? capitalize(params.page)
        : "Home";

    if (page === "Home") {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?appid=fbb30b5d6cf8e164ed522e5082b49064&q=st.%20louis`
        )
        .then(response => {
          state.Home.weather = {};
          state.Home.weather.city = response.data.name;
          state.Home.weather.temp = response.data.main.temp;
          state.Home.weather.feelsLike = response.data.main.feels_like;
          state.Home.weather.description = response.data.weather[0].main;
          done();
        })
        .catch(err => console.log(err));
    }

    if (page === "Pizza") {
      axios
        .get(`${process.env.PIZZA_PLACE_API_URL}`)
        .then(response => {
          state.Pizza.pizzas = response.data;
          done();
        })
        .catch(error => {
          console.log("It puked", error);
        });
    }
  }
});

// router at bottom
router
  .on({
    "/": () => render(state.Home),
    ":page": params => {
      let page = capitalize(params.page);
      render(state[page]);
    }
  })
  .resolve();

//   Order matters in the root index.js file. Here's a guide:
// Import statements
// Import statements should always be at the top of your index.js file. These tell the code page what files and packages will be used. Without them being labeled at the top of the file, the code page will not know how to use all of this data.

// Declaring router
// Router is used to map all of the code logic to the location. Without this line of code your project will not be able to appropriately load the necessary data.

// Render function
// The render function tells your project to compile all of the files inside the components folder. In addition, the router function is called inside this function block to update the page links. The final piece inside this function block is a function for the Navigation Menu.

// Event Handler function
// This function should identify an event then give instructions. This will use the render function to upload the necessary page in the navigation menu

// Router.hooks
// This function holds instructions for updating information from an API. An if statement is given for a certain view (from the views folder) followed by an axios.get statement. This is then followed by an axios.then statement in which directions are given about which pieces of this data to collect.

// Router.on
// This is the function that executes the axios statements. This will only run correctly if given instructions on what to execute. It is for this reason that this function must follow the instructions laid out in the router.hooks function.
