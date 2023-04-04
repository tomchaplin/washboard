import "./style.css";
import { setupCanvas } from "./washboard";
import { recurseData } from "./recurse_data";

const charts = [
  {
    id: "kernel",
    title: "Kernel",
  },
  {
    id: "relative",
    title: "Relative",
  },
  {
    id: "cokernel",
    title: "Cokernel",
  },
  {
    id: "domain",
    title: "Domain",
  },
  {
    id: "image",
    title: "Image",
  },
  {
    id: "codomain",
    title: "Codomain",
  },
];

const buildChart = (chart_data) => `
    <div class="chart_container">
      <canvas id="${chart_data["id"]}Chart"></canvas>
    </div>
`;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="full_screen">
  <div class="six_pack_holder">
  ${charts.map(buildChart).join("\n")}
  </div>
</div>
`;

function getOptions() {
  const usp = new URLSearchParams(window.location.search);
  return {
    recursive: usp.has("recursive") ? usp.get("recursive") == "true" : false,
  };
}

const options = getOptions();

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    if (options.recursive) {
      data = recurseData(data);
    }
    charts.forEach((chart, chart_idx) => {
      chart.handle = setupCanvas(chart_idx, charts, data);
    });
    document.querySelector<HTMLParagraphElement>("#init")?.remove();
  });
