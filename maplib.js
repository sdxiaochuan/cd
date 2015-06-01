var COPYRIGHT = " Copyright (c) 2010-2012, Advameg, Inc. needs to be included after leaflet maplib 0.1 by Mateusz Bugaj, mods by DŸwiedŸ";
var gmL_BASE_URL = 'http://pics3.city-data.com/js/maps/';
var gmLEAFLET_URL = (typeof window.LEAFLET_URL != 'undefined') ? window.LEAFLET_URL : gmL_BASE_URL + 'leaflet.js';
var gmL_InitCallback;
var gmMIN_ZOOM = 4;
var mL_indexOf = function(arr, obj) {
    for (var i = 0, j = arr.length; i < j; i++) {
        if (arr[i] === obj) return i;
    }
    return -1;
};

function _mlCallInitCallback() {
    if (gmL_InitCallback)
        gmL_InitCallback();
    gmL_InitCallback = null;
}

function mL_LoadMapJS(callbackAfterLoad, direct) {
    gmL_InitCallback = callbackAfterLoad;
    (function() {
        function async_load() {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.onreadystatechange = function() {
                if (this.readyState == 'complete') _mlCallInitCallback();
            }
            s.onload = _mlCallInitCallback;
            s.src = gmLEAFLET_URL;
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }
        if (typeof direct != 'undefined') {
            async_load();
        } else {
            if (window.attachEvent)
                window.attachEvent('onload', async_load);
            else
                window.addEventListener('load', async_load, false);
        }
    })();
}
var gmL_MapsDict = new Array();
var gmL_MapsPropsDict = new Array();

function mL_createMapExt(map, mapHtmlId) {
    var cloudmadeUrl = 'http://{s}.city-data.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
        subDomains = ['mpq1', 'mpq2'],
        cloudmadeAttrib = 'Data, imagery and map information provided by <a  rel="nofollow" href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank"  rel="nofollow">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/"  rel="nofollow" target="_blank">CC-BY-SA</a>';
    var mapquest = new L.TileLayer(cloudmadeUrl, {
        maxZoom: 18,
        attribution: cloudmadeAttrib,
        subdomains: subDomains
    });
    map.addLayer(mapquest);
    gmL_MapsPropsDict[mapHtmlId] = new Array();
    gmL_MapsDict[mapHtmlId] = map;
}

function mL_createMap(mapHtmlId) {
    var map = new L.Map(mapHtmlId, {
        closePopupOnClick: false,
        minZoom: gmMIN_ZOOM
    });
    mL_createMapExt(map, mapHtmlId);
    return map;
}

function mL_createMapFS(mapHtmlId) {
    var map = new L.Map(mapHtmlId, {
        closePopupOnClick: false,
        zoomControl: false,
        minZoom: gmMIN_ZOOM
    });
    map.zoomFS = new L.Control.ZoomFS();
    map.addControl(map.zoomFS);
    mL_createMapExt(map, mapHtmlId);
    return map;
}

function mL_setInitialLocation(mapHtmlId, lat, lon, zoomLevel) {
    var map = gmL_MapsDict[mapHtmlId];
    map.setView(new L.LatLng(lat, lon), zoomLevel);
}
var gmL_MarkersArray = new Array();

