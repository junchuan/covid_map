(function () {

  var BASE_URL = "https://covidmap.umd.edu/geoserver/covidmap/wms";

  var country_agg_source = new ol.source.TileWMS({
    // ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:country_agg_view_prod",
      styles: "new_living",
      //     singleTile: true
    },
    url: BASE_URL,
  });

  var country_agg_source_unw = new ol.source.TileWMS({
    // ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:country_agg_view_prod",
      styles: "new_living_unw",
      //     singleTile: true
    },
    url: BASE_URL,
  });


  var smooth_country_agg_source = new ol.source.TileWMS({
    //  maxZoom: 2,
    //  ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:smooth_country_agg_view_prod",
      styles: "new_smoothed",
      //  singleTile: true
    },
    url: BASE_URL,
  });

  var region_agg_source = new ol.source.TileWMS({
    // ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:region_agg_view_prod",
      styles: "new_living",
      //     singleTile: true
    },
    url: BASE_URL,
  });

  var region_agg_source_unw = new ol.source.TileWMS({
    // ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:region_agg_view_prod",
      styles: "new_living_unw",
      //     singleTile: true
    },
    url: BASE_URL,
  });

  var smooth_region_agg_source = new ol.source.TileWMS({
    //  maxZoom: 2,
    //  ratio: 1,
    //  singleTile: true,
    params: {
      LAYERS: "covidmap:smooth_region_agg_view_prod",
      styles: "new_smoothed",
      //  singleTile: true
    },
    url: BASE_URL,
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
              attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
              url: "https://server.arcgisonline.com/ArcGIS/rest/services/" +
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
              attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">MapBox</a>',
              url: "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianVuY2h1YW4iLCJhIjoiY2o4bHowcWF1MHVkeTMybXY1ZDE2aHk4OSJ9.HF2W8s1GNuY550GcjRsRBw",
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
                visible:false,
                source: country_agg_source,
              }),
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Live estimates(unweighted)",
                maxZoom: 4,
                opacity: 0.5,
                visible:false,
                source: country_agg_source_unw,
              }),
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Smoothed",
                maxZoom: 4,
                opacity: 0.5,
                source: smooth_country_agg_source
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
                visible:false,
                source: region_agg_source
              }),
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Live estimates(unweighted)",
                minZoom: 4,
                opacity: 0.7,
                visible: false,
                source: region_agg_source_unw
              }),
              new ol.layer.Tile({
                // A layer must have a title to appear in the layerswitcher
                title: "Smoothed",
                minZoom: 4,
                opacity: 0.7,
                source: smooth_region_agg_source
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


  var a = map.on("singleclick", pop);
  

  function pop (evt) { 
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


    sssname = map.forEachLayerAtPixel(pixel, function (layer) {
      try {
        return layer.getSource().getParams().styles;
        // console.log(layer.getSource().getParams());
      } catch (err) {
        console.log(err);
      }
    });
    //  console.log(sssname);
    style_name = "new_smoothed";
    if (!layer_name) {
      console.log("cannot get information of basemap");
    } else if (layer_name.includes("smooth")) {
      style_name = "new_smoothed";
    } else if(layer_name.includes("unw")){
      style_name = "new_living_unw";
    } else {
      style_name = "new_living";
    }
    //  console.log(layer_name)
    var agg_source = new ol.source.TileWMS({
      // ratio: 1,
      //  singleTile: true,
      params: {
        LAYERS: layer_name,
        styles: style_name,
        //     singleTile: true
      },
      url: BASE_URL,
      serverType: "geoserver",
      crossOrigin: 'anonymous'
    });

    var url = agg_source.getFeatureInfoUrl(
      evt.coordinate,
      viewResolution,
      "EPSG:3857", {
        INFO_FORMAT: "text/html"
      }
    );



    //console.log(url);
    if (url) {
      fetch(url)
        .then(function (response) {
          //   console.log(response);
          return response.text();
        })
        .then(function (html) {
          //console.log(html);
          var el = document.createElement("html");
          el.innerHTML = html;

          res_html = "<table>";

          th_list = [];
          for (th of el.getElementsByTagName("th")) {
            th_list.push(th.innerText);
          }
          // console.log(sssname);
          console.log(th_list);

          td_list = [];
          for (td of el.getElementsByTagName("td")) {
            td_list.push(td.innerText);
          }
          console.log(td_list);

          //SMOOTH LAYER
          if (sssname.includes("smooth") && td_list.length == 9) {

            res_html ="<tr><b>" + td_list[4] +"</b></tr>";
            res_html += "<table style=\"width:100%\"><tr>" 
            for (i = 5; i < td_list.length;i++) {
              res_html +=
              "<td><b>" +
              th_list[i] +
              "</b> </td>";
            }

            res_html +="</tr>"
            res_html +="<tr>"
            for (i = 5; i < td_list.length;i++) {
              if (i == 5 || i == 6) {
               // formatt values to percentage
               res_html +=
               "<td>" +
               (td_list[i] * 100).toFixed(2) + " %" +
               "</td>";
              } else if (i == 8) {

                // formatt date
                surveydate = new Date(td_list[i])
                res_html +=
                "<td>" +
                  surveydate.toLocaleDateString("en-US") +
                  " </td>";
              } else {

              res_html +=
              "<td>" +
              td_list[i] +
              "</td>";
              }
            }
            res_html +="</tr>"
            res_html += "</table>";
            res_html += "<div id=trend></div>";

            //******************************START OF TREND CHART COUNTRY LEVEL - SMOOTH********************************/
            enddate = surveydate.toLocaleDateString('ISO');

            var url_covid = signalUrlCreator("covid", "smoothed", td_list[4], null, enddate);
            var url_flu = signalUrlCreator("flu", "smoothed", td_list[4], null, enddate);
            var url_covid_cases = casesUrlCreator(td_list[4], null, enddate);

            plotCreator("smooth", url_covid, url_flu, url_covid_cases);

            popup.show(evt.coordinate, res_html);
          } 
          else if (sssname.includes("smooth") && td_list.length == 11) {

            res_html ="<tr><b>" + td_list[6] + ", "+td_list[5]+"</b></tr>";
            res_html += "<table style=\"width:100%\"><tr>" 
            for (i = 7; i < td_list.length;i++) {
              res_html +=
              "<td><b>" +
              th_list[i] +
              "</b> </td>";
            }

            res_html +="</tr>"
            res_html +="<tr>"
            for (i = 7; i < td_list.length;i++) {
              if (i == 7 || i == 8) {
               // formatt values to percentage
               res_html +=
               "<td>" +
               (td_list[i] * 100).toFixed(2) + " %" +
               "</td>";
              } else if (i == 10) {

                // formatt date
                surveydate = new Date(td_list[i])
                res_html +=
                "<td>" +
                  surveydate.toLocaleDateString("en-US") +
                  " </td>";
              } else {

              res_html +=
              "<td>" +
              td_list[i] +
              "</td>";
              }
            }
            res_html +="</tr></table>"
            res_html += "</table>";
            res_html += "<div id=trend></div>";

            //******************************START OF TREND CHART REGION LEVEL - SMOOTH********************************/
            enddate = surveydate.toLocaleDateString('ISO');

            var url_covid = signalUrlCreator("covid", "smoothed", td_list[5], td_list[6], enddate);
            var url_flu = signalUrlCreator("flu", "smoothed", td_list[5], td_list[6], enddate);
            var url_covid_cases;

            // US has a different naming order. Full state names are in  td_list[3].
            // For the rest of the world td_list[6] has the corrent name
            if(td_list[5] == "United States of America") {
              var url_covid_cases = casesUrlCreator(td_list[5], td_list[3], enddate);
            }
            else {
              var url_covid_cases = casesUrlCreator(td_list[5], td_list[6], enddate);
            }

            //Regional Covid Trace
            plotCreator("smooth", url_covid, url_flu, url_covid_cases);
            
            res_html += "</table>";
            res_html += "<div id=trend></div>";
            popup.show(evt.coordinate, res_html);

          }
          //LIVE UNWEIGHTED 
          else if(sssname.includes("unw") && td_list.length == 11){

            res_html ="<tr><b>" + td_list[3] +"</b></tr>";
            res_html += "<table style=\"width:100%\"><tr>" 
            for (i = 7; i < td_list.length;i++) {
              res_html +=
              "<td><b>" +
              th_list[i] +
              "</b> </td>";
            }

            res_html +="</tr>"
            res_html +="<tr>"
            for (i = 7; i < td_list.length;i++) {
              if (i == 7 || i == 8) {
               // formatt values to percentage
               res_html +=
               "<td>" +
               (td_list[i] * 100).toFixed(2) + " %" +
               "</td>";
              } else if (i == 10) {

                // formatt date
                surveydate = new Date(td_list[i])
                res_html +=
                "<td>" +
                  surveydate.toLocaleDateString("en-US") +
                  " </td>";
              } else {

              res_html +=
              "<td>" +
              td_list[i] +
              "</td>";
              }
            }
            res_html +="</tr></table>"
            res_html += "</table>";
            res_html += "<div id=trend></div>";

            //******************************START OF TREND CHART COUNTRY LEVEL********************************/  
            enddate = surveydate.toLocaleDateString('ISO');

            var url_covid = signalUrlCreator("covid", "daily", td_list[3], null, enddate);
            var url_flu = signalUrlCreator("flu", "daily", td_list[3], null, enddate);
            var url_covid_cases = casesUrlCreator(td_list[3], null, enddate);

            //Country Covid Trace
            plotCreator("unw", url_covid, url_flu, url_covid_cases);

            popup.show(evt.coordinate, res_html);         
          }
          else if (sssname.includes("unw") && td_list.length == 13) {
            res_html ="<tr><b>" + td_list[6] + ", "+td_list[5]+"</b></tr>";
            res_html += "<table style=\"width:100%\"><tr>" 
            for (i = 9; i < td_list.length;i++) {
              res_html +=
              "<td><b>" +
              th_list[i] +
              "</b> </td>";
            }

            res_html +="</tr>"
            res_html +="<tr>"
            for (i = 9; i < td_list.length;i++) {
              if (i == 9 || i == 10) {
               // formatt values to percentage
               res_html +=
               "<td>" +
               (td_list[i] * 100).toFixed(2) + " %" +
               "</td>";
              } else if (i == 12) {

                // formatt date
                surveydate = new Date(td_list[i])
                res_html +=
                "<td>" +
                  surveydate.toLocaleDateString("en-US") +
                  " </td>";
              } else {

              res_html +=
              "<td>" +
              td_list[i] +
              "</td>";
              }
            }
            res_html +="</tr></table>"
            res_html += "</table>";
            res_html += "<div id=trend></div>";

            //******************************START OF TREND CHART REGION LEVEL********************************/
            enddate = surveydate.toLocaleDateString('ISO');

            var url_covid = signalUrlCreator("covid", "daily", td_list[5], td_list[6], enddate);
            var url_flu = signalUrlCreator("flu", "daily", td_list[5], td_list[6], enddate);
            var url_covid_cases;

            if(td_list[5] == "United States of America") {
              var url_covid_cases = casesUrlCreator(td_list[5], td_list[3], enddate);
            }
            else {
              var url_covid_cases = casesUrlCreator(td_list[5], td_list[6], enddate);
            }

            //Regional Covid Trace
            plotCreator("unw", url_covid, url_flu, url_covid_cases);

            res_html += "</table>";
            res_html += "<div id=trend></div>";
            popup.show(evt.coordinate, res_html);

          }
          //LIVE 
          else if(td_list.length == 11){

            res_html ="<tr><b>" + td_list[3] +"</b></tr>";
            res_html += "<table style=\"width:100%\"><tr>" 
            for (i = 5; i < td_list.length;i++) {
              if (i ==7 || i==8){
                res_html
              }else{
                res_html +=
                "<td><b>" +
                th_list[i] +
                "</b> </td>";
              }
            }

            res_html +="</tr>"
            res_html +="<tr>"
            for (i = 5; i < td_list.length;i++) {
              if (i == 5 || i == 6) {
               // formatt values to percentage
               res_html +=
               "<td>" +
               (td_list[i] * 100).toFixed(2) + " %" +
               "</td>";
              } else if(i == 7 || i == 8){

              }else if (i == 10) {

                // formatt date
                surveydate = new Date(td_list[i])
                res_html +=
                "<td>" +
                  surveydate.toLocaleDateString("en-US") +
                  " </td>";
              } else {

              res_html +=
              "<td>" +
              td_list[i] +
              "</td>";
              }
            }
            res_html +="</tr></table>"
            res_html += "</table>";
            res_html += "<div id=trend></div>";

            //******************************START OF TREND CHART COUNTRY LEVEL********************************/
            enddate = surveydate.toLocaleDateString('ISO');

            var url_covid = signalUrlCreator("covid", "daily", td_list[3], null, enddate);
            var url_flu = signalUrlCreator("flu", "daily", td_list[3], null, enddate);
            var url_covid_cases = casesUrlCreator(td_list[3], null, enddate);

            //Country Covid Trace
            plotCreator("live", url_covid, url_flu, url_covid_cases);

            popup.show(evt.coordinate, res_html);         
          }  
          else if (td_list.length == 13) {
            res_html ="<tr><b>" + td_list[6] + ", "+td_list[5]+"</b></tr>";
            res_html += "<table style=\"width:100%\"><tr>" 
            for (i = 7; i < td_list.length;i++) {
              if(i==9 || i==10){

              }else{
                res_html +=
                "<td><b>" +
                th_list[i] +
                "</b> </td>";
              }
            }

            res_html +="</tr>"
            res_html +="<tr>"
            for (i = 7; i < td_list.length;i++) {
              if (i == 7 || i == 8) {
               // formatt values to percentage
               res_html +=
               "<td>" +
               (td_list[i] * 100).toFixed(2) + " %" +
               "</td>";
              } else if(i ==9 || i==10)
              {

              }
              else if (i == 12) {

                // formatt date
                surveydate = new Date(td_list[i])
                res_html +=
                "<td>" +
                  surveydate.toLocaleDateString("en-US") +
                  " </td>";
              } else {

              res_html +=
              "<td>" +
              td_list[i] +
              "</td>";
              }
            }
            res_html +="</tr></table>"
            res_html += "</table>";
            res_html += "<div id=trend></div>";

            //******************************START OF TREND CHART REGION LEVEL********************************/
            enddate = surveydate.toLocaleDateString('ISO');

            var url_covid = signalUrlCreator("covid", "daily", td_list[5], td_list[6], enddate);
            var url_flu = signalUrlCreator("flu", "daily", td_list[5], td_list[6], enddate);
            var url_covid_cases;

            if(td_list[5] == "United States of America") {
              var url_covid_cases = casesUrlCreator(td_list[5], td_list[3], enddate);
            }
            else {
              var url_covid_cases = casesUrlCreator(td_list[5], td_list[6], enddate);
            }
    
            //Regional Covid Trace
            plotCreator("live", url_covid, url_flu, url_covid_cases);
        
            res_html += "</table>";
            res_html += "<div id=trend></div>";
            popup.show(evt.coordinate, res_html);

          } 
          else{
            popup.hide();
          }
        });
    }
  };




  
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

// Functiion to generate URLs to cal the API according ot layer 
// and country or region. 
// Params: indicator, type, country, region, endDate
// Returns: urls string for the API
function signalUrlCreator(indicator, signal, country, region, endDate) {
  var first = "https://covidmap.umd.edu/api/resources?";
  var indic = "indicator=" + indicator;
  var ty = "&type=" + signal;
  var place = "&country=" + country;
  var reg = "&region=" + region;
  var dateRange = "&daterange=20200424-" + endDate;
  var url;

  if(country == "United States of America" && region != null) {
    //USA
    first = "https://covidmap.umd.edu/api/new?";
    url = first.concat(indic, ty, place, reg, dateRange);
    console.log(url);
    return url;
  } 
  else if (region == null) {
    //Country level URL
    url = first.concat(indic, ty, place, dateRange);
    return url;
  }
  else { 
    //Region level URL
    url = first.concat(indic, ty, place, reg, dateRange);
    return url;
  }
}

// Functiion to generate URLs for covid cases.
// Params: country, region, endDate
// Returns: urls string for the API
function casesUrlCreator(country, region, endDate) {
  var first = "https://covidmap.umd.edu/api/cases?";
  var place = "&country=" + country;
  var reg = "&region=" + region;
  var dateRange = "&daterange=20200424-" + endDate;
  var url;

  if (region == null) {
    //Country level URL
    url = first.concat(place, dateRange);
    console.log(url);
    return url;
  }
  else { 
    //Region level URL
    url = first.concat(place, reg, dateRange);
    return url;
  }

}

// Function to create a trend plot
// Params: layer selection (smooth, unw, live), api covid url, api flu url
// This function creates a trend plot according to the layer selected
function plotCreator(layer, url_covid, url_flu, url_cases) {
  var xl_covid = [];
  var yl_covid = [];
  var xl_flu = []
  var yl_flu = []
  
  // Cases Plot
  console.log(url_cases);
  var xl_confirmed_covid = [];
  var yl_confirmed_covid = [];
  Plotly.d3.json(url_cases, function (figure) {
    var data = figure.data;

    data.forEach(element => {
      var a = element.survey_date.toString();
      var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
      xl_confirmed_covid.push(s);
      yl_confirmed_covid.push((element.confirmed));
    });
  })

  var trace_cases = {
    mode: "lines",
    name: 'COVID Confirmed',
    x: xl_confirmed_covid,
    y: yl_confirmed_covid,
    yaxis: 'y2',
    name: 'COVID-19 Cases',
    line: {
      color: '#ed9191',
      width: 1.5,
    },
  }


  if(layer === "smooth") {
    console.log(yl_confirmed_covid);
    //Country Covid Trace
    Plotly.d3.json(url_covid, function (figure) {
      var data = figure.data;

      data.forEach(element => {
        var a = element.survey_date.toString();
        var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
        xl_covid.push(s);
        yl_covid.push((element.smoothed_cli));
      });
      //Country Flu Trace
      Plotly.d3.json(url_flu, function (figure) {
        var data = figure.data;

        data.forEach(element => {
          var a = element.survey_date.toString();
          var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
          xl_flu.push(s);
          yl_flu.push((element.smoothed_ili));
        });

        var trace_covid = {
          mode: "lines",
          name: 'Smoothed CLI',
          x: xl_covid,
          y: yl_covid,
          line: {
            color: '#F3BE95',
            width: 2,
            shape: 'spline',
            smoothing: .15
          },
        }

        var trace_flu = {
          mode: "lines",
          name: 'Smoothed ILI',
          x: xl_flu,
          y: yl_flu,
          line: {
            color: '#95CAF3',
            width: 2,
            shape: 'spline',
            smoothing: .15
          }
        }

        var traces = [trace_covid, trace_flu, trace_cases];

        var layout = {
          xaxis: {
            tickfont: {
              size: 7.5
            },
            autorange: true,
            type: 'date',
            fixedrange: true,
          },
          yaxis: {
            tickformat: '.2%',
            tickfont: {
              size: 7
            },
            autorange: true,
            type: 'linear',
          },
          yaxis2: {
            side: 'right',
            tickformat: '.2s',
            tickfont: {
              size: 7
            },
            autorange: true,
            type: 'linear',
            overlaying: 'y'
          },
          legend: {
            "orientation": "h",
            x: 0,
            y: -.5,
            font: {
              size: 7.5,
            },
          },
          useResizeHandler: true,

          autosize: true,

          style: {
            width: "100%",
            height: "100%"
          },
   
          plot_bgcolor: "#F4F5F6",
          paper_bgcolor: '#F7F6F2',
          margin: {
            l: 30,
            r: 5,
            b: 0,
            t: 10,
            pad: 0
          },
        }
        Plotly.newPlot('trend', traces, layout);
      })
    })
    
  }

  else if(layer === "unw") {
    Plotly.d3.json(url_covid, function (figure) {
      var data = figure.data;

      data.forEach(element => {
        var a = element.survey_date.toString();
        var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
        xl_covid.push(s);
        yl_covid.push((element.percent_cli_unw));
      });
      //Country Flu Trace
      Plotly.d3.json(url_flu, function (figure) {
        var data = figure.data;

        data.forEach(element => {
          var a = element.survey_date.toString();
          var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
          xl_flu.push(s);
          yl_flu.push((element.percent_ili_unw));
        });

        var trace_covid = {
          mode: "lines",
          name: '% CLI Unw',
          x: xl_covid,
          y: yl_covid,
          line: {
            color: '#F3BE95',
            width: 2,
            shape: 'spline',
            smoothing: .15
          },
        }

        var trace_flu = {
          mode: "lines",
          name: '% ILI Unw',
          x: xl_flu,
          y: yl_flu,
          line: {
            color: '#95CAF3',
            width: 2,
            shape: 'spline',
            smoothing: .15
          }
        }

        var traces = [trace_covid, trace_flu, trace_cases];

        var layout = {
          xaxis: {
            tickfont: {
              size: 7.5
            },
            autorange: true,
            type: 'date',
            fixedrange: true,
          },
          yaxis: {
            tickformat: '.2%',
            tickfont: {
              size: 7
            },
            autorange: true,
            type: 'linear',
          },
          yaxis2: {
            side: 'right',
            tickformat: '.2s',
            tickfont: {
              size: 7
            },
            autorange: true,
            type: 'linear',
            overlaying: 'y'
          },
          legend: {
            "orientation": "h",
            x: 0,
            y: -.5,
            font: {
              size: 7.5,
            },
          },
          useResizeHandler: true,
          style: {
            width: "100%",
            height: "100%"
          },
          plot_bgcolor: "#F4F5F6",
          paper_bgcolor: '#F7F6F2',
          margin: {
            l: 30,
            r: 5,
            b: 0,
            t: 10,
            pad: 0
          },
        }
        Plotly.newPlot('trend', traces, layout);
      })
    })

  }
  else {
    Plotly.d3.json(url_covid, function (figure) {
      var data = figure.data;

      data.forEach(element => {
        var a = element.survey_date.toString();
        var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
        xl_covid.push(s);
        yl_covid.push((element.percent_cli));
      });
      //Country Flu Trace
      Plotly.d3.json(url_flu, function (figure) {
        var data = figure.data;

        data.forEach(element => {
          var a = element.survey_date.toString();
          var s = [a.slice(0, 4), a.slice(4, 6), a.slice(6, 8)].join('-');
          xl_flu.push(s);
          yl_flu.push((element.percent_ili));
        });

        var trace_covid = {
          mode: "lines",
          name: '% CLI',
          x: xl_covid,
          y: yl_covid,
          line: {
            color: '#F3BE95',
            width: 2,
            shape: 'spline',
            smoothing: .15
          },
        }

        var trace_flu = {
          mode: "lines",
          name: '% ILI',
          x: xl_flu,
          y: yl_flu,
          line: {
            color: '#95CAF3',
            width: 2,
            shape: 'spline',
            smoothing: .15
          }
        }

        var traces = [trace_covid, trace_flu, trace_cases];

        var layout = {
          xaxis: {
            tickfont: {
              size: 7.5
            },
            autorange: true,
            type: 'date',
            fixedrange: true,
          },
          yaxis: {
            tickformat: '.2%',
            tickfont: {
              size: 7
            },
            autorange: true,
            type: 'linear',
          },
          yaxis2: {
            side: 'right',
            tickformat: '.2s',
            tickfont: {
              size: 7
            },
            autorange: true,
            type: 'linear',
            overlaying: 'y'
          },
          legend: {
            "orientation": "h",
            x: 0,
            y: -.5,
            font: {
              size: 7.5,
            },
          },
          useResizeHandler: true,
          style: {
            width: "100%",
            height: "100%"
          },
          plot_bgcolor: "#F4F5F6",
          paper_bgcolor: '#F7F6F2',
          margin: {
            l: 30,
            r: 5,
            b: 0,
            t: 10,
            pad: 0
          },
        }
        Plotly.newPlot('trend', traces, layout);
      })
    })

  }
  
}
