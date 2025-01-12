//Crear un objeto mapa
var map = L.map("map").setView([1.28626, -78.83514],14);

//-----------------------------------------------------------------------------------------------------

//Enlazar el Mapa Base del OpenStreetMap
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

//Enlazar el Mapa Base del Blanco y Negro de Carto
var blackAndWhite = L.tileLayer("http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png").addTo(map);

//Enlazar el mapa base de Calles de Google Earth
var googleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}');

//Enlazar el mapa base de Satélite de Google Earth
var googleSat = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}');

//Enlazar el mapa base de Relieve de ESRI
var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}');

//Enlazar el mapa base de National Geographic
var natGeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

//-----------------------------------------------------------------------------------------------------

var urbano = L.geoJSON(urbano, {
											style 		  : urbano_styles,
											onEachFeature : popupurbano
})
.addTo(map);


//-----------------------------------------------------------------------------------------------------
//Cargar Información ráster
//var relieve_punto1 		= L.latLng(-0.050377541,-81.666221516);
//var relieve_punto2 		= L.latLng(-18.450855722,-68.332541676);

//var ruta_img_relieve	= "layers/raster/relieve4326.png";

//var ruta_img_relieve	= L.imageOverlay(ruta_img_relieve, georreferenciacion);

//-----------------------------------------------------------------------------------------------------

//HERRAMIENTAS, TOOLS, CONTROLES, FUNCIONES

//Agregar el Control de Localización (GPS)
//https://github.com/domoritz/leaflet-locatecontrol
L.control.locate({
					position			: "topleft",
					strings				: {
											title: "Mostrar mi ubicación"
					},
					locateOptions		: {
											maxZoom: 6
					},
    				keepCurrentZoomLevel: true,
    				flyTo				: true,
    				setView				: true
}).addTo(map);

//Agregar un MiniMap o Mapa de Ubicación
//https://github.com/Norkart/Leaflet-MiniMap
new L.Control.MiniMap(googleSat, {
									position		: "bottomleft",
									toggleDisplay	: true,
									minimized		: true,
									strings			: {
														showText		: 'Mostrar Mapa de Ubicación',
														hideText		: 'Ocultar Mapa de Ubicación'
													 }
}).addTo(map);

//Agregar Control de Escala
//https://leafletjs.com/reference.html#control-scale
L.control.scale({
					imperial	: false,
					position	: "bottomleft"
}).addTo(map);

//Agregar una barra de coordenadas
//https://github.com/MrMufflon/Leaflet.Coordinates
L.control.coordinates({
						position			: "topright",
						decimals			: 6,
						decimalSeperator	: ",",
						labelTemplateLng	: "Longitud:  {x}",
						labelTemplateLat	: "Latitud:  {y}",
						useLatLngOrder		: false,
						enableUserInput		: true,
						useDMS				: true
}).addTo(map);


//Buscado de direcciones
//https://github.com/perliedman/leaflet-control-geocoder
L.Control.geocoder({
						position		: "topleft",
						placeholder		: "Buscar...",
						errorMessage	: "No se encontraron resultados de su dirección."
						//geocoder		: L.Control.Geocoder.esri()

}).addTo(map);

//L.Control.Geocoder.mapbox('YOUR_MAPBOX_ACCESS_TOKEN')
//L.Control.Geocoder.esri()
//L.Control.Geocoder.bing('YOUR_BING_MAPS_KEY')para google maps pero con
//L.Control.Geocoder.extend

//Crear un control de busqueda de atributos de una capa GeoJSON (Search-Control)
//https://github.com/stefanocudini/leaflet-search
var searchControl = new L.Control.Search({
							layer 		 	: urbano,
							propertyName 	: "COD_CAT",
							moveToLocation	: function(latlng, title, map){
												var zoom = map.getBoundsZoom(latlng.layer.getBounds());
												map.setView(latlng, zoom);

							},
							marker 			: false
});

//Evento que se ejecute cuando se encuentre una ubicación de busqueda ('search:locationfound')
searchControl.on('search:locationfound', function(e){
	e.layer.setStyle({
		color 	: "#0f0",
		weight	: 8
	});
	if(e.layer._popup){
		e.layer.openPopup();
	}
}).on('search:collapsed', function(e){
	urbano.eachLayer(function(layer){
		urbano.resetStyle(layer)
	});
});

map.addControl(searchControl);


//--------------------CONFIGURACIÓN DE CONTROLADOR DE CAPAS-------------------------------
//Diccionario de Mapas Base

var baseMaps	= {
					"Desactivar Mapas Base" :   L.layerGroup([]),
					"OpenStreetMap"			: 	osm,
					"Blanco y Negro"		: 	blackAndWhite,
					"Calles de Google"		: 	googleStreets,
					"Satélite de Google"	: 	googleSat,
					"Relieve	"			: 	terrain,
					"National Geographic"	: 	natGeo
};

//Diccionar de Capas
var layers		= {
					"urbano"						:   urbano,


};

//Añadir controlador de capas
L.control.layers(baseMaps, layers).addTo(map);

//--------------------------------------------------------------------------------------------

