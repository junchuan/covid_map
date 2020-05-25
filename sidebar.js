(function () {
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Group({
                // A layer must have a title to appear in the layerswitcher
                'title': 'Base maps',
                layers: [
                    new ol.layer.Tile({
                        title: 'ArcGIS',
                        // Again set this layer as a base layer
                        type: 'base',
                        source: new ol.source.XYZ({
                          attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                              'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                              'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                        })
                      }),
                    new ol.layer.Tile({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Mapbox',
                        // Again set this layer as a base layer
                        type: 'base',
                        visible: true,
                        source: new ol.source.XYZ({
                                attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                                    'rest/services/World_Topo_Map/MapServer">MapBox</a>',
                                url: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVuY2h1YW4iLCJhIjoiY2o4bHowcWF1MHVkeTMybXY1ZDE2aHk4OSJ9.HF2W8s1GNuY550GcjRsRBw'
                            }

                        )
                    })
                ]
            }),
            new ol.layer.Group({
                // A layer must have a title to appear in the layerswitcher
                title: 'Data layers',
                // Adding a 'fold' property set to either 'open' or 'close' makes the group layer
                // collapsible
                fold: 'open',
                layers: [
                    new ol.layer.Group({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Country',
                        layers: [
                            new ol.layer.Tile({
                                // A layer must have a title to appear in the layerswitcher
                                title: 'Live estimates',
                                maxZoom: 4, 
                                opacity: 0.5,
                                source: new ol.source.TileWMS({
                          
                                   // ratio: 1,
                                  //  singleTile: true,
                                    params: {
                                        LAYERS: "covidmap:country_agg_view",
                                        styles: "new_living"
                                   //     singleTile: true

                                    },
                                    url: "https://gsweb2.umd.edu/geoserver/covidmap/wms"
                                })
                            }),
                            new ol.layer.Tile({
                                // A layer must have a title to appear in the layerswitcher
                                title: 'Smoothed',
                                maxZoom: 4, 
                                opacity: 0.5,
                                source: new ol.source.TileWMS({
                                  //  maxZoom: 2, 
                                  //  ratio: 1,
                                  //  singleTile: true,
                                    params: {
                                        LAYERS: "covidmap:smooth_country_agg_view",
                                        styles: "new_smoothed"
                                     //  singleTile: true

                                    },
                                    url: "https://gsweb2.umd.edu/geoserver/covidmap/wms"
                                })
                            })
                        ]
                    }),
                    new ol.layer.Group({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Region',
                        fold: 'open',
                        layers: [
                            new ol.layer.Tile({
                                // A layer must have a title to appear in the layerswitcher
                                title: 'Live estimates',
                                minZoom: 4, 
                                opacity: 0.7,
                                source: new ol.source.TileWMS({
                                    
                          
                                   // ratio: 1,
                                  //  singleTile: true,
                                    params: {
                                     
                                        LAYERS: "covidmap:region_agg_view",
                                        styles: "new_living"
                                   //     singleTile: true

                                    },
                                    url: "https://gsweb2.umd.edu/geoserver/covidmap/wms"
                                })
                            }),
                            new ol.layer.Tile({
                                // A layer must have a title to appear in the layerswitcher
                                title: 'Smoothed',
                                minZoom: 4, 
                                opacity: 0.7,
                                source: new ol.source.TileWMS({
                                  //  maxZoom: 2, 
                                  //  ratio: 1,
                                  //  singleTile: true,
                                    params: {
                                        LAYERS: "covidmap:smooth_region_agg_view",
                                        styles: "new_smoothed"
                                     //  singleTile: true

                                    },
                                    url: "https://gsweb2.umd.edu/geoserver/covidmap/wms"
                                })
                            })
                        ]
                    })
                ]
            })
        ],
        view: new ol.View({
            center: ol.proj.transform([0, 27], 'EPSG:4326', 'EPSG:3857'),
            zoom: 1
        })
    });

    // Get out-of-the-map div element with the ID "layers" and renders layers to it.
    // NOTE: If the layers are changed outside of the layer switcher then you
    // will need to call ol.control.LayerSwitcher.renderPanel again to refesh
    // the layer tree. Style the tree via CSS.
    var sidebar = new ol.control.Sidebar({
        element: 'sidebar',
        position: 'left'
    });
    var toc = document.getElementById("layers");
    ol.control.LayerSwitcher.renderPanel(map, toc);
    map.addControl(sidebar);

})();
