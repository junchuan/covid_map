(function () {
  var country_agg_source = new ol.source.TileWMS({
    // ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:country_agg_view",
      styles: "new_living",
      //     singleTile: true
    },
    url: "https://gsweb2.umd.edu/geoserver/covidmap/wms",
  });

  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Group({
        // A layer must have a title to appear in the layerswitcher
        title: "Base maps",
        layers: [
          new ol.layer.Tile({
            title: "ArcGIS",
            // Again set this layer as a base layer
            type: "base",
            source: new ol.source.XYZ({
              attributions:
                'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
              url:
                "https://server.arcgisonline.com/ArcGIS/rest/services/" +
                "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            }),
          }),
          new ol.layer.Tile({
            // A layer must have a title to appear in the layerswitcher
            title: "Mapbox",
            // Again set this layer as a base layer
            type: "base",
            visible: true,
            source: new ol.source.XYZ({
              attributions:
                'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">MapBox</a>',
              url:
                "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVuY2h1YW4iLCJhIjoiY2o4bHowcWF1MHVkeTMybXY1ZDE2aHk4OSJ9.HF2W8s1GNuY550GcjRsRBw",
            }),
          }),
        ],
      }),

      new ol.layer.Group({
        // A layer must have a title to appear in the layerswitcher
        title: "Data layers",
        // Adding a 'fold' property set to either 'open' or 'close' makes the group layer
        // collapsible
        fold: "open",
        layers: [
          new ol.layer.Group({
            // A layer must have a title to appear in the layerswitcher
            title: "Country",
            layers: [
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Live estimates",
                maxZoom: 4,
                opacity: 0.5,
                source: country_agg_source,
              }),
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Smoothed",
                maxZoom: 4,
                opacity: 0.5,
                source: new ol.source.TileWMS({
                  //  maxZoom: 2,
                  //  ratio: 1,
                  //  singleTile: true,
                  params: {
                    LAYERS: "covidmap:smooth_country_agg_view",
                    styles: "new_smoothed",
                    //  singleTile: true
                  },
                  url: "https://gsweb2.umd.edu/geoserver/covidmap/wms",
                }),
              }),
            ],
          }),
          new ol.layer.Group({
            // A layer must have a title to appear in the layerswitcher
            title: "Region",
            fold: "open",
            layers: [
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Live estimates",
                minZoom: 4,
                opacity: 0.7,
                source: new ol.source.TileWMS({
                  // ratio: 1,
                  //  singleTile: true,
                  params: {
                    LAYERS: "covidmap:region_agg_view",
                    styles: "new_living",
                    //     singleTile: true
                  },
                  url: "https://gsweb2.umd.edu/geoserver/covidmap/wms",
                }),
              }),
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Smoothed",
                minZoom: 4,
                opacity: 0.7,
                source: new ol.source.TileWMS({
                  //  maxZoom: 2,
                  //  ratio: 1,
                  //  singleTile: true,
                  params: {
                    LAYERS: "covidmap:smooth_region_agg_view",
                    styles: "new_smoothed",
                    //  singleTile: true
                  },
                  url: "https://gsweb2.umd.edu/geoserver/covidmap/wms",
                }),
              }),
            ],
          }),
        ],
      }),
    ],
    view: new ol.View({
      center: ol.proj.transform([0, 27], "EPSG:4326", "EPSG:3857"),
      zoom: 1,
    }),
  });

  /////////////////////////////////////////////////////////////////////////////////////
  //code for adding pop up window
  //
  ////////////////////////////////////////////////////////////////////////////////////

  var popup = new Popup();
  map.addOverlay(popup);

  // map.on('singleclick', function(evt) {
  //     var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
  //     popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
  // });

  map.on("singleclick", function (evt) {
    // document.getElementById('info').innerHTML = '';
    var viewResolution = /** @type {number} */ (map.getView().getResolution());

    var pixel = map.getEventPixel(evt.originalEvent);

    layer_name = map.forEachLayerAtPixel(pixel, function (layer) {
      try {
        return layer.getSource().getParams().LAYERS;
        // console.log(layer.getSource().getParams());
      } catch (err) {
        console.log(err);
      }
    });

    style_name = "new_smoothed";
    if (!layer_name) {
      console.log("cannot get information of basemap");
    } else if (layer_name.includes("smooth")) {
      style_name = "new_smoothed";
    } else {
      style_name = "new_living";
    }

    var agg_source = new ol.source.TileWMS({
      // ratio: 1,
      //  singleTile: true,
      params: {
        LAYERS: layer_name,
        styles: style_name,
        //     singleTile: true
      },
      url: "https://gsweb2.umd.edu/geoserver/covidmap/wms",
      serverType: "geoserver",
      crossOrigin: 'anonymous'
    });

    var url = agg_source.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      "EPSG:3857",
      { INFO_FORMAT: "text/html" }
    );

     
    // console.log(url);
    if (url) {
      fetch(url)
        .then(function (response) {
          //   console.log(response);
          return response.text();
        })
        .then(function (html) {
          console.log(html);
          var el = document.createElement("html");
          el.innerHTML = html;

          res_html = "<table>";

          th_list = [];
          for (th of el.getElementsByTagName("th")) {
            th_list.push(th.innerText);
          }
          console.log(th_list);

          td_list = [];
          for (td of el.getElementsByTagName("td")) {
            td_list.push(td.innerText);
          }
          console.log(td_list);

          if (td_list.length == 7) {
            for (i = 1; i < td_list.length; i++) {

              if(i==3 || i ==4)
              {
                // formatt values to percentage
                res_html +=
                "<tr><td><b>" +
                th_list[i] +
                "</b>: </td><td>" +
                (td_list[i]*100).toFixed(2) +" %"+
                "</td></tr>";
              }
              else if(i == 6){

                // formatt date
                surveydate  = new Date(td_list[i])
                res_html +=
                "<tr><td><b>" +
                th_list[i] +
                "</b>: </td><td>" +
                surveydate.toLocaleDateString("en-US")+
                "</td></tr>";

              }
              else{ 

                res_html +=
                "<tr><td><b>" +
                th_list[i] +
                "</b>: </td><td>" +
                td_list[i] +
                "</td></tr>";

              }
            }
            res_html += "</table>";
            popup.show(evt.coordinate, res_html);
          } 
          else if (td_list.length == 8)
          {
            for (i = 1; i < td_list.length; i++) {

              if(i==4 || i ==5)
              {
                // formatt values to percentage
                res_html +=
                "<tr><td><b>" +
                th_list[i] +
                "</b>: </td><td>" +
                (td_list[i]*100).toFixed(2) +" %"+
                "</td></tr>";
              }
              else if(i == 7){

                // formatt date
                surveydate  = new Date(td_list[i])
                res_html +=
                "<tr><td><b>" +
                th_list[i] +
                "</b>: </td><td>" +
                surveydate.toLocaleDateString("en-US")+
                "</td></tr>";

              }
              else{ 

                res_html +=
                "<tr><td><b>" +
                th_list[i] +
                "</b>: </td><td>" +
                td_list[i] +
                "</td></tr>";

              }
            }
            res_html += "</table>";
            popup.show(evt.coordinate, res_html);

          }
          else {
            popup.hide();
          }
        });
    }
  });

  map.on("pointermove", function (evt) {
    if (evt.dragging) {
      return;
    }
    var pixel = map.getEventPixel(evt.originalEvent);
    var hit = map.forEachLayerAtPixel(pixel, function (layer) {
      if (
        layer.getProperties().title == "Mapbox" ||
        layer.getProperties().title == "ArcGIS"
      ) {
        return false;
      } else {
        // console.log(layer.getSource().getParams().LAYERS);
        return true;
      }
    });
    map.getTargetElement().style.cursor = hit ? "pointer" : "";
  });

  // Get out-of-the-map div element with the ID "layers" and renders layers to it.
  // NOTE: If the layers are changed outside of the layer switcher then you
  // will need to call ol.control.LayerSwitcher.renderPanel again to refesh
  // the layer tree. Style the tree via CSS.
  var sidebar = new ol.control.Sidebar({
    element: "sidebar",
    position: "left",
  });
  var toc = document.getElementById("layers");
  ol.control.LayerSwitcher.renderPanel(map, toc);
  map.addControl(sidebar);
})();
