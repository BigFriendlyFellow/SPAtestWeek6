import html from "html-literal";

//  Add the Kelvin converter
const kelvinToFahrenheit = kelvinTemp =>
  Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);

export default st => html`
  <h3>
    Temperature in ${st.weather.city} is
    ${kelvinToFahrenheit(st.weather.temp)}F. It feels like
    ${kelvinToFahrenheit(st.weather.feelsLike)}F.
  </h3>

  <section id="jumbotron">
    <h2>Savvy Coders November 2021 Cohort</h2>
    <a href="" onClick="alert('Hello! You clicked button!')"
      >"Call to Action" "Button"</a
    >
  </section>
`;