function mL_addMarkersToMap(mapHtmlId, markersLatArr, markersLonArr, markersDescArr) {
    var map = gmL_MapsDict[mapHtmlId];
    var markersArr = new Array(markersLatArr.length);
    var MyIcon = L.Icon.extend({
        options: {
            iconUrl: (gmL_BASE_URL + 'images/mm_20_red.png'),
            shadowUrl: gmL_BASE_URL + 'images/mm_20_shadow.png',
            iconSize: new L.Point(12, 20),
            shadowSize: new L.Point(20, 20),
            iconAnchor: new L.Point(6, 20),
            popupAnchor: new L.Point(0, -13)
        }
    });
    var tinyIcon = new MyIcon();
    var latLngArr = new Array();
    if (!gmL_MapsPropsDict[mapHtmlId].markersArray)
        gmL_MapsPropsDict[mapHtmlId].markersArray = new Array();
    for (i = 0; i < markersLatArr.length; ++i) {
        var markerLocation = new L.LatLng(markersLatArr[i], markersLonArr[i]),
            marker = new L.Marker(markerLocation, {
                icon: tinyIcon
            });
        latLngArr[i] = markerLocation;
        map.addLayer(marker);
        if (markersDescArr != undefined)
            marker.bindPopup((markersDescArr instanceof Array) ? markersDescArr[i] : markersDescArr);
        markersArr[i] = gmL_MapsPropsDict[mapHtmlId].markersArray.length;
        gmL_MapsPropsDict[mapHtmlId].markersArray.push(marker);
    }
    if (!gmL_MapsPropsDict[mapHtmlId].markerBounds) {
        gmL_MapsPropsDict[mapHtmlId].markerBounds = new L.LatLngBounds(latLngArr);
    } else {
        var nB = new L.LatLngBounds(latLngArr);
        gmL_MapsPropsDict[mapHtmlId].markerBounds.extend(nB.getNorthWest());
        gmL_MapsPropsDict[mapHtmlId].markerBounds.extend(nB.getSouthEast());
    }
    return markersArr;
}

function mL_setCircleMarkerGroupVisible(mapHtmlId, groupNr, visible) {
    var map = gmL_MapsDict[mapHtmlId];
    if (visible) {
        map.addLayer(gmL_MapsPropsDict[mapHtmlId].circleMarkersGroups[groupNr]);
    } else {
        map.removeLayer(gmL_MapsPropsDict[mapHtmlId].circleMarkersGroups[groupNr]);
    }
}

function mL_addGroupedCircleMarkersToMap(mapHtmlId, letterOrDigit, colorStr, markersLatArr, markersLonArr, markersDescArr) {
    var map = gmL_MapsDict[mapHtmlId];
    var markersArr = new Array(markersLatArr.length);
    var latLngArr = new Array();
    if (!gmL_MapsPropsDict[mapHtmlId].markersArray)
        gmL_MapsPropsDict[mapHtmlId].markersArray = new Array();
    if (!gmL_MapsPropsDict[mapHtmlId].circleMarkersGroups)
        gmL_MapsPropsDict[mapHtmlId].circleMarkersGroups = new Array();
    var groupId = gmL_MapsPropsDict[mapHtmlId].circleMarkersGroups.length;
    var groupObj = new L.LayerGroup();
    gmL_MapsPropsDict[mapHtmlId].circleMarkersGroups.push(groupObj);
    colorStr = colorStr.replace("#", "");
    for (i = 0; i < markersLatArr.length; ++i) {
        var text = !isNaN(letterOrDigit) ? +(i + 1) : "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(i);
        var markerLocation = new L.LatLng(markersLatArr[i], markersLonArr[i]),
            marker = new L.mL_CircleMarker(markerLocation, {
                color: "white",
                fillOpacity: 1,
                fillColor: '#' + colorStr.toUpperCase(),
                textClass: 'm' + colorStr,
                txt: text,
                textStyle: "text-color: white; color: white; fill: white;"
            });
        marker.groupId = groupId;
        latLngArr[i] = markerLocation;
        groupObj.addLayer(marker);
        if (markersDescArr != undefined)
            marker.bindPopup((markersDescArr instanceof Array) ? markersDescArr[i] : markersDescArr);
        markersArr[i] = gmL_MapsPropsDict[mapHtmlId].markersArray.length;
        gmL_MapsPropsDict[mapHtmlId].markersArray.push(marker);
    }
    map.addLayer(groupObj);
    if (!gmL_MapsPropsDict[mapHtmlId].markerBounds) {
        gmL_MapsPropsDict[mapHtmlId].markerBounds = new L.LatLngBounds(latLngArr);
    } else {
        var nB = new L.LatLngBounds(latLngArr);
        gmL_MapsPropsDict[mapHtmlId].markerBounds.extend(nB.getNorthWest());
        gmL_MapsPropsDict[mapHtmlId].markerBounds.extend(nB.getSouthEast());
    }
    return groupId;
}

