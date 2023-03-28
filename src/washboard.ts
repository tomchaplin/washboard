import Chart from 'chart.js/auto'

export function setupCanvas(ctx: HTMLCanvasElement, diagram: String) {
  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Dimension 0',
        data: [{x:1, y:2}, {x:3, y:5}, {x:1, y:3}, {x:2, y:3.5}],
        borderWidth: 1
      },
      {
        label: 'Dimension 1',
        data: [{x:3, y:4}, {x:4, y:9}, {x:0, y:-3}, {x:1.5, y:3}],
        borderWidth: 1
      }]
    },
    options: {
      aspectRatio: 1,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

}
