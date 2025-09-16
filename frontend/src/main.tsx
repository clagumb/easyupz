import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS } from 'chart.js';
ChartJS.register(ChartDataLabels);

import { render } from 'preact'
import { App } from './app.tsx'

import './index.css'

render(<App />, document.getElementById('app')!)