function mL_addGroupedMarkersToMap(mapHtmlId, markersLatArr, markersLonArr, markersDescArr, groupIconsArray, markerToGroupMapping) {
    var map = gmL_MapsDict[mapHtmlId];
    var markersArr = new Array(markersLatArr.length);
    var icons = new Array(groupIconsArray.length);
    var groups = new Array(groupIconsArray.length);
    for (i = 0; i < groupIconsArray.length; ++i) {
        var MyIcon = L.Icon.extend({
            options: {
                iconUrl: (gmL_BASE_URL + 'images/' + groupIconsArray[i]),
                shadowUrl: gmL_BASE_URL + 'images/mm_20_shadow.png',
                iconSize: new L.Point(12, 20),
                shadowSize: new L.Point(20, 20),
                iconAnchor: new L.Point(6, 20),
                popupAnchor: new L.Point(0, -13)
            }
        });
        icons[i] = new MyIcon();
        groups[i] = new L.LayerGroup();
    }
    var latLngArr = new Array();
    if (!gmL_MapsPropsDict[mapHtmlId].markersArray)
        gmL_MapsPropsDict[mapHtmlId].markersArray = new Array();
    for (i = 0; i < markersLatArr.length; ++i) {
        var groupId = markerToGroupMapping[i];
        var markerLocation = new L.LatLng(markersLatArr[i], markersLonArr[i]),
            marker = new L.Marker(markerLocation, {
                icon: icons[groupId]
            });
        marker.groupId = groupId;
        latLngArr[i] = markerLocation;
        groups[groupId].addLayer(marker);
        if (markersDescArr != undefined)
            marker.bindPopup((markersDescArr instanceof Array) ? markersDescArr[i] : markersDescArr);
        markersArr[i] = gmL_MapsPropsDict[mapHtmlId].markersArray.length;
        gmL_MapsPropsDict[mapHtmlId].markersArray.push(marker);
    }
    gmL_MapsPropsDict[mapHtmlId].markerGroups = groups;
    for (i = 0; i < groups.length; ++i) {
        map.addLayer(groups[i]);
    }
    if (!gmL_MapsPropsDict[mapHtmlId].markerBounds) {
        gmL_MapsPropsDict[mapHtmlId].markerBounds = new L.LatLngBounds(latLngArr);
    } else {
        var nB = new L.LatLngBounds(latLngArr);
        gmL_MapsPropsDict[mapHtmlId].markerBounds.extend(nB.getNorthWest());
        gmL_MapsPropsDict[mapHtmlId].markerBounds.extend(nB.getSouthEast());
    }
    return markersArr;
}

function mL_setMarkerGroupVisible(mapHtmlId, groupNr, visible) {
    var map = gmL_MapsDict[mapHtmlId];
    if (visible) {
        map.addLayer(gmL_MapsPropsDict[mapHtmlId].markerGroups[groupNr]);
    } else {
        map.removeLayer(gmL_MapsPropsDict[mapHtmlId].markerGroups[groupNr]);
    }
}

function mL_setMapWindowFromMarkersBounds(mapHtmlId) {
    var map = gmL_MapsDict[mapHtmlId];
    if (gmL_MapsPropsDict[mapHtmlId].markerBounds)
        map.fitBounds(gmL_MapsPropsDict[mapHtmlId].markerBounds);
}

function mL_showMarkersPopup(mapHtmlId, markerId) {
    var map = gmL_MapsDict[mapHtmlId];
    gmL_MapsPropsDict[mapHtmlId].markersArray[markerId].openPopup();
}

function mL_getPolygonCentroid(points) {
    var area = 0;
    var w = 0;
    var p = {
        x: 0,
        y: 0
    };;
    for (var i = 0; i < points.length; i++) {
        var j = (i + 1) % points.length;
        area += (points[j].lng - points[i].lng) * (points[j].lat + points[i].lat) / 2;
        w = points[i].lng * points[j].lat - points[j].lng * points[i].lat;
        p.x += (points[i].lng + points[j].lng) * w;
        p.y += (points[i].lat + points[j].lat) * w;
    }
    p.x /= 6 * area;
    p.y /= 6 * area;
    if (p.y < 0) {
        p.x = -p.x;
        p.y = -p.y;
    }
    if (isNaN(p.y) || isNaN(p.x))
        return points[0];
    p = new L.LatLng(p.y, p.x);
    return p;
}

