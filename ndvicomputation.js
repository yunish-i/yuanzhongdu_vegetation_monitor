Map.centerObject(field);

var startDate = '2005-09-01';
var endDate = '2005-12-01';

var l5filtT1 = l5raw.filterDate(startDate, endDate)
.filterBounds(point);

var LT1 = ee.Algorithms.Landsat.simpleComposite({
collection: l5filtT1,
asFloat: true
});



Map.addLayer(LT1, {bands: ['B3', 'B2', 'B1'], max: 0.2}, 'composite-1');
Map.addLayer(LT1, {bands: ['B5', 'B4', 'B3'], max: 0.5}, 'SWIR-NIR-Red');
// Map.addLayer(lineStr, {color: 'red'}, 'field');

var palette = ['#FFFFFF', '#CE7E45', '#DF923D', '#F1B555',
'#FCD163', '#99B718', '#74A901', '#66A000',
'#529400', '#3E8601', '#207401', '#056201',
'#004C00', '#023B01', '#012E01', '#011D01', '#011301'];

var NDVI_LT1 = LT1.normalizedDifference(['B4', 'B3']);

function addNDVI(image) {
  var ndvi_lt1 = image.normalizedDifference(['B4', 'B3']).rename('ndvi_lt1')
return image.addBands([ndvi_lt1])
}



var LT1 = ee.ImageCollection("LANDSAT/LT05/C02/T1")
.filterDate(startDate, endDate)
.sort("CLOUD_COVER")
.map(addNDVI); // NDVI function

Map.addLayer(NDVI_LT1, {min: 0, max: 1, palette: palette},'NDVI');

// var vis = {min: -1, max:1};
// palette: ['green', 'blue', 'red']};
var legend = ui.Panel({
style: {
padding: '10px 10px'}
});
// Creates a color bar thumbnail image for use in legend from the given color palette.
function makeColorBarParams(palette) {
return {
bbox: [0, 0, 1, 0.1],
dimensions: '100x10',
format: 'png',
min: 0,
max: 1,
palette: palette,
};
}
// Create the color bar for the legend.
var colorBar = ui.Thumbnail({
image: ee.Image.pixelLonLat().select(0),
params: makeColorBarParams(palette),
style: {width: '300px', height: '200px', stretch: 'horizontal', margin: '0px 8px',
maxHeight: '24px'},
});

// Create a panel with three numbers for the legend.
var legendLabels = ui.Panel({
widgets: [
ui.Label(0, {margin: '4px 8px'}),
ui.Label(
(0.5),
{margin: '4px 8px', textAlign: 'center', stretch: 'horizontal'}),
ui.Label(1, {margin: '4px 8px'})
],
layout: ui.Panel.Layout.flow('horizontal')
});
var legendTitle = ui.Label({
value: 'NDVI',
style: {fontWeight: 'bold'}
});
// Add the legendPanel to legend.
var legendPanel = ui.Panel([legendTitle, colorBar, legendLabels]);
legend.add(legendPanel);
Map.add(legend);

//NDVI chart
var chart = ui.Chart.image.series({
imageCollection: LT1.select('ndvi_lt1'),
region: field,
reducer: ee.Reducer.max()
}).setOptions({
interpolateNulls: true,
lineWidth: 1,
pointSize: 2,
title: 'NDVI Timeseries',
vAxis: {title: 'NDVI'},
hAxis: {format: 'YYYY-MMM', gridlines: {count: 12}}
});
print(chart);