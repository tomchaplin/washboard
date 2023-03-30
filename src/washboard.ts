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

const buildDatasets = (chart, data) => {
  const key = chart["id"];
  const pairings = data["pairings"][key];
  const datasets = pairings.map((diagram, diagram_d) => {
    let dataset_data = diagram.map((point) => {
      let pairing = point[0];
      let relations = point[1];
      let y =
        pairing.length > 1 ? data.filtration[pairing[1]] : data["pseudo_inf"];
      return {
        x: data.filtration[pairing[0]],
        y,
        underlying: pairing,
        relations,
      };
    });
    return { label: `${diagram_d}`, data: dataset_data };
  });
  return datasets;
};

const clearHighlights = (chart_idx, all_charts) => {
  for (let i = 0; i < all_charts.length; i++) {
    if (i == chart_idx) {
      continue;
    }
    all_charts[i].handle?.setActiveElements([]);
    all_charts[i].handle?.tooltip?.setActiveElements([]);
    all_charts[i].handle?.update();
  }
};

const highlightRelations = (relations, all_charts) => {
  Object.entries(relations).forEach(([key, sub_relations]) => {
    if (sub_relations.length > 0) {
      let chart = all_charts.find((chart_manifest) => chart_manifest.id == key);
      let handle = chart.handle;
      let active_elements = sub_relations.map((rel) => {
        return { datasetIndex: rel[0], index: rel[1] };
      });
      handle.setActiveElements(active_elements);
      handle.tooltip.setActiveElements(active_elements);
      handle.update();
    }
  });
};

export function setupCanvas(chart_idx: number, all_charts, data) {
  let chart = all_charts[chart_idx];
  const ctx = document.querySelector<HTMLCanvasElement>(
    `#${chart["id"]}Chart`
  )!;
  const chart_data = {
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
              let pt = context.raw;
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
        items.forEach((item) => {
          const relations =
            chart_data.datasets[item.datasetIndex].data[item.index].relations;
          highlightRelations(relations, all_charts);
        });
      },
    },
  });
  return c;
}
