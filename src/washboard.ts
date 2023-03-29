import {
  Chart,
  Colors,
  ScatterController,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  ChartData,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(
  ScatterController,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Colors,
  annotationPlugin
);

export type ChartManifest = {
  id: "kernel" | "relative" | "cokernel" | "domain" | "image" | "codomain";
  title: string;
  dim_shift?: number;
  additional_max_dim?: number;
  handle?: Chart;
};

export type PairingDiagram = {
  unpaired: number[];
  paired: number[][];
};

export type PhimakerData = {
  dimensions: number[];
  filtration: number[];
  max_dim: number;
  pseudo_inf: number;
  pairings: {
    kernel: PairingDiagram;
    relative: PairingDiagram;
    cokernel: PairingDiagram;
    domain: PairingDiagram;
    image: PairingDiagram;
    codomain: PairingDiagram;
  };
};

type DiagramPoint = { x: number; y: number; underlying: number[] };
type CustomData = ChartData<"scatter", DiagramPoint[]>;

const buildDatasets = (chart: ChartManifest, data: PhimakerData) => {
  const key = chart["id"];
  const pairings = data["pairings"][key];
  let datasets = [];
  let dim_shift = chart.dim_shift ?? 0;
  let additional_max_dim = chart.additional_max_dim ?? 0;
  for (let i = 0; i <= data.max_dim + additional_max_dim; i++) {
    const paired_pts = pairings.paired
      .filter((pairing) => data.dimensions[pairing[0]] - dim_shift == i)
      .filter(
        (pairing) => data.filtration[pairing[0]] != data.filtration[pairing[1]]
      )
      .map((pairing) => {
        return {
          x: data.filtration[pairing[0]],
          y: data.filtration[pairing[1]],
          underlying: pairing,
        };
      });
    const unpaired_pts = pairings.unpaired
      .filter((idx) => data.dimensions[idx] - dim_shift == i)
      .map((idx) => {
        return {
          x: data.filtration[idx],
          y: data.pseudo_inf,
          underlying: [idx],
        };
      });
    const pts = paired_pts.concat(unpaired_pts);
    datasets.push({
      label: `${i}`,
      data: pts,
    });
  }
  return datasets;
};

function someListIntersects(underlying: number[][], list2: number[]) {
  return underlying.some((list1) =>
    list1.some((elem1) => list2.includes(elem1))
  );
}

const highlightUnderlying = (
  chart_idx: number,
  all_charts: ChartManifest[],
  underlying: number[][]
) => {
  for (let i = 0; i < all_charts.length; i++) {
    if (i == chart_idx) {
      continue;
    }
    let datasets = all_charts[i].handle?.config.data.datasets;
    let activeElements = datasets?.flatMap((dataset, datasetIndex) => {
      let active = [];
      let subdata = dataset.data;
      for (let j = 0; j < subdata.length; j++) {
        if (someListIntersects(underlying, subdata[j].underlying)) {
          active.push({ datasetIndex, index: j });
        }
      }
      return active;
    });
    if (typeof activeElements == "undefined") {
      continue;
    }
    all_charts[i].handle?.setActiveElements(activeElements);
    all_charts[i].handle?.tooltip?.setActiveElements(activeElements);
    all_charts[i].handle?.update();
  }
};

const clearHighlights = (chart_idx: number, all_charts: ChartManifest[]) => {
  for (let i = 0; i < all_charts.length; i++) {
    if (i == chart_idx) {
      continue;
    }
    all_charts[i].handle?.setActiveElements([]);
    all_charts[i].handle?.tooltip?.setActiveElements([]);
    all_charts[i].handle?.update();
  }
};

export function setupCanvas(
  chart_idx: number,
  all_charts: ChartManifest[],
  data: PhimakerData
) {
  let chart = all_charts[chart_idx];
  const ctx = document.querySelector<HTMLCanvasElement>(
    `#${chart["id"]}Chart`
  )!;
  const chart_data: CustomData = {
    datasets: buildDatasets(chart, data),
  };
  let c = new Chart(ctx, {
    type: "scatter",
    data: chart_data,
    options: {
      elements: {
        point: {
          hoverRadius: 6,
          hoverBorderWidth: 3,
        },
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: "bottom",
        },
        title: {
          display: true,
          font: {
            size: 20,
          },
          text: chart.title,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              let pt: DiagramPoint = context.raw;
              let pt_string =
                pt.underlying.length > 1
                  ? `(${context.parsed.x.toFixed(
                      3
                    )}, ${context.parsed.y.toFixed(3)})`
                  : `(${context.parsed.x.toFixed(3)}, inf)`;
              let dimension = `Dimension ${context.dataset.label}`;
              return [pt_string, dimension];
            },
          },
        },
        annotation: {
          annotations: {
            diagonal_line: {
              type: "line",
              borderDash: [5, 2],
              borderColor: "rgba(0, 0, 0, 0.2)",
              yMin: 0,
              yMax: data.pseudo_inf,
              xMin: 0,
              xMax: data.pseudo_inf,
            },
            pseudo_inf: {
              type: "line",
              borderDash: [5, 2],
              borderColor: "rgba(0, 0, 0, 0.2)",
              yMin: data.pseudo_inf,
              yMax: data.pseudo_inf,
              xMin: 0,
              xMax: data.pseudo_inf,
            },
            zero_birth: {
              type: "line",
              borderDash: [5, 2],
              borderColor: "rgba(0, 0, 0, 0.2)",
              yMin: 0,
              yMax: data.pseudo_inf,
              xMin: 0,
              xMax: 0,
            },
          },
        },
      },
      scales: {
        x: {
          min: data.pseudo_inf * -0.02,
          max: data.pseudo_inf * 1.02,
          title: {
            display: true,
            text: "Birth",
          },
          beginAtZero: true,
        },
        y: {
          min: data.pseudo_inf * -0.02,
          max: data.pseudo_inf * 1.02,
          title: {
            display: true,
            text: "Death",
          },
          beginAtZero: true,
        },
      },
      onHover: (e, items) => {
        if (items.length == 0) {
          clearHighlights(chart_idx, all_charts);
          return;
        }
        let underlying = items.map(
          (item) =>
            chart_data.datasets[item.datasetIndex].data[item.index].underlying
        );
        highlightUnderlying(chart_idx, all_charts, underlying);
      },
    },
  });
  return c;
}
