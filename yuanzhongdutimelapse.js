// Timelapse example (based on google API example);
// Create rectangle over Dubai.

Map.centerObject(geometry, 10);

// Add layer to map.
Map.addLayer(geometry);
// Load Landsat image collection.
var allImages = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
 // Filter row and path such that they cover Dubai.
 .filter(ee.Filter.eq('WRS_PATH', 124))
 .filter(ee.Filter.eq('WRS_ROW', 31))
 // Filter cloudy scenes.
 .filter(ee.Filter.lt('CLOUD_COVER', 30))
 // Get required years of imagery.
 .filterDate('2014-01-01', '2022-12-31')
 // Select 3-band imagery for the video.
 .select(['B4', 'B3', 'B2'])
 // Make the data 8-bit.
 .map(function(image) {
  return image.multiply(512).uint8();
 });
Export.video.toDrive({
 collection: allImages,
 // Name of file.
 description: 'yuanzhongduTimelapse4',
 // Quality of video.
 dimensions: 720,
 // FPS of video.
 framesPerSecond: 8,
 // Region of export.
 region: geometry
});