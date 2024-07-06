import React from 'react';
import { processColor, Text, View } from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';



const xAxisProps = {
  valueFormatter: [],
  drawGridLines: false,
  position: 'BOTTOM',
  textSize: 11,
};

const yAxisProps = {
  left: { drawGridLines: false, textSize: 11, axisMinimum: 0, drawAxisLine: true },
  right: {
    drawGridLines: true,
    gridColor: processColor('#e1e1e1'),
    drawLabels: false,
    axisMinimum: 0,
    drawAxisLine: false,
  },
};

const legend = {
  enabled: false,
  text: '',
};


const MyBarChart = (props) => {

  const {
    valueFormatter,
    style,
    xUnit,
    datas,
    barWidth,
    barColors = [],
    xAxisLabels,
  } = props;

  const configBarChartColors = barColors.map(e => (processColor(e)));


  const configBarChart = {
    colors: configBarChartColors?.length ? configBarChartColors : [processColor('#1E6F5C'||'#3498DB')],
    highlightAlpha: 0,
    valueTextSize: 10,
    valueFormatter: valueFormatter ? '#' : null,
  };

  console.log('xUnit: ', xUnit);
  return (
    <View style={[{ height: 300 }, style]}>
      {xUnit ? <Text style={{ fontSize: 12 }}>{xUnit || ''}</Text> : null}
      <BarChart
        style={{ flex: 1 }}
        data={{
          dataSets: [
            {
              values: datas,
              label: '',
              config: configBarChart,
            },
          ],
          config: {
            barWidth: barWidth || 0.5,

          },
        }}
        legend={legend}
        xAxis={{ ...xAxisProps, valueFormatter: xAxisLabels || [] }}
        yAxis={yAxisProps}
        scaleEnabled={false}
        touchEnabled={false}
        drawValueAboveBar
        // pinchZoom
        // doubleTapToZoomEnabled
        animation={{ durationY: 1000 }}
        chartDescription={{ text: '' }}

      />
    </View>
  );
};


export default MyBarChart;