function mL_match(poly) {
    if (1 || typeof window.opera != 'undefined') return poly.match(/[\_-\~]*[\?-\^]/g);
    if (!poly.length) return [];
    var tab = [''];
    for (var p = 0; p < poly.length; p++) {
        tab[tab.length - 1] += poly[p];
        if (poly[p] >= '?' && poly[p] <= '^') tab.push('');
    }
    return tab;
}

function mL_decodeLatLonStringSkipEx(encTab, skip) {
    var ret = new Array(encTab.length - skip.length);
    var skipped = 0;
    for (var zzj = 0; zzj < encTab.length; ++zzj) {
        if (mL_indexOf(skip, zzj) != -1) {
            skipped++;
            continue;
        }
        var zj = zzj - skipped;
        if (encTab[zzj].indexOf("$") != -1) {
            ret[zj] = mL_decodeLatLonString(encTab[zzj].split('$'));
            continue;
        }
        var poly = encTab[zzj];
        var i = -1,
            j = -1,
            k, l, q = mL_match(poly),
            w = 0,
            x = 0,
            y = 0,
            z = 1e-5;
        ret[zj] = new Array();
        if (q)
            for (;;) {
                if (!q[++i]) break;
                l = 63;
                w = 0;
                for (k = q[i].length - 1; k >= 0; k--) {
                    w = (w << 5) + q[i].charCodeAt(k) - l;
                    l = 95;
                }
                y += (w << 31 >> 31) ^ (w >> 1);
                if (!q[++i]) break;
                l = 63, w = 0;
                for (k = q[i].length - 1; k >= 0; k--) {
                    w = (w << 5) + q[i].charCodeAt(k) - l;
                    l = 95;
                }
                x += (w << 31 >> 31) ^ (w >> 1);
                ret[zj].push(new L.LatLng(Math.round(y * z * 1000000) / 1000000, Math.round(x * z * 1000000) / 1000000));
            }
        if (ret[zj].length == 2) {
            var minLat = ret[zj][0].lat;
            var maxLat = ret[zj][1].lat;
            var minLng = ret[zj][0].lng;
            var maxLng = ret[zj][1].lng;
            ret[zj].splice(1, 0, new L.LatLng(maxLat, minLng));
            ret[zj].push(new L.LatLng(minLat, maxLng));
            ret[zj].push(new L.LatLng(minLat, minLng));
        }
    }
    return ret;
}

function mL_decodeLatLonString(encTab) {
    var ret = new Array(encTab.length);
    for (var zj = 0; zj < encTab.length; ++zj) {
        if (encTab[zj].indexOf("$") != -1) {
            ret[zj] = mL_decodeLatLonString(encTab[zj].split('$'));
            continue;
        }
        var i = -1,
            j = -1,
            k, l, w = 0,
            x = 0,
            y = 0,
            z = 1e-5;
        var q = mL_match(encTab[zj]);
        ret[zj] = new Array();
        if (q)
            for (;;) {
                if (!q[++i]) break;
                l = 63;
                w = 0;
                for (k = q[i].length - 1; k >= 0; k--) {
                    w = (w << 5) + q[i].charCodeAt(k) - l;
                    l = 95;
                }
                y += (w << 31 >> 31) ^ (w >> 1);
                if (!q[++i]) break;
                l = 63, w = 0;
                for (k = q[i].length - 1; k >= 0; k--) {
                    w = (w << 5) + q[i].charCodeAt(k) - l;
                    l = 95;
                }
                x += (w << 31 >> 31) ^ (w >> 1);
                ret[zj].push(new L.LatLng(Math.round(y * z * 1000000) / 1000000, Math.round(x * z * 1000000) / 1000000));
            }
        if (ret[zj].length == 2) {
            var minLat = ret[zj][0].lat;
            var maxLat = ret[zj][1].lat;
            var minLng = ret[zj][0].lng;
            var maxLng = ret[zj][1].lng;
            ret[zj].splice(1, 0, new L.LatLng(maxLat, minLng));
            ret[zj].push(new L.LatLng(minLat, maxLng));
            ret[zj].push(new L.LatLng(minLat, minLng));
        }
    }
    return ret;
}

function mL_decodeLatLonStringSkip(encTab, skip) {
    var ret = new Array(encTab.length - skip.length);
    var skipped = 0;
    for (var zzj = 0; zzj < encTab.length; ++zzj) {
        if (mL_indexOf(skip, zzj) != -1) {
            skipped++;
            continue;
        }
        var zj = zzj - skipped;
        var poly = encTab[zj];
        var i = -1,
            j = -1,
            k, l, q = mL_match(poly),
            w = 0,
            x = 0,
            y = 0,
            z = 1e-5;
        ret[zj] = new Array();
        if (q)
            for (;;) {
                if (!q[++i]) break;
                l = 63;
                w = 0;
                for (k = q[i].length - 1; k >= 0; k--) {
                    w = (w << 5) + q[i].charCodeAt(k) - l;
                    l = 95;
                }
                y += (w << 31 >> 31) ^ (w >> 1);
                if (!q[++i]) break;
                l = 63, w = 0;
                for (k = q[i].length - 1; k >= 0; k--) {
                    w = (w << 5) + q[i].charCodeAt(k) - l;
                    l = 95;
                }
                x += (w << 31 >> 31) ^ (w >> 1);
                ret[zj].push(new L.LatLng(y * z, x * z));
            }
        if (ret[zj].length == 2) {
            var minLat = ret[zj][0].lat;
            var maxLat = ret[zj][1].lat;
            var minLng = ret[zj][0].lng;
            var maxLng = ret[zj][1].lng;
            ret[zj].splice(1, 0, new L.LatLng(maxLat, minLng));
            ret[zj].push(new L.LatLng(minLat, maxLng));
            ret[zj].push(new L.LatLng(minLat, minLng));
        }
    }
    return ret;
}

function mL_mergeLatLonTabs(latTab, lonTab) {
    var llArr = new Array(latTab.length);
    for (var i = 0; i < latTab.length; ++i) {
        llArr[i] = new Array(latTab[i].length);
        for (var k = 0; k < latTab[i].length; ++k)
            llArr[i][k] = new L.LatLng(latTab[i][k], lonTab[i][k]);
    }
    return llArr;
}

