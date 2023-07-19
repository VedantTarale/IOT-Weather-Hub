import {Line} from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'
import { PropTypes } from 'prop-types';
function Chart({chartdata}) {
  return (
    <Line data={chartdata}/>
  )
}
Chart.propTypes = {
    chartdata: PropTypes.node.isRequired,
};
export default Chart        