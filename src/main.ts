import './style.css'
import { setupCanvas } from './washboard'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="six_pack_holder">
  <div class="chart_container">
    <canvas id="kernelChart"></canvas>
  </div>
  <div class="chart_container">
    <canvas id="relativeChart"></canvas>
  </div>
  <div class="chart_container">
    <canvas id="cokernelChart"></canvas>
  </div>
  <div class="chart_container">
    <canvas id="domainChart"></canvas>
  </div>
  <div class="chart_container">
    <canvas id="imageChart"></canvas>
  </div>
  <div class="chart_container">
    <canvas id="codomainChart"></canvas>
  </div>
</div>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#kernelChart')!, 'kernel');
setupCanvas(document.querySelector<HTMLCanvasElement>('#relativeChart')!, 'relative');
setupCanvas(document.querySelector<HTMLCanvasElement>('#cokernelChart')!, 'cokernel');
setupCanvas(document.querySelector<HTMLCanvasElement>('#domainChart')!, 'domain');
setupCanvas(document.querySelector<HTMLCanvasElement>('#imageChart')!, 'image');
setupCanvas(document.querySelector<HTMLCanvasElement>('#codomainChart')!, 'codomain');
