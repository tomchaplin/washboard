import "./style.css";
import { setupCanvas, ChartManifest, PhimakerData } from "./washboard";

const charts: ChartManifest[] = [
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

const buildChart = (chart_data: ChartManifest) => `
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

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    charts.forEach((chart, chart_idx) => {
      chart.handle = setupCanvas(chart_idx, charts, data);
    });
    document.querySelector<HTMLParagraphElement>("#init")?.remove();
  });