function mL_transcribeStyle(styles) {
    if (typeof styles == "string") styles = styles.replace(/[' ]/g, "").split(',');
    return {
        color: styles[0],
        weight: styles[1],
        opacity: styles[2],
        fillColor: styles[3],
        fillOpacity: styles[4]
    };
}

function mL_layerToFront(mapHtmlId, layers) {
    var map = gmL_MapsDict[mapHtmlId];
    for (var l = 0; l < layers.length; l++) {
        var layer = layers[l];
        if (layer === null || typeof layer._map == 'undefined' || layer._map === null) continue;
        layer.bringToFront();
    }
}

function mL_addEncodedPolygons(mapHtmlId, encTab, style, descs, labels) {
    var latlons = mL_decodeLatLonString(encTab);
    return mL_addRawPoly(mapHtmlId, true, latlons, style, descs, labels, "");
}

function mL_addEncodedPolylines(mapHtmlId, encTab, style, descs, labels) {
    var latlons = mL_decodeLatLonString(encTab);
    return mL_addRawPoly(mapHtmlId, false, latlons, style, descs, labels, "");
}

function mL_addRawPolygons(mapHtmlId, latTab, lonTab, style, descs, labels) {
    var latlons = mL_mergeLatLonTabs(latTab, lonTab);
    return mL_addRawPoly(mapHtmlId, true, latlons, style, descs, labels, "");
}

function mL_addRawPolylines(mapHtmlId, latTab, lonTab, style, descs, labels) {
    var latlons = mL_mergeLatLonTabs(latTab, lonTab);
    return mL_addRawPoly(mapHtmlId, false, latlons, style, descs, labels, "");
}

function mL_addPolyMouseEvents(l) {
    if (typeof l._meAdded != 'undefined' && l._meAdded) return;
    l._meAdded = true;
    if (typeof handleGroupPolyOver == 'function') l.on("mouseover", handleGroupPolyOver);
    if (typeof handleGroupPolyOut == 'function') l.on("mouseout", handleGroupPolyOut);
}

function mL_removePolyMouseEvents(l) {
    l._meAdded = false;
    if (typeof handleGroupPolyOver == 'function') l.off("mouseover", handleGroupPolyOver);
    if (typeof handleGroupPolyOut == 'function') l.off("mouseout", handleGroupPolyOut);
}

function mL_addRawPoly(mapHtmlId, fill, llArr, style, descs, labels, groupID, skipAdd) {
    var SKIP_PROPS = (mapHtmlId == "mapOSM");
    var map = gmL_MapsDict[mapHtmlId];
    var prp = gmL_MapsPropsDict[mapHtmlId];
    var polysArr = new Array(llArr.length);
    var objType = (fill) ? "polygonsArray" + groupID : "polylinesArray" + groupID;
    if (!SKIP_PROPS && !prp[objType])
        prp[objType] = new Array();
    if (!prp.polyBounds)
        prp.polyBounds = new L.LatLngBounds();
    var topLayer = map;
    if (groupID != "") {
        topLayer = (typeof prp['featureGroup' + groupID] != 'undefined') ? prp['featureGroup' + groupID] : new L.FeatureGroup();
    }
    for (var i = 0; i < llArr.length; ++i) {
        var label = (labels instanceof Array) ? ((i < labels.length) ? labels[i] : labels[0]) : labels;
        var desc = (descs instanceof Array) ? ((i < descs.length) ? descs[i] : descs[0]) : descs;
        var styl = (style instanceof Array) ? ((i < style.length) ? style[i] : style[0]) : style;
        if (typeof llArr[i][0].length == 'undefined') {
            if (llArr[i][0] != llArr[i][llArr[i].length - 1]) llArr[i].push(llArr[i][0]);
        } else {
            for (var m = 0; m < llArr[i].length; ++m)
                if (llArr[i][m][0] != llArr[i][m][llArr[i][m].length - 1]) llArr[i][m].push(llArr[i][m][0]);
        }
        styl = mL_transcribeStyle(styl);
        styl.smoothFactor = 0.0;
        styl.noClip = true;
        var poly = fill ? (typeof llArr[i][0].length != 'undefined' ? new L.MultiPolygon(llArr[i], styl) : new L.Polygon(llArr[i], styl)) : (typeof llArr[i][0].length != 'undefined' ? new L.MultiPolyline(llArr[i], styl) : new L.Polyline(llArr[i], styl));
        poly.mLcentroid = mL_getPolygonCentroid(llArr[i]);
        prp.polyBounds.extend(poly.getBounds().getSouthWest());
        prp.polyBounds.extend(poly.getBounds().getNorthEast());
        if (label != undefined)
            poly.mL_label = new L.mL_Label(poly.mLcentroid, 1000, label, {
                widthR: 3
            });
        if (typeof desc != 'undefined') {
            poly.bindPopup(desc, {
                'maxHeight': 250,
                autoPan: true,
                keepInView: true
            });
            if (poly.mL_label)
                poly.mL_label.bindPopup(desc);
        }
        if (!SKIP_PROPS) {
            polysArr[i] = prp[objType].length;
            prp[objType].push(poly);
        }
        topLayer.addLayer(poly);
        if (poly.mL_label)
            topLayer.addLayer(poly.mL_label);
        if (poly.mL_marker)
            topLayer.addLayer(poly.mL_marker);
    }
    if (groupID != "") {
        if (!map.hasLayer(topLayer)) {
            if (typeof desc != 'undefined')
                mL_addPolyMouseEvents(topLayer);
            if (typeof skipAdd == 'undefined' || !skipAdd)
                map.addLayer(topLayer);
        }
        gmL_MapsPropsDict[mapHtmlId]['featureGroup' + groupID] = topLayer;
        return topLayer;
    }
    return polysArr;
}

function mL_showPolygonPopup(mapHtmlId, polygonId) {
    var map = gmL_MapsDict[mapHtmlId];
    var poly = gmL_MapsPropsDict[mapHtmlId].polygonsArray[polygonId];
    poly._openPopup({
        latlng: poly.mLcentroid
    });
}

function mL_showPolylinePopup(mapHtmlId, polylineId) {
    var map = gmL_MapsDict[mapHtmlId];
    var poly = gmL_MapsPropsDict[mapHtmlId].polylinesArray[polygonId];
    poly._openPopup({
        latlng: poly.mLcentroid
    });
}

function mL_setPolyVisibility(mapHtmlId, polygon, polyId, visible) {
    var map = gmL_MapsDict[mapHtmlId];
    var poly = gmL_MapsPropsDict[mapHtmlId][polygon ? 'polygonsArray' : 'polylinesArray'][polyId];
    if (visible) {
        if (poly.mL_label) {
            map.addLayer(poly.mL_label);
        }
        map.addLayer(poly);
    } else {
        map.closePopup();
        if (poly.mL_label) {
            map.removeLayer(poly.mL_label);
        }
        map.removeLayer(poly);
    }
}

function mL_setPolygonVisibility(mapHtmlId, polyId, visible) {
    mL_setPolyVisibility(mapHtmlId, true, polyId, visible);
}

function mL_setPolylineVisibility(mapHtmlId, polyId, visible) {
    mL_setPolyVisibility(mapHtmlId, false, polyId, visible);
}

function mL_setPolyOptions(mapHtmlId, polygon, polyId, options) {
    var map = gmL_MapsDict[mapHtmlId];
    var poly = gmL_MapsPropsDict[mapHtmlId][polygon ? 'polygonsArray' : 'polylinesArray'][polyId];
    poly.setStyle(options);
}

function mL_setPolygonOptions(mapHtmlId, polyId, options) {
    mL_setPolyOptions(mapHtmlId, true, polyId, options);
}

function mL_setPolylineOptions(mapHtmlId, polyId, options) {
    mL_setPolyOptions(mapHtmlId, false, polyId, options);
}

function mL_setMapWindowFitContents(mapHtmlId) {
    var finalBnds = new L.LatLngBounds();
    var map = gmL_MapsDict[mapHtmlId];
    var ext = false;
    if (gmL_MapsPropsDict[mapHtmlId].polyBounds) {
        finalBnds.extend(gmL_MapsPropsDict[mapHtmlId].polyBounds.getNorthWest());
        finalBnds.extend(gmL_MapsPropsDict[mapHtmlId].polyBounds.getSouthEast());
        ext = true;
    }
    if (gmL_MapsPropsDict[mapHtmlId].markerBounds) {
        finalBnds.extend(gmL_MapsPropsDict[mapHtmlId].markerBounds.getNorthWest());
        finalBnds.extend(gmL_MapsPropsDict[mapHtmlId].markerBounds.getSouthEast());
        ext = true;
    }
    if (ext)
        map.fitBounds(finalBnds);
    mL_fitLabelsSizeToMapBounds(mapHtmlId);
}

function mL_fitLabelsSizeToMapBounds(mapHtmlId, pixelHeight) {
    var map = gmL_MapsDict[mapHtmlId];
    var h = map.getSize().y;
    if (pixelHeight == undefined) {
        pixelHeight = 8;
    }
    if (L.Browser.ie6) {
        pixelHeight = pixelHeight - 2;
    }
    var partOfMapHeight = pixelHeight / h;
    var bds = map.getBounds();
    var p1 = bds.getNorthWest();
    var p2 = bds.getSouthEast();
    var hDist = Math.abs(p2.lng - p1.lng);
    var equatorLength = 40075017,
        hLength = equatorLength * Math.cos(L.LatLng.DEG_TO_RAD * p1.lat);
    hDist = hLength * hDist / 360.0;
    var r = Math.round(hDist * partOfMapHeight);
    var prop = gmL_MapsPropsDict[mapHtmlId];
    for (p in prop) {
        if (Object.prototype.toString.call(prop[p]) !== '[object Array]') continue;
        for (var i = prop[p].length - 1; i >= 0; i--) {
            if (typeof prop[p][i].mL_label != 'undefined')
                prop[p][i].mL_label.setRadius(r);
        };
    }
}

function mL_setMapWindowFromPolysBounds(mapHtmlId) {
    var map = gmL_MapsDict[mapHtmlId];
    if (gmL_MapsPropsDict[mapHtmlId].polyBounds)
        map.fitBounds(gmL_MapsPropsDict[mapHtmlId].polyBounds);
}

function computeAngle(endLatLng, startLatLng) {
    var DEGREE_PER_RADIAN = 57.2957795;
    var RADIAN_PER_DEGREE = 0.017453;
    var dlat = endLatLng.lat() - startLatLng.lat();
    var dlng = endLatLng.lng() - startLatLng.lng();
    var yaw = Math.atan2(dlng * Math.cos(endLatLng.lat() * RADIAN_PER_DEGREE), dlat) * DEGREE_PER_RADIAN;
    return wrapAngle(yaw);
}

function wrapAngle(angle) {
    if (angle >= 360) {
        angle -= 360;
    } else if (angle < 0) {
        angle += 360;
    }
    return angle;
};
showGoogleSView = function(geo, pfix) {
    if (typeof google == 'undefined' || typeof google.maps == 'undefined' || typeof google.maps.StreetViewPanorama == 'undefined') {
        showGoogleStreetViewWrap = function() {
            showGoogleSView(geo, pfix);
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCO1O5Uav8MpWtP7uTwLw78qZC55sOBCLU&sensor=false&callback=showGoogleStreetViewWrap";
        document.body.appendChild(script);
        return;
    }
    var ADD = (typeof pfix == 'undefined') ? "" : pfix;
    var gType = Object.prototype.toString.call(geo);
    if (gType === '[object Array]')
        geo = new google.maps.LatLng(geo[0], geo[1]);
    else if (gType === '[object String]')
        return new google.maps.Geocoder().geocode({
            'address': geo
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) showGoogleSView(results[0].geometry.location);
        });
    var googleStreetViewDiv = document.getElementById('googleStreetView' + ADD);
    if (googleStreetViewDiv === null) return;
    googleStreetViewDiv.style.display = 'block';
    document.getElementById('showStreetViewMSG' + ADD).style.display = 'none';
    if (typeof swGaCategory != 'undefined') _gaq.push(['_trackEvent', 'street_view', swGaCategory]);
    if (document.getElementById('googleStreetViewOuter') !== null)
        window.location = "#googleStreetViewOuter";
    else
        window.location = "#googleStreetView" + ADD;
    var client = new google.maps.StreetViewService();
    client.getPanoramaByLocation(geo, 100, function(panoData, StreetViewStatus) {
        if (StreetViewStatus == google.maps.StreetViewStatus.OK) {
            googleStreetViewDiv.style.display = 'block';
            var angle = computeAngle(geo, panoData.location.latLng);
            var panoramaOptions = {
                pano: panoData.location.pano,
                position: geo,
                enableCloseButton: true,
                visible: true,
                pov: {
                    heading: angle,
                    pitch: 0,
                    zoom: 1
                }
            };
            window.panorama = new google.maps.StreetViewPanorama(googleStreetViewDiv, panoramaOptions);
            return;
        }
        googleStreetViewDiv.style.display = 'none';
        document.getElementById('showStreetViewMSG' + ADD).style.display = 'block';
    });
}

function mL_changeMarkersIcon(mapHtmlId, p1, p2) {
    var markerIndex = p1;
    var iconName = p2;
    if (typeof p1 == "string") {
        iconName = p1;
        markerIndex = -1;
    }
    var map = gmL_MapsDict[mapHtmlId];
    var baseUrl = 'http://pics3.city-data.com/js/maps/';
    var MyIcon = L.Icon.extend({
        options: {
            iconUrl: (baseUrl + 'images/mm_20_' + iconName + '.png'),
            shadowUrl: baseUrl + 'images/mm_20_shadow.png',
            iconSize: new L.Point(12, 20),
            shadowSize: new L.Point(20, 20),
            iconAnchor: new L.Point(6, 20),
            popupAnchor: new L.Point(0, -13)
        }
    });
    var tinyIcon = new MyIcon();
    if (markerIndex < 0) {
        for (var i = gmL_MapsPropsDict[mapHtmlId].markersArray.length - 1; i >= 0; i--) {
            var marker = gmL_MapsPropsDict[mapHtmlId].markersArray[i];
            marker.setIcon(tinyIcon);
        }
    } else {
        var marker = gmL_MapsPropsDict[mapHtmlId].markersArray[markerIndex];
        marker.setIcon(tinyIcon);
    }
}
if (typeof mL_loadedUserCallback === 'function') mL_loadedUserCallback();