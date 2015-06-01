try {
    document.domain = "city-data.com";
} catch (e) {}
var boxMAP_VERSION = '';
var leaflet_DATE = '';
var reqID = 0;
var rspID = 0;
var mapBOX = 'mapOSM';
var ST_ZOOM_LEVEL = 7;
var CT_ZOOM_LEVEL = 11;
var BG_ZOOM_LEVEL = 13;
var BK_ZOOM_LEVEL = 16;
var poly2fips = [];
var fips2poly = [];
var layerGroups = [];
var brdLayer = null;
var lblLayer = null;
var cityPoly = null;
var selectedPoly = null;
var serieCache = [];
var noDataColor = "#AAAAAA";
var hideNoData = 1;
var skipPolys = [];
var polyFIPS = [];
var distCACHE = [];
var raceTab = ["", " (White)", " (Black)", " (Asian)", " (Hispanic)", " (American Indian)", " (Multirace)", " (Other)"];
var LAST_AJAX_REQUEST = "";
var LAST_AJAX_RESPONSE = "";
var CACHE_IT = 1;
var SEARCH_REQ = 0;
var DEL_LAYERS = 1;
var CUR_ZOOM_LEVEL = 0;
var MAIN_PROJ = getMainProject();
var boxMapSerieToTitle = [];
var DIST_CNT_VS = 0;
var DIST_CNT_US = 0;
var MAP_WIDTH = document.getElementById(mapBOX).clientWidth;
var jQl = {
    q: [],
    dq: [],
    gs: [],
    ready: function(a) {
        "function" == typeof a && jQl.q.push(a);
        return jQl
    },
    getScript: function(a, c) {
        jQl.gs.push([a, c])
    },
    unq: function() {
        for (var a = 0; a < jQl.q.length; a++) jQl.q[a]();
        jQl.q = []
    },
    ungs: function() {
        for (var a = 0; a < jQl.gs.length; a++) jQuery.getScript(jQl.gs[a][0], jQl.gs[a][1]);
        jQl.gs = []
    },
    bId: null,
    boot: function(a) {
        "undefined" == typeof window.jQuery.fn ? jQl.bId || (jQl.bId = setInterval(function() {
            jQl.boot(a)
        }, 25)) : (jQl.bId && clearInterval(jQl.bId), jQl.bId = 0, jQl.unqjQdep(), jQl.ungs(), jQuery(jQl.unq()), "function" == typeof a && a())
    },
    booted: function() {
        return 0 === jQl.bId
    },
    loadjQ: function(a, c) {
        setTimeout(function() {
            var b = document.createElement("script");
            b.src = a;
            document.getElementsByTagName("head")[0].appendChild(b)
        }, 1);
        jQl.boot(c)
    },
    loadjQdep: function(a) {
        jQl.loadxhr(a, jQl.qdep)
    },
    qdep: function(a) {
        a && ("undefined" !== typeof window.jQuery.fn && !jQl.dq.length ? jQl.rs(a) : jQl.dq.push(a))
    },
    unqjQdep: function() {
        if ("undefined" == typeof window.jQuery.fn) setTimeout(jQl.unqjQdep, 50);
        else {
            for (var a = 0; a < jQl.dq.length; a++) jQl.rs(jQl.dq[a]);
            jQl.dq = []
        }
    },
    rs: function(a) {
        var c = document.createElement("script");
        document.getElementsByTagName("head")[0].appendChild(c);
        c.text = a
    },
    loadxhr: function(a, c) {
        var b;
        b = jQl.getxo();
        b.onreadystatechange = function() {
            4 != b.readyState || 200 != b.status || c(b.responseText, a)
        };
        try {
            b.open("GET", a, !0), b.send("")
        } catch (d) {}
    },
    getxo: function() {
        var a = !1;
        try {
            a = new XMLHttpRequest
        } catch (c) {
            for (var b = ["MSXML2.XMLHTTP.5.0", "MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], d = 0; d < b.length; ++d) {
                try {
                    a = new ActiveXObject(b[d])
                } catch (e) {
                    continue
                }
                break
            }
        } finally {
            return a
        }
    }
};
if ("undefined" == typeof window.jQuery) {
    var $ = jQl.ready,
        jQuery = $;
    $.getScript = jQl.getScript
};
var stateBorders = null;
var dEpST = {
    "LOW": null,
    "MED": null,
    "HIGH": null
};
var stSTYLE = "'#DEC106', 0.5, 0.75,'#000000',0";
var dEpST_LVL = null;
window._isFullscreenFix = false;
var naFLAG = "N/A";
var ldFLAG = "Loading...";
var opacit = 0.50;
var isIE = (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent));
var DL_OSM = {
    'st': 'states',
    'sct': 'counties',
    'ct': 'counties',
    'c': 'cities',
    't': 'tracts',
    'bg': 'block groups',
    'b': 'blocks'
};
var distUSdata = 1;
var distViewSortedVW = [];
var distViewSortedUS = [];
var distViewPolys = [];
var distViewMathingPolys = null;
var markedPoly = null;
var distViewBucket = 0;
var distViewMinValG = 0;
var distViewMaxValG = 0;
var distViewVAL = null;
var distViewRS = 1;
var distSKIP = ['st', 'bb'];
var maxBounds = null;
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
var arr_indexOf = function(arr, obj) {
    for (var i = 0, j = arr.length; i < j; i++) {
        if (arr[i] === obj) return i;
    }
    return -1;
};
var sort_unique = function(t) {
    t.sort(function(a, b) {
        return b - a;
    });
    var ret = [t[0]];
    for (var i = 1; i < t.length; i++)
        if (t[i - 1] !== t[i]) ret.push(t[i]);
    return ret;
};
var DEBUG = document.getElementById("debug");
var LGD = document.getElementById("mapOSM_legend");

function DebugMSG(msg) {
    if (typeof window.skipDbgMessages != 'undefined' && window.skipDbgMessages) return;
    if (DEBUG === null) {
        return;
    }
    if (msg == "CLEAR") {
        DEBUG.innerHTML = '';
        return;
    }
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;
    var sTag = "";
    var eTag = "";
    if (typeof window.bgMODE != 'undefined' && window.bgMODE == 1) {
        sTag = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small style='color:#777;'>";
        eTag = "</small>";
    }
    DEBUG.innerHTML = sTag + "<b>" + hours + ":" + minutes + ":" + seconds + "</b> " + msg + eTag + DEBUG.innerHTML;
}

function EventLogGA(evt, args) {
    DebugMSG("_gaq.push(['_trackEvent','OSMMap', '" + evt + "', '" + args + "']);<br/>");
    if (typeof _gaq == 'undefined') return;
    _gaq.push(['_trackEvent', 'OSMMap', evt, args]);
}
Function.prototype.trace = function() {
    var s, u = [],
        t = [],
        c = this;
    while (c) {
        s = c.signature();
        if (typeof u[s.name] != 'undefined') break;
        u[s.name] = 1;
        t.push(s);
        c = c.caller;
    }
    return t;
};
Function.prototype.signature = function() {
    var sig = {
        name: this.getName(),
        params: [],
        toString: function() {
            var params = this.params.length > 0 ? "'" + this.params.join("', '") + "'" : "";
            return this.name + "(" + params + ")"
        }
    };
    if (this.arguments) {
        for (var x = 0; x < this.arguments.length; x++) sig.params.push(this.arguments[x]);
    }
    return sig;
};
Function.prototype.getName = function() {
    if (this.name) return this.name;
    var def = this.toString().split("\n")[0];
    var exp = /^function ([^\s(]+).+/;
    if (exp.test(def)) return def.split("\n")[0].replace(exp, "$1") || "anonymous";
    return "anonymous";
};

function printStackTrace() {
    var callstack = [];
    var lines = [];
    var isCallstackPopulated = false;
    try {
        i.dont.exist += 0;
    } catch (e) {
        if (e.stack) {
            lines = e.stack.split("\n");
            for (var i = 0, len = lines.length; i < len; i++) {
                if (1 || lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                    callstack.push(lines[i]);
                }
            }
            isCallstackPopulated = true;
        } else if (window.opera && e.message) {
            lines = e.message.split("\n");
            for (var i = 0, len = lines.length; i < len; i++) {
                if (1 || lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                    var entry = lines[i];
                    if (lines[i + 1]) {
                        entry += " at " + lines[i + 1];
                        i++;
                    }
                    callstack.push(entry);
                }
            }
            isCallstackPopulated = true;
        }
    }
    if (!isCallstackPopulated) {
        var currentFunction = arguments.callee.caller;
        while (currentFunction) {
            var fn = currentFunction.toString();
            var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf("(")) || "anonymous";
            callstack.push(fname);
            currentFunction = currentFunction.caller;
        }
    }
    return callstack.join("\n");
}

function getMainProject() {
    var loc = window.location.toString();
    if (typeof window.getBoxesDIR != 'undefined' && window.getBoxesDIR == "/city/")
        loc = 'city';
    else if (loc.indexOf("com/city/") != -1 || loc.indexOf("com/county/") != -1)
        loc = 'city';
    else if (loc.indexOf("com/real-estate") != -1)
        loc = 'housing';
    else if (loc.indexOf("zips") == -1) {
        loc = loc.split("/");
        loc = loc[loc.length - 1];
        loc = loc.split("-")[0];
    } else loc = "city";
    loc = loc.replace("houses", "housing");
    loc = loc.replace("cd", "city");
    loc = loc.replace("neigh", "city");
    return loc;
}

function fillMissing(pv, length) {
    while (pv.length < length) pv.push(ldFLAG);
}

function fillMissingCol(pc, length) {
    while (pc.length < length) pc.push(noDataColor);
}

function valSplit(pv, lv, aSerie) {
    pv = pv.split(",");
    pv.pop();
    var ajaxSerie = aSerie.toString().replace(MAIN_PROJ, "");
    var vKEY = lv + ajaxSerie,
        fKEY = 'featureGroup' + lv,
        prp = gmL_MapsPropsDict[mapBOX],
        sSerie = getSelectOption(ajaxSerie).innerHTML;
    var dFIPS = (typeof window.dataFIPS != 'undefined' && window.dataFIPS !== null);
    var createSerieCache = (typeof prp[fKEY] != 'undefined' && typeof serieCache[vKEY] == 'undefined');
    if (dFIPS) {
        var pLEN = prp[fKEY].length,
            vTAB = (typeof serieCache[vKEY] != 'undefined') ? serieCache[vKEY].pv : [],
            polys = prp[fKEY].getLayers();
        fillMissing(vTAB, pLEN);
        var fTAB = window.dataFIPS,
            pIDX, FIPS;
        for (var d = 0; d < fTAB.length; d++) {
            FIPS = fTAB[d], pIDX = fips2poly[lv + FIPS];
            vTAB[pIDX] = pv[d];
            MarkPolySerieLoaded(polys[pIDX], lv, aSerie);
        }
        window.dataFIPS = null;
        pv = vTAB;
    } else if (createSerieCache) {
        var pLEN = prp[fKEY].length,
            vTAB = [];
        fillMissing(vTAB, pLEN);
        serieCache[vKEY] = {
            'boxType': lv,
            'serie': ajaxSerie,
            'pv': vTAB,
            'serieName': sSerie,
            'reqID': reqID
        };
    } else if (typeof serieCache[vKEY] == 'undefined') {} else {
        var pLEN = prp[fKEY].length;
        fillMissing(serieCache[vKEY].pv, pLEN);
    }
    if (typeof window.bgMODE == 'undefined' || window.bgMODE == 0)
        DebugMSG("PV[" + pv.length + "] LOADED[S=" + ajaxSerie + "]    reqID = " + reqID + ")<br/>\n");
    reqID++;
    pv = {
        'boxType': lv,
        'serie': ajaxSerie,
        'pv': pv,
        'serieName': sSerie,
        'reqID': reqID
    };
    window.LAST_PV = pv;
    return pv;
}

function switchInteraction(osmMAP, state) {
    if (osmMAP.interactionMode == state) return;
    if (state === false) {
        if ((0 || ieVer > 8) && gDist !== null && gDist.selCircle !== null) SetStyleValue(gDist.selCircle.style, 'visibility', 'hidden');
        osmMAP._skipZoom = true;
        osmMAP.skipPopup = true;
        osmMAP.interactionMode = false;
        if (typeof osmMAP.doubleClickZoom != 'undefined') osmMAP.doubleClickZoom.disable();
        if (typeof osmMAP.touchZoom != 'undefined') osmMAP.touchZoom.disable();
        if (typeof osmMAP.boxZoom != 'undefined') osmMAP.boxZoom.disable();
        if (typeof osmMAP.dragging != 'undefined') osmMAP.dragging.disable();
        document.getElementById('sbox').disabled = true;
        document.getElementById('selmapOSM').disabled = true;
        if (typeof osmMAP._style != 'undefined') osmMAP._style.innerHTML = '#' + mapBOX + ' .leaflet-clickable {cursor: wait;}';
        SetStyleValue(document.body.style, 'cursor', 'wait');
        SetStyleValue(osmMAP._container.style, 'cursor', 'wait');
        SetStyleValue(document.getElementById(mapBOX).style, 'cursor', 'wait');
        var btn1 = document.getElementById('compSerie1');
        var btn2 = document.getElementById('compSerie2');
        if (btn1 !== null) {
            btn1.href = 'javascript:void(0);';
        }
        if (btn2 !== null) {
            btn2.href = 'javascript:void(0);';
        }
        if (typeof osmMAP.zoomFS != 'undefined') osmMAP.zoomFS.setCursor('wait');
        var op = document.getElementById('op2_stmapOSM');
        if (op !== null) L.DomUtil.addClass(op, 'wait');
        return;
    }
    osmMAP._skipZoom = false;
    osmMAP.skipPopup = false;
    osmMAP.interactionMode = true;
    if ((0 || ieVer > 8) && gDist !== null && gDist.selCircle !== null) SetStyleValue(gDist.selCircle.style, 'visibility', 'visible');
    if (typeof osmMAP.doubleClickZoom != 'undefined') osmMAP.doubleClickZoom.enable();
    if (typeof osmMAP.touchZoom != 'undefined') osmMAP.touchZoom.enable();
    if (typeof osmMAP.boxZoom != 'undefined') osmMAP.boxZoom.enable();
    if (typeof osmMAP.dragging != 'undefined') osmMAP.dragging.enable();
    document.getElementById('sbox').disabled = false;
    document.getElementById('selmapOSM').disabled = false;
    document.getElementById('selmapOSM').blur();
    if (typeof osmMAP._style != 'undefined') osmMAP._style.innerHTML = '#' + mapBOX + ' .leaflet-clickable {cursor: pointer;}';
    SetStyleValue(document.body.style, 'cursor', 'auto');
    SetStyleValue(osmMAP._container.style, 'cursor', 'auto');
    var btn1 = document.getElementById('compSerie1');
    var btn2 = document.getElementById('compSerie2');
    if (btn1 !== null) {
        btn1.href = 'javascript:compSerieClick(1);';
    }
    if (btn2 !== null) {
        btn2.href = 'javascript:compSerieClick(2);';
    }
    if (typeof osmMAP.zoomFS != 'undefined') osmMAP.zoomFS.setCursor('auto');
    var op = document.getElementById('op2_stmapOSM');
    if (op !== null) L.DomUtil.removeClass(op, 'wait');
}

function ReportError(str) {
    var osmMAP = gmL_MapsDict[mapBOX];
    var o = (typeof osmMAP.optimizePolies != 'undefined');
    var z = osmMAP.getZoom();
    var trace = arguments.callee.caller.trace().join("\n") + "\n" + printStackTrace();
    var log = window.location + ": " + str + "\nTRACE=" + trace + " \nboxMap.ver=" + boxMAP_VERSION;
    log += " reqID=" + reqID + " rspID=" + rspID + " cBoxType=" + cBoxType + " cSerie=" + cSerie + " ZL=" + z + " OPT=" + o + " MAP_WIDTH=" + MAP_WIDTH;
    var url = 'js/getBoxes.php?er=' + escape(log);
    ajaxRequest("ERROR", url, 1);
    if (DEBUG !== null) alert(log);
    ReportError = function() {};
    window.errorReported = 1;
}

function updateSerie(pv) {
    var pvKEY = pv.boxType + pv.serie;
    var fKEY = 'featureGroup' + pv.boxType;
    var prp = gmL_MapsPropsDict[mapBOX];
    bSerie[pv.boxType] = pv.serie;
    var pvLEN = pv.pv.length;
    var pLEN = prp[fKEY].length;
    var BG = (typeof pv.BG != 'undefined' && pv.BG);
    pv.BG = 0;
    if (!pv.partialUPDATE && (typeof serieCache[pvKEY] != 'undefined') && (pv.reqID != serieCache[pvKEY].reqID)) {
        serieCache[pvKEY].pv = serieCache[pvKEY].pv.concat(pv.pv);
        pvLEN = serieCache[pvKEY].pv.length;
    } else
        serieCache[pvKEY] = pv;
    if (pvLEN != pLEN)
        ReportError("PV[" + pvLEN + "] vs poly[" + pLEN + "] LENGTH MISMATCH - " + GetPolyStats());
    if (pv.boxType != cBoxType) return;
    if (BG) return
    ChangeGmapOpacity(bOpact[pv.boxType] * 100);
    recalcScale("us");
}

function genTabSkip(tabFull, skip) {
    var tabSkip = [];
    for (var p = 0; p < tabFull.length; p++)
        if (arr_indexOf(skip, p) == -1)
            tabSkip.push(tabFull[p]);
    return tabSkip;
}

function CheckPolySerieLoaded(poly, boxType, serie) {
    if (typeof poly.seriesLoaded == 'undefined')
        return false;
    if (typeof poly.seriesLoaded[boxType + serie] != 'undefined' && poly.seriesLoaded[boxType + serie] == 1)
        return true;
    return false;
}

function MarkPolySerieLoaded(poly, boxType, serie) {
    if (typeof poly.seriesLoaded == 'undefined')
        poly.seriesLoaded = [];
    poly.seriesLoaded[boxType + serie] = 1;
}

function processAjaxResponse(osmMAP, rsp, skipBoxes) {
    if (!rsp.BG && rsp.reqID < reqID) {
        DebugMSG("THIS WILL CAUSE PROBLEMS ??? [REQ_ID=" + rsp.reqID + "   RSP_ID=" + reqID + "]<br/>");
    }
    if (rsp.status == 200 && rsp.responseText == "") {
        var cLev = getSerieMaxLevel(cSerie);
        DebugMSG("NOTHING TO LOAD[cBoxType=" + cBoxType + "   cLev=" + cLev + "]<br/>\n");
        if (cBoxType == "b" && cLev == "block group") {
            DebugMSG("SERIE SWITCH NEEDED<br/>\n");
            return SwitchSerie(cSerie, 1);
        }
        recalcScale("par1");
        HandleSchedule();
        return;
    }
    if (rsp.status != 200 && rsp.responseText == "") {
        LGD.innerHTML = "<b style='background:red;color:white;'>Request cancelled. Please refresh page to view osmMAP.</b>";
        return;
    }
    var lMsg = document.getElementById("loadingMSG");
    if (lMsg !== null && lMsg.style.visibility != "hidden") {
        SetStyleValue(lMsg.style, 'visibility', "hidden");
        SetStyleValue(lMsg.style, 'display', "none");
        SetStyleValue(document.getElementById("mapOSM").style, 'top', "0px");
        SetStyleValue(document.getElementById("mapOSM").style, 'marginBottom', "0px");
    }
    var z = osmMAP.getZoom();
    skipPolys = [];
    polyFIPS = [];
    if (!rsp.BG) LAST_AJAX_RESPONSE = rsp.responseText;
    eval(rsp.responseText);
    if (lv == 'EXIT') return;
    if (!rsp.BG && (lv != cBoxType) && (oSlider !== null)) oSlider.setValue(Math.round(bOpact[lv] * 100 / scaleFactor));
    var LVL = getStateBorderDetail(z);
    if (pv === null || (skipPolys.length == pv.pv.length)) {
        reqID += (pv === null);
        window.bgMODE = 0;
        if (pv !== null && (skipPolys.length == pv.pv.length)) {
            var vKEY = pv.boxType + pv.serie;
            var fKEY = 'featureGroup' + pv.boxType;
            var prp = gmL_MapsPropsDict[mapBOX];
            var pLEN = prp[fKEY].length;
            serieCache[vKEY].pv.length = pLEN;
            DebugMSG("SKIP ALL[" + skipPolys.length + " " + pv.boxType + "]");
        }
        if (rsp.BG) {
            if (schedQUEUE.length) HandleSchedule();
            return;
        }
        if (lv != cBoxType && typeof layerGroups[cBoxType] != 'undefined' && typeof layerGroups[lv] != 'undefined') {
            if (0 || !CanSkipBoxTypeSwitch(cBoxType, lv, cSerie)) {
                distViewVAL = null;
                var pBoxType = cBoxType;
                switchLayers(pBoxType, lv);
                cBoxType = lv;
            } else if (typeof serieCache[cBoxType + cSerie] == 'undefined') {
                lv = lv;
            }
        }
        if (dEpST[LVL] === null && typeof epST != 'undefined' && epST !== null) {
            dEpST[LVL] = mL_decodeLatLonString(epST);
            HandleStateBorders(z);
        }
        recalcScale("par2");
        return ChangeStatus();
    }
    if (skipBoxes) {
        if (pv.serie != bSerie[lv]) {
            pv.partialUPDATE = true;
            ChangeStatus();
            var ret = updateSerie(pv);
            HandleSchedule();
            return ret;
        }
        return;
    }
    var uBoxType = lv;
    if (!rsp.BG) {
        var pBoxType = cBoxType;
        cBoxType = lv;
        if (cBoxType != pBoxType && typeof layerGroups[pBoxType] != 'undefined') {
            distViewVAL = null;
            switchLayers(pBoxType, (typeof layerGroups[cBoxType] == 'undefined') ? null : cBoxType);
        }
        ChangeStatus();
    }
    var prp = gmL_MapsPropsDict[mapBOX],
        fKEY = 'featureGroup' + uBoxType,
        prevLen = (typeof prp[fKEY] != 'undefined') ? prp[fKEY].length : 0;
    if (typeof ep != 'undefined') {
        var dEp = null;
        if (skipPolys.length) {
            pv.partialUPDATE = false;
            dEp = mL_decodeLatLonStringSkipEx(ep, skipPolys);
            pv.pv = genTabSkip(pv.pv, skipPolys);
        } else {
            dEp = mL_decodeLatLonString(ep);
        }
        layerGroups[uBoxType] = 1;
        var polyStyles = genStyle(uBoxType, noDataColor);
        mL_addRawPoly(mapBOX, true, dEp, polyStyles, pd, [], uBoxType, rsp.BG);
        DebugMSG("POLYS[" + uBoxType + "] <b>" + dEp.length + "</b> LOADED. SKIPPING <b>" + skipPolys.length + "</b> polies. " + GetPolyStatsStyled() + "<br/>");
    } else {
        pv.partialUPDATE = true;
    }
    if (stateBorders === null && cBoxType == "st")
        dEpST[LVL] = dEp;
    if (dEpST[LVL] === null && typeof epST != 'undefined' && epST !== null) {
        dEpST[LVL] = mL_decodeLatLonString(epST);
    }
    if (!rsp.BG) {
        HandleStateBorders(z);
        mL_layerToFront(mapBOX, [selectedPoly, cityPoly, stateBorders, brdLayer, lblLayer]);
    }
    var polys = prp[fKEY].getLayers(),
        aSerie = (cSerie.length < 4) ? MAIN_PROJ + cSerie : cSerie;
    for (var p = prevLen; p < polys.length; p++) {
        var poly = polys[p];
        poly._FIPS = polyFIPS[p - prevLen];
        poly._boxTYPE = uBoxType;
        MarkPolySerieLoaded(poly, uBoxType, aSerie);
        if (typeof poly._layers != 'undefined') {
            for (var l in poly._layers) {
                poly._layers[l]._FIPS = poly._FIPS;
                poly._layers[l]._boxTYPE = uBoxType;
                poly._layers[l]._parentLayer = poly;
            }
        }
    }
    pv.BG = rsp.BG;
    updateSerie(pv);
    window.bgMODE = 0;
    if (!rsp.BG || schedQUEUE.length)
        HandleSchedule();
}

function onReadyStateChange(e) {
    try {
        var req = e.target,
            osmMAP = gmL_MapsDict[mapBOX];
        if (req.readyState == 4) {
            if (req.status == 200) {
                processAjaxResponse(osmMAP, req, req.skipBoxes);
                rspID++;
                if (!req.BG) switchInteraction(osmMAP, true);
            } else if (!req.BG) {
                if (typeof recordedActions != 'undefined') recordedActions = [];
                DebugMSG("<B style='color:red'>Error while loading " + DL_OSM[req.boxType] + " STATUS=" + req.status + "</B><BR/>");
                LGD.innerHTML = 'Error while loading ' + DL_OSM[req.boxType] + '. Please reload the page.';
                SetStyleValue(LGD.style, 'color', '#ffffff');
                SetStyleValue(LGD.style, 'fontWeight', 'bold');
                SetStyleValue(LGD.style, 'background', '#ff0000');
                switchInteraction(osmMAP, true);
                return;
            }
        } else if (req.readyState == 1 && !req.BG) {
            LGD.innerHTML = 'Loading data...';
        }
    } catch (e) {
        var ps = GetPolyStats();
        ReportError("AJAX[" + req.url + "][" + document.domain + "]: " + ps + "   STATUS=" + req.status + "   READY_STATE=" + req.readyState + "  EXCEPTION=" + e.message.toString() + "  STATUS_TXT=" + req.statusText);
    }
}

function ajaxRequest(boxType, url, skipBoxes) {
    if (typeof window.getBoxesDIR != 'undefined')
        url = ((document.domain == "city-data.com") ? "http://www.city-data.com" : "") + window.getBoxesDIR + url;
    var BG = (url.indexOf("?BG=") != -1);
    var req = false;
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
        if (!isIE && req.overrideMimetype) {
            req.overrideMimeType('text/plain');
        }
    } else if (window.ActiveXObject) {
        try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }
    if (boxType == "ERROR") {
        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send("rsp=" + escape(LAST_AJAX_RESPONSE));
        return;
    }
    if (boxType == "SEARCH" && req) {
        req.onreadystatechange = function() {
            if (req.readyState == 4 && ((req.status == 0) || (req.status == 200))) {
                HandleSearch(req, null);
            }
        };
        DebugMSG("AJAX: <a target='_blank' href='" + url + "'>" + url + "</a><br/>");
        req.open('GET', url);
        req.send(null);
        return;
    }
    if (boxType == "COOKIE" && req) {
        req.onreadystatechange = function() {
            if (req.readyState == 4 && ((req.status == 0) || (req.status == 200))) {}
        };
        DebugMSG("AJAX: <a target='_blank' href='" + url + "'>" + url + "</a><br/>");
        req.open('GET', url);
        req.send(null);
        return;
    }
    if (boxType == "VALIDATE" && req) {
        req.onreadystatechange = validateRSP;
        POSTDATA = url.substr(url.indexOf("validate") + 9);
        url = url.substr(0, url.indexOf("?validate="));
        DebugMSG("AJAX: <a target='_blank' href='" + url + "'>" + url + "</a><br/>");
        DebugMSG("POSTDATA: " + POSTDATA + "<br/>");
        req.open('POST', url, false);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send("validate=" + escape(POSTDATA));
        return;
    }
    if (boxType == "POPUP" && req) {
        req.onreadystatechange = function() {
            if (req.readyState == 4 && ((req.status == 0) || (req.status == 200)) && req.responseText != "") {
                HandlePopup(req);
            }
        };
        DebugMSG("AJAX: <a target='_blank' href='" + url + "'>" + url + "</a><br/>");
        req.open('GET', url);
        req.send(null);
        return;
    }
    var osmMAP = gmL_MapsDict[mapBOX];
    if (!BG) {
        switchInteraction(osmMAP, false);
        ClearSchedule();
    }
    var z = osmMAP.getZoom();
    if (req) {
        if (typeof osmMAP._style != 'undefined') osmMAP._style.innerHTML = '#' + mapBOX + '.-clickable {cursor: wait;}';
        var LVL = getStateBorderDetail(z);
        var csParam = (CACHE_IT && !window.FORCE_SAME_BOX_TYPE) ? "&c=1" : "";
        var btParam = "&t=" + ((!window.FORCE_SAME_BOX_TYPE) ? boxType : cBoxType);
        var srParam = "&s=" + cSerie;
        var cbParam = (!window.FORCE_SAME_BOX_TYPE) ? "&cb=1" : "";
        var zlParam = "&zl=" + z;
        var sbParam = (typeof skipBoxes != 'undefined') ? "&sb=1" : "";
        var bdParam = (dEpST[LVL] === null) ? "&stateBnd=1" : "";
        CACHE_IT = 0;
        window.FORCE_SAME_BOX_TYPE = 0;
        url += csParam + btParam + srParam + cbParam + zlParam + sbParam + bdParam;
        url += "&d=" + GetUsDistStatus(cSerie);
        req.BG = BG;
        req.url = url;
        req.reqID = reqID;
        req.boxType = boxType;
        req.skipBoxes = skipBoxes;
        req.onreadystatechange = (ieVer <= 8) ? function() {
            onReadyStateChange({
                target: req
            });
        } : onReadyStateChange;
        if (!req.BG) LAST_AJAX_REQUEST = url;
        var urlDBG = url;
        var POSTDATA = "";
        var MAXLEN = (DEBUG !== null && typeof DEBUG != 'function') ? 2000 : 1024;
        if (url.length >= MAXLEN) {
            var tag = 'js/getBoxes.php?';
            POSTDATA = url.substr(url.indexOf(tag) + tag.length);
            url = url.replace(POSTDATA, "") + "src=P";
            DebugMSG("POSTDATA[" + POSTDATA.length + "]: " + POSTDATA + "<br/>");
        }
        if (!BG) {
            DebugMSG("AJAX[" + reqID + "]: <a target='_blank' href='" + urlDBG + "'>" + url + "</a><br/>");
        } else {
            window.bgMODE = 1;
            DebugMSG("BG_AJAX[" + reqID + "][Q=" + schedQUEUE.length + "]: <a target='_blank' href='" + urlDBG + "'>" + url + "</a><br/>");
        }
        var synch = 1 || (reqID == 0);
        if (POSTDATA == "") {
            req.open('GET', url, synch);
            req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
            req.send(null);
        } else {
            req.open('POST', url, synch);
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
            req.send(POSTDATA);
        }
    } else {
        LGD.innerHTML = 'Error while loading ' + DL_OSM[boxType] + '. Please reload the page.';
    }
}

function switchLayers(prvBoxType, newBoxType) {
    DebugMSG("switchLayers()" + prvBoxType + "   =>   " + newBoxType + "[" + cBoxType + "]<br/>");
    var osmMAP = gmL_MapsDict[mapBOX];
    var prp = gmL_MapsPropsDict[mapBOX];
    if ((prvBoxType !== null) && (prvBoxType.replace("sct", "ct") == cBoxType.replace("sct", "ct")) && prvBoxType != cBoxType) {
        osmMAP._popupSkipClose = true;
    } else {
        osmMAP.closePopup();
        if (selectedPoly !== null)
            selectedPoly.clearLayers();
    }
    distViewPolys = [];
    if (prvBoxType !== null) {
        prp['featureGroup' + prvBoxType].hideLayerGroup();
    }
    if (newBoxType !== null) {
        prp['featureGroup' + newBoxType]._map = osmMAP;
        prp['featureGroup' + newBoxType].showLayerGroup();
    }
    if (newBoxType !== null)
        HandleSchedule();
}

function switchToBoxType(boxType) {
    if (boxType == cBoxType) return;
    switchLayers(cBoxType, boxType);
    cBoxType = boxType;
    SwitchSerie(cSerie);
    recalcScale("sbt");
}

function GetPolyStats() {
    var prp = gmL_MapsPropsDict[mapBOX];
    var dTAB = new Array("st", "sct", "ct", "t", "bg", "b");
    var polyStats = "";
    for (var d = 0; d < dTAB.length; d++) {
        var dLV = dTAB[d];
        if (typeof prp['featureGroup' + dLV] != 'undefined') polyStats += "[" + dLV + "=" + prp['featureGroup' + dLV].length + "] ";
    }
    return polyStats;
}

function GetPolyStatsStyled() {
    return "<b style='color:red;'>PolyStats: " + GetPolyStats() + "</b>";
}

function ShowPolyStats() {
    if (DEBUG !== null)
        DebugMSG(GetPolyStatsStyled() + "<br/>");
}

function HideOsmMAP() {
    prevVW = null;
    window.geoDefaultState = null;
    onMapStateChange({
        'type': 'INIT'
    });
}

function SetGEO(poly, drawPoly) {
    var dEp = mL_decodeLatLonString([poly]);
    var bounds = new L.LatLngBounds(dEp);
    var osmMAP = gmL_MapsDict[mapBOX];
    CACHE_IT = 1;
    window.geoDefaultState = null;
    osmMAP.fitBounds(bounds);
    if (drawPoly)
        cityPoly = mL_addRawPoly(mapBOX, false, dEp, "'" + plaColor + "', 4, 1,'#000000',0", [], [], 'city', 0);
    onMapStateChange({
        'type': 'INIT'
    });
}

function CreateSerieIfNeeded(boxType, serie) {
    var KEY = boxType + serie;
    if (typeof serieCache[KEY] == 'undefined') {
        var sSerie = getSelectOption(serie).innerHTM;
        serieCache[KEY] = {
            'boxType': boxType,
            'serie': serie,
            'pv': [],
            'serieName': sSerie,
            'reqID': reqID
        };
    }
    var prp = gmL_MapsPropsDict[mapBOX],
        csKEY = 'featureGroup' + boxType;
    if (typeof prp[csKEY] != 'undefined')
        fillMissing(serieCache[KEY].pv, prp[csKEY].length);
}

function HandleStateChange(boxType, evtType) {
    DebugMSG("HandleStateChange: boxType=" + boxType + "  evtType=" + evtType + "<br/>");
    if (typeof window.geoDefaultState != 'undefined' && window.geoDefaultState !== null) {
        reqURL = 'js/getBoxes.php?geo=1&st=' + window.geoDefaultState;
        return ajaxRequest("GEO", reqURL);
    }
    var osmMAP = gmL_MapsDict[mapBOX];
    var z = osmMAP.getZoom();
    var s = ChangeStatus();
    var vw = GetViewport(osmMAP, boxType);
    if (boxType == cBoxType) {
        if (!s && z > CUR_ZOOM_LEVEL && IsViewportLoaded(vw, boxType)) {
            DebugMSG("================ SKIP_REQUEST[ZOOM] ================<br/>");
            CreateSerieIfNeeded(boxType, cSerie);
            return recalcScale("hst1 evtType=" + evtType);
        }
        if (CUR_ZOOM_LEVEL == z && IsViewportLoaded(vw, boxType)) {
            DebugMSG("================ SKIP_REQUEST[VP] ================<br/>");
            CreateSerieIfNeeded(boxType, cSerie);
            return recalcScale("hst2 evtType=" + evtType);
        }
    }
    var vwSTATE = AddViewport(boxType, vw);
    if (typeof osmMAP.startDrag != 'undefined' && osmMAP.startDrag) {
        var diff = new Date().getTime() - osmMAP.startDrag;
        DebugMSG("DRAGDIFF: " + diff + "<br/>");
        osmMAP.startDrag = 0;
    }
    DebugMSG("VIEWPORT LOAD[" + boxType + "]=" + vwSTATE.load + "  SKIP=" + vwSTATE.skip + "<br/>");
    var reqURL = 'js/getBoxes.php?vw=' + vwSTATE.load + '&svw=' + vwSTATE.skip;
    if (boxType == "st" && typeof initUSdata == 'function') {
        if (cSerie == "income3") {
            LAST_AJAX_REQUEST = "&c=1";
            switchInteraction(osmMAP, false);
            initUSdata();
            AddViewportLoaded('st', new Array(new Array(-135.81, 20.86), new Array(-56.67, 50.81)), 'st[c=49 r=7.1632653061224]  sct[c=3109 r=6.7725]');
            switchInteraction(osmMAP, true);
            rspID++;
            initUSdata = null;
            return;
        }
        initUSdata = null;
    }
    if (typeof initUSdata == 'function') initUSdata = null;
    return ajaxRequest(boxType, reqURL);
}

function getCurrentLevel() {
    var CL_OSM = {
        'st': 'state',
        'sct': 'county',
        'ct': 'county',
        'c': 'city',
        't': 'tract',
        'bg': 'block group',
        'b': 'block'
    };
    return CL_OSM[cBoxType];
}

function getSerieMaxLevel(aSerie) {
    var aSerieStr = "";
    var sel = document.getElementById("sel" + mapBOX);
    for (var s = 0; s < sel.options.length && aSerieStr == ""; s++)
        if (sel.options[s].value == aSerie)
            aSerieStr = sel.options[sel.selectedIndex].innerHTML;
    aSerie = (aSerie.length < 4) ? MAIN_PROJ + aSerie : aSerie;
    var lev = (aSerie.indexOf("races") + aSerie.indexOf("blocks") != -2) ? "block" : "block group";
    if (lev == "block" && (aSerieStr.indexOf("Ancestries") + aSerieStr.indexOf("Place of birth") + aSerieStr.indexOf("Marital status") + aSerieStr.indexOf("Geographical mobility") != -4))
        lev = "block group";
    return lev;
}

function IsNextZlAvailable() {
    var sel = document.getElementById("sel" + mapBOX);
    var aSerie = sel.options[sel.selectedIndex].value;
    aSerie = (aSerie.length < 4) ? MAIN_PROJ + aSerie : aSerie;
    var lev = getSerieMaxLevel(aSerie);
    return {
        serie: aSerie,
        avail: (getCurrentLevel() != lev),
        level: lev
    };
}

function ChangeStatus() {
    LGD.innerHTML = "Displaying: " + DL_OSM[cBoxType];
    var s = IsNextZlAvailable();
    if (DEBUG !== null && typeof DEBUG != 'function') LGD.innerHTML += "[" + s.serie + "] ZL=" + gmL_MapsDict[mapBOX].getZoom() + "[" + cBoxType + "]";
    if (!s.avail) {
        LGD.innerHTML += ". Zoom out and pan to view other areas";
        return 0;
    }
    LGD.innerHTML += ". Zoom in to view higher resolution data (available down to the " + s.level + " level)";
    return 1;
}
var prevVW = null;

function onMapStateChange(evt) {
    var osmMAP = gmL_MapsDict[mapBOX];
    var z = osmMAP.getZoom();
    if (evt.type == "zoomstart") {
        osmMAP.prevZoom = z;
        return;
    }
    if (evt.type == "zoomend" && typeof osmMAP.prevZoom != 'undefined') {
        if (osmMAP.prevZoom < z) {
            LAST_MOVE = MOVE.ZOOM_IN;
            EventLogGA("ZoomIn", "");
        } else {
            LAST_MOVE = MOVE.ZOOM_OUT;
            EventLogGA("ZoomOut", "");
        }
    }
    if (typeof osmMAP.mapLoaded == 'undefined') {
        ChangeStatus();
        return;
    }
    var vw = osmMAP.getBounds();
    if (evt.type == "INIT") {
        osmMAP.initVW = vw;
        if (typeof osmMAP.optTest == 'undefined') {
            osmMAP.optTest = L.polygon([
                [54.559322, -5.767822],
                [56.1210604, -3.021240]
            ], {
                color: "#ff7800",
                weight: 1
            }).addTo(osmMAP);
            var useOpt = (typeof osmMAP._pathRoot != 'undefined' && typeof osmMAP.optTest._path != 'undefined');
            osmMAP.optTest.onRemove(osmMAP);
            if (useOpt) {
                osmMAP.optimizePolies = true;
                DebugMSG("<b style='color:orange'>####OPTIMIZE_POLIES_ON#####</b><br/>");
                osmMAP.on('viewreset', onViewReset);
                osmMAP.on('moveend', onMoveEnd);
            } else DebugMSG("<b style='color:red'>####OPTIMIZE_POLIES_OFF#####</b><br/>");
        }
    }
    if (evt.type == "dragend") {
        dragEnd({
            target: osmMAP
        });
        if (prevVW !== null) {
            var pne = prevVW.getNorthEast();
            var cne = vw.getNorthEast();
            var latDIFF = pne.lat - cne.lat;
            var lngDIFF = pne.lng - cne.lng;
            if (Math.abs(lngDIFF) >= Math.abs(latDIFF))
                LAST_MOVE = (lngDIFF > 0) ? MOVE.MOVE_LEFT : MOVE.MOVE_RIGHT;
            else
                LAST_MOVE = (latDIFF > 0) ? MOVE.MOVE_BOTTOM : MOVE.MOVE_TOP;
        }
        EventLogGA("MapMove", "");
    }
    DebugMSG('onMapStateChange: EVENT=' + evt.type + " (SW,NE)=" + vw.toBBoxString() + "  ZL=" + z + " C=" + osmMAP.getCenter().toString() + "<br/>");
    if (prevVW && prevVW.equals(vw) && evt.type != 'PSB_BOX_SWITCH' && evt.type != 'POPUP_CLOSED') {
        return;
    }
    prevVW = vw;
    if (evt.type == "zoomend" && LAST_MOVE == MOVE.ZOOM_IN && IS_POPUP_OPEN) {
        ChangeStatus();
        return recalcScale("omst evtType=" + evt.type);
    }
    window.FORCE_SAME_BOX_TYPE = ((LAST_MOVE != MOVE.ZOOM_OUT && evt.type != 'FULLSCREEN_ON' && IS_POPUP_OPEN) || evt.type == "POLY_CLICK");
    if (z < ST_ZOOM_LEVEL) return HandleStateChange('st', evt.type);
    if (z < CT_ZOOM_LEVEL) return HandleStateChange('ct', evt.type);
    if (z < BG_ZOOM_LEVEL) return HandleStateChange('t', evt.type);
    if (z < BK_ZOOM_LEVEL) return HandleStateChange('bg', evt.type);
    var aSerie = (cSerie.length < 4) ? MAIN_PROJ : cSerie.replace(/\d+/, "");
    if (aSerie == 'blocks' || aSerie == 'races')
        return HandleStateChange('b', evt.type);
    return HandleStateChange('bg', evt.type);
}

function SwitchSerie(nSerie, skipBTScheck) {
    compSerieSet();
    distViewVAL = null;
    var prp = gmL_MapsPropsDict[mapBOX];
    var bxnSerie = cBoxType + nSerie;
    var bxcSerie = cBoxType + cSerie;
    var nLen = (typeof serieCache[bxnSerie] == 'undefined') ? 0 : serieCache[bxnSerie].pv.length;
    var cLen = (typeof serieCache[bxcSerie] == 'undefined') ? 0 : serieCache[bxcSerie].pv.length;
    var bLen = (typeof prp['featureGroup' + cBoxType] == 'undefined') ? 0 : prp['featureGroup' + cBoxType].length;
    var cLev = getSerieMaxLevel(cSerie);
    var nLev = getSerieMaxLevel(nSerie);
    var possibleBoxTypeSwitch = 1 && ((typeof skipBTScheck == 'undefined') && (cLev != nLev || (cLev == 'blocks' && nLev == 'blocks')) && (cBoxType == "b" || cBoxType == "bg"));
    var needNewPolys = !nLen || (nLen != cLen) || (nLen != bLen) || possibleBoxTypeSwitch;
    var nSerieStr = (nSerie.length < 4) ? MAIN_PROJ + nSerie : nSerie;
    DebugMSG("SwitchSerie() " + cSerie + "[" + cLev + "] => " + nSerieStr + "[" + nLev + "]  needNewPolys=" + needNewPolys + "  possibleBoxTypeSwitch=" + possibleBoxTypeSwitch + "<br/>\n");
    EventLogGA("SwitchSerie", nSerieStr);
    cSerie = nSerie;
    if (possibleBoxTypeSwitch) {
        return onMapStateChange({
            'type': 'PSB_BOX_SWITCH'
        });
    }
    var osmMAP = gmL_MapsDict[mapBOX];
    osmMAP.closePopup();
    if (!needNewPolys)
        return updateSerie(serieCache[bxnSerie]);
    var vw = GetViewport(osmMAP, cBoxType),
        cvw = vw.padEx(0.5, 1);
    var uniq = [],
        inter = [],
        polys = gmL_MapsPropsDict[mapBOX]['featureGroup' + cBoxType].getLayers();
    for (var p = 0; p < polys.length; p++) {
        var poly = polys[p],
            f = poly._FIPS.substr(0, 12),
            pBnd;
        if (cBoxType == "st") {
            inter.push(f);
            continue;
        }
        if (typeof uniq[f] != 'undefined' || CheckPolySerieLoaded(poly, cBoxType, nSerie)) continue;
        pBnd = poly.getBounds();
        if (!cvw.contains(pBnd) && !cvw.intersects(pBnd)) continue;
        inter.push(f);
        uniq[f] = 1;
    }
    DebugMSG("Checking VW=" + vw.toBBoxString() + "   CHECK=" + inter.length + "   SKIP = " + (polys.length - inter.length) + "<br/>");
    if (!inter.length) {
        CreateSerieIfNeeded(cBoxType, nSerie);
        return updateSerie(serieCache[bxnSerie]);
    }
    var sInt = inter.join(",");
    ajaxRequest(cBoxType, 'js/getBoxes.php?b=' + sInt + "&svw=|||||", true);
}

function getSelectOption(value) {
    if (typeof boxMapSerieToTitle[value] == 'undefined') {
        ReportError("getSelectOption[prj = " + prj + "  SEL_OPTIONS = " + sel.options.length + "] WOULD RETURN NULL FOR " + value);
        return null;
    }
    return {
        innerHTML: boxMapSerieToTitle[value]
    };
}

function descSplitOnly(di, t) {
    di = di.split('|');
    var ds = [],
        diLen = di.length - 1,
        prevFIPS = 0,
        len = 0;
    if (t == 'b') window.stateData = window.stateData.split(",");
    if (t == 't') len = 11;
    else if (t == 'bg') len = 12;
    else if (t == 'ct' || t == 'sct') len = 5;
    else if (t == 'st') len = 2;
    for (var d = 0; d < diLen; d++) {
        var FIPS = (parseInt(prevFIPS) + parseInt(di[d])).toString();
        prevFIPS = FIPS;
        if (t == 'b' && (FIPS.substr(0, 2) != window.stateData[d])) len = FIPS.length + 1;
        while (FIPS.length < len) FIPS = "0" + FIPS;
        ds.push(FIPS);
    }
    window.stateData = null;
    return ds;
}

function descSplit(di, t, aSerie) {
    di = di.split('|');
    var e, dd, val, ds = [],
        cnt = 0,
        len = 0,
        prp = gmL_MapsPropsDict[mapBOX],
        fKEY = 'featureGroup' + t,
        cKEY = t + aSerie.replace(MAIN_PROJ, "");
    var prevLen = (typeof prp[fKEY] != 'undefined') ? prp[fKEY].length : 0,
        polys = (prevLen) ? prp[fKEY].getLayers() : [];
    if (t == 'b') window.stateData = window.stateData.split(",");
    if (t == 't') len = 11;
    else if (t == 'bg') len = 12;
    else if (t == 'ct' || t == 'sct') len = 5;
    else if (t == 'st') len = 2;
    var ll = 0;
    for (var i = 0; i < di.length; i++) {
        var r = di[i].match(/[\-0-9]+/g);
        if (r === null) continue;
        var c = r[1] | 0;
        for (var p = 0; p <= c; p++) {
            ll += parseFloat(r[0]);
            var s = ll.toString();
            if (t == 'b' && (s.substr(0, 2) != window.stateData[ds.length + skipPolys.length])) len = s.length + 1;
            while (s.length < len) s = "0" + s;
            if (typeof fips2poly[t + s] != 'undefined') {
                var pIDX = ds.length + skipPolys.length,
                    p = fips2poly[t + s],
                    poly = polys[p],
                    vTAB = window.LAST_PV.pv;
                if (!CheckPolySerieLoaded(poly, t, aSerie)) {
                    MarkPolySerieLoaded(poly, t, aSerie);
                    serieCache[cKEY].pv[p] = vTAB[pIDX];
                }
                skipPolys.push(pIDX);
                continue;
            }
            polyFIPS.push(s);
            var off = prevLen + ds.length;
            fips2poly[t + s] = off;
            poly2fips[t + off] = s;
            ds.push('');
        }
    }
    window.stateData = null;
    return ds;
}

function enterFS(zoomFS) {
    EventLogGA("EnterFS", "");
    zoomFS._isFullscreen = true;
    var mapOSM = document.getElementById(mapBOX);
    zoomFS.prevH = mapOSM.clientHeight;
    zoomFS.prevW = mapOSM.clientWidth;
    L.DomUtil.addClass(document.body, 'leaflet-fullscreen');
    var es = document.getElementById('eventSHIELD');
    if (es !== null && window.currentEventSHIELD !== null) {
        window.currentEventSHIELD.skipVisibilityCheck = true;
        window.currentEventSHIELD.ClearInterval();
    }
    var mapB = document.getElementById('boxMAPborder');
    L.DomUtil.addClass(mapB, 'leaflet-fullscreen');
    L.DomUtil.addClass(mapOSM, 'leaflet-fullscreen');
    var off = 35 + 90;
    SetStyleValue(mapOSM.style, 'height', Math.floor((mapB.clientHeight - off) * 100.0 / mapB.clientHeight) + "%");
    var legOSM = document.getElementById('legendBOX');
    L.DomUtil.addClass(legOSM, 'leaflet-fullscreen');
    var legOSM = document.getElementById('op2_stmapOSM');
    L.DomUtil.addClass(legOSM, 'leaflet-fullscreen');
    var pop = document.getElementById('bMAPpopUP');
    L.DomUtil.addClass(pop, 'leaflet-fullscreen');
    if (pop.style.visibility == 'visible') gmapPickBorderCol();
    if (DEBUG !== null) {
        var deb = document.getElementById('debug');
        L.DomUtil.addClass(deb, 'leaflet-fullscreen');
    }
    var off = L.DomUtil.getViewportOffset(document.getElementById('mapOSM'));
    window._isFullscreenFix = (off.y == 35);
    gDist = null;
    showDistributionGraph();
    L.DomEvent.addListener(document, 'keyup', zoomFS._onKeyUp, zoomFS);
    gmL_MapsDict[mapBOX].invalidateSize(false);
    onMapStateChange({
        'type': 'FULLSCREEN_ON'
    });
}

function exitFS(zoomFS) {
    zoomFS._isFullscreen = false;
    window._isFullscreenFix = false;
    L.DomUtil.removeClass(document.body, 'leaflet-fullscreen');
    var es = document.getElementById('eventSHIELD');
    if (es !== null && window.currentEventSHIELD !== null) {
        window.currentEventSHIELD.skipVisibilityCheck = false;
        window.currentEventSHIELD.ClearInterval();
    }
    var mapB = document.getElementById('boxMAPborder');
    L.DomUtil.removeClass(mapB, 'leaflet-fullscreen');
    var mapOSM = document.getElementById(mapBOX);
    L.DomUtil.removeClass(mapOSM, 'leaflet-fullscreen');
    SetStyleValue(mapOSM.style, 'height', zoomFS.prevH + "px");
    var legOSM = document.getElementById('legendBOX');
    L.DomUtil.removeClass(legOSM, 'leaflet-fullscreen');
    var legOSM = document.getElementById('op2_stmapOSM');
    L.DomUtil.removeClass(legOSM, 'leaflet-fullscreen');
    var pop = document.getElementById('bMAPpopUP');
    L.DomUtil.removeClass(pop, 'leaflet-fullscreen');
    if (pop.style.visibility == 'visible') gmapPickBorderCol();
    if (DEBUG !== null) {
        var deb = document.getElementById('debug');
        L.DomUtil.removeClass(deb, 'leaflet-fullscreen');
    }
    gDist = null;
    showDistributionGraph();
    L.DomEvent.removeListener(document, 'keyup', zoomFS._onKeyUp);
    gmL_MapsDict[mapBOX].invalidateSize(false);
    onMapStateChange({
        'type': 'FULLSCREEN_OFF'
    });
}

function dragStart(e) {
    var osmMAP = e.target;
    osmMAP.startDrag = new Date().getTime();
    osmMAP.skipClick = !(window.opera && window.opera.buildNumber);
}

function dragEnd(e) {
    var osmMAP = e.target;
    osmMAP.startDrag = new Date().getTime();
}

function onViewReset(ctx, t) {
    t = t || this;
    var l, CNT = 0;
    for (var lIdx in t._layers) {
        l = t._layers[lIdx];
        if (typeof l._tiles != 'undefined' || (typeof l._boxTYPE != 'undefined' && l._boxTYPE != cBoxType)) continue;
        if (l._map === null || typeof l.projectLatlngs == 'undefined') continue;
        CNT++;
        l.projectLatlngs();
    }
    if (ctx === null) return;
}

function onMoveEnd(ctx, t) {
    t = t || this;
    var l, CNT = 0;
    for (var lIdx in t._layers) {
        l = t._layers[lIdx];
        if (typeof l._tiles != 'undefined' || (typeof l._boxTYPE != 'undefined' && l._boxTYPE != cBoxType)) continue;
        if (l._map === null || typeof l._updatePath == 'undefined') continue;
        CNT++;
        l._updatePath();
    }
    if (ctx === null) return;
}

function onResize() {
    DebugMSG("MAP_RESIZE()<br/>");
    if (typeof Dygraph != "undefined" && Dygraph !== null) Dygraph.one_em_width_ = 0;
    MAP_WIDTH = document.getElementById(mapBOX).clientWidth;
    GRD_LEFT = getDOMPosition(document.getElementById(mapBOX))[0];
    onMapStateChange({
        'type': 'INIT'
    });
}

function showHelpTTip() {
    var hit = document.getElementById('helpTTip');
    SetStyleValue(hit.style, "display", "block");
}

function hideHelpTTip() {
    var hit = document.getElementById('helpTTip');
    SetStyleValue(hit.style, "display", "none");
}

function loadGMAP() {
    if (typeof window.skipLoad != 'undefined' && window.skipLoad !== null) {
        window.skipLoad = null;
        return;
    }
    gmMIN_ZOOM = 3;
    if (typeof window.boxMapLazyLoad != 'undefined' && window.boxMapLazyLoad !== null) {
        window.boxMapLazyLoad = null;
        OnScrollLoader.registerElement(mapBOX, loadGMAP);
        OnScrollLoader.onScroll();
        return;
    }
    if (typeof L == 'undefined') {
        mL_LoadMapJS(loadGMAP, 1);
        return;
    }
    maxBounds = new L.LatLngBounds(new L.LatLng(20, -180), new L.LatLng(80, -60));
    initStateBoundaties();
    ParseSeries();
    var osmMAP = null;
    if (1 && typeof L.Control.ZoomFS != 'undefined') {
        osmMAP = mL_createMapFS(mapBOX);
        if (!window.mobileVersion) {
            osmMAP.zoomFS._enterFullScreen = function() {
                enterFS(this);
            };
            osmMAP.zoomFS._exitFullScreen = function() {
                exitFS(this);
            };
        } else {
            osmMAP.on('enterFullscreen', function() {
                gmL_MapsDict[mapBOX].invalidateSize(false);
                onMapStateChange({
                    'type': 'FULLSCREEN_ON'
                });
            }, this);
            osmMAP.on('exitFullscreen', function() {
                if (typeof rescaleMapOSM == 'function') rescaleMapOSM();
                gmL_MapsDict[mapBOX].invalidateSize(false);
                onMapStateChange({
                    'type': 'FULLSCREEN_OFF'
                });
            }, this);
        }
        osmMAP.on('dragstart', dragStart);
    } else osmMAP = mL_createMap(mapBOX);
    osmMAP.interactionMode = true;
    osmMAP.duringTest = false;
    var hi = document.getElementById('helpIcon');
    var hit = document.getElementById('helpTTip');
    if (hi !== null) {
        var btm = document.getElementById('mapOSM_legend').clientHeight + document.getElementById('graphdiv').clientHeight + 1;
        hit.innerHTML = 'The areas on this histogram show the distribution of the values.<br/>The area of each rectangle on the histogram corresponds to the number of map areas that have values in this interval.<br/>The upper distribution corresponds to the visible map area.<br/>The lower distribution corresponds to the whole US.';
        SetStyleValue(hi.style, "display", "block");
        SetStyleValue(hit.style, "bottom", btm + "px");
    }
    var ss = document.getElementById('selmapOSM');
    if (typeof ShowHideMargins == 'function') ShowHideMargins();
    if (typeof loadOMAP == 'function') loadOMAP();
    cSerie = ss.options[0].value;
    bSerie = initAllLevels(cSerie);
    if (!isIE) {
        var s = document.createElement('style');
        s.type = 'text/css';
        s.innerHTML = '#' + mapBOX + '.leaflet-clickable {cursor: auto;}';
        document.body.appendChild(s);
        osmMAP._style = s;
    }
    var z = -1;
    var bd = null;
    osmMAP.startDrag = 0;
    osmMAP.on('dragend', onMapStateChange);
    osmMAP.on('zoomstart', onMapStateChange);
    osmMAP.on('zoomend', onMapStateChange);
    osmMAP.on('popupopen', onPopupOpen);
    osmMAP.on('popupclose', onPopupClose);
    osmMAP.on('resize', onResize);
    if (typeof cPoly != 'undefined') {
        cityPoly = mL_addRawPoly(mapBOX, false, mL_decodeLatLonString([cPoly]), ["'" + plaColor + "', 4, 1,'#000000',0"], [], [], 'city', 0);
        bd = gmL_MapsPropsDict[mapBOX]['featureGroupcity'].getLayers()[0].getBounds();
    } else {
        var southWest = new L.LatLng(49.3, -67);
        var northEast = new L.LatLng(25.3, -125);
        bd = new L.LatLngBounds(southWest, northEast);
    }
    z = osmMAP.getBoundsZoom(bd);
    if (typeof SetDeafultSerie == 'function') SetDeafultSerie();
    if (typeof SetMaxZoomLevel == 'function') z = SetMaxZoomLevel(z);
    if (typeof SetInitBounds == 'function') bd = SetInitBounds(bd);
    var mCenter = bd.getCenter();
    var sz = getURLParam((mapBOX + "[zl]").toLowerCase());
    var sc1 = getURLParam((mapBOX + "[c1]").toLowerCase());
    var sc2 = getURLParam((mapBOX + "[c2]").toLowerCase());
    var so = getURLParam((mapBOX + "[s]").toLowerCase());
    var FS = getURLParam((mapBOX + "[fs]").toLowerCase());
    var POP = getURLParam((mapBOX + "[pop]").toLowerCase());
    window.openPopupOnLoad = POP;
    if (sz != "" && sc1 != "" && sc2 != "" && so != "") {
        EventLogGA("LoadFromLink", "");
        window.geoDefaultState = null;
        initUSdata = null;
        var loc = window.location.toString();
        var ll = loc.indexOf("#");
        if (ll != -1) loc = loc.substr(0, ll);
        window.location = loc + "#boxMAPborder";
        z = sz;
        mCenter = new L.LatLng(sc1, sc2);
        SetSerie(so);
        if (FS == "true") enterFS(osmMAP.zoomFS);
    }
    var extraLEAFLETinfo = "";
    if (typeof window.LEAFLET_URL != 'undefined')
        extraLEAFLETinfo = "  DIR: " + window.LEAFLET_URL;
    DebugMSG("LEAFLET_VERSION: " + L.version + "[" + leaflet_DATE + "]" + extraLEAFLETinfo + "  boxMAP_VERSION = " + boxMAP_VERSION + " <br/>");
    compSerieSet();
    if (window.mobileVersion && !window.dontGeolocate) {
        osmMAP.on('locationfound', function(e) {
            onMapStateChange({
                'type': 'AFTER_GEO'
            });
            for (var i = 0; i < stateBoundaries.length; ++i) {
                if (stateBoundaries[i].bounds.contains(e.latlng)) {
                    osmMAP.fitBounds(e.bounds);
                    return;
                }
            }
        });
        osmMAP.locate({
            setView: false,
            maxZoom: 9
        });
    }
    osmMAP.on('load', function() {
        this.mapLoaded = 1;
        if (typeof ep == 'undefined') onMapStateChange({
            'type': 'INIT'
        });
        if (showBordersC == 0) toggleBorders();
        if (distUSdataC == 0) toggleHistogram();
    });
    osmMAP.setView(mCenter, z);
    if (typeof CustomizeMap == 'function') CustomizeMap();
}

function listenForEvent(evnt, elem, func) {
    if (elem.addEventListener)
        elem.addEventListener(evnt, func, false);
    else if (elem.attachEvent) {
        var r = elem.attachEvent("on" + evnt, func);
        return r;
    }
}
if (typeof mL_loadedUserCallback != 'function' && typeof initOSM != 'function' && typeof window.skipAutoloadOSM == 'undefined') {
    if (typeof mL_LoadMapJS == 'undefined') {
        loadMaplibJS = function() {
            mL_loadedUserCallback = loadGMAP;
            var s = document.createElement('script');
            s.src = (typeof window.LEAFLET_URL != 'undefined') ? window.LEAFLET_URL.replace('leaflet', 'maplib') : 'http://pics3.city-data.com/js/maps/maplib.js';
            if (DEBUG !== null) {
                s.src += "?ver=" + Math.random().toString();
                DebugMSG(s.src);
            }
            s.type = 'text/javascript';
            s.async = true;
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
        };
        listenForEvent("load", window, loadMaplibJS);
    } else listenForEvent("load", window, loadGMAP);
}

function getURLParam(strParamName) {
    var strReturn = "";
    var strHref = decodeURIComponent(window.location.href);
    if (strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
        var aQueryString = strQueryString.split("&");
        for (var iParam = 0; iParam < aQueryString.length; iParam++) {
            if (aQueryString[iParam].indexOf(strParamName + "=") > -1) {
                var aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                break;
            }
        }
    }
    return strReturn;
}

function getOSMLink() {
    var osmMAP = gmL_MapsDict[mapBOX];
    if (!osmMAP.interactionMode) return;
    var z = osmMAP.getZoom();
    var c1 = osmMAP.getCenter().lat.toString();
    var c2 = osmMAP.getCenter().lng.toString();
    var loc = window.location.toString();
    var ll = loc.indexOf("#");
    if (ll != -1) loc = loc.substr(0, ll);
    var FS = (typeof osmMAP.zoomFS == 'undefined') ? 0 : osmMAP.zoomFS._isFullscreen;
    var url = loc + "#" + mapBOX + "?" + mapBOX + "[zl]=" + z + "&" + mapBOX + "[c1]=" + c1 + "&" + mapBOX + "[c2]=" + c2 + "&" + mapBOX + "[s]=" + cSerie + "&" + mapBOX + "[fs]=" + FS;
    if (IS_POPUP_OPEN && window.popupPoly != null) {
        url += "&" + mapBOX + "[pop]=" + window.popupPoly._FIPS;
    }
    EventLogGA("GetLink", "");
    window.prompt("To copy the link to the currently displayed map to your clippoard press Ctrl+C and Enter", url);
}

function GetSerie(serie) {
    var prj = MAIN_PROJ;
    var sel = document.getElementById("sel" + mapBOX);
    serie = serie.replace(prj, "");
    if (sel.options[sel.selectedIndex].value == serie)
        return sel.selectedIndex;
    for (var s = 0; s < sel.options.length; s++)
        if (sel.options[s].value == serie)
            return s;
    return sel.selectedIndex;
}

function SetSerie(so) {
    var prj = MAIN_PROJ;
    var sel = document.getElementById("sel" + mapBOX);
    so = so.replace(prj, "");
    var s = 0;
    for (s = 0; s < sel.options.length; s++)
        if (sel.options[s].value == so) {
            sel.selectedIndex = s;
            break;
        }
    if ((s == sel.options.length) && (typeof compSeries[so] != 'undefined')) {
        var c = compSeries[so];
        var cc = compSeries[c.value];
        for (s = 0; s < sel.options.length; s++)
            if (sel.options[s].value == c.value) {
                sel.selectedIndex = s;
                sel.options[sel.selectedIndex].value = cc.value;
                sel.options[sel.selectedIndex].className = cc.className;
                sel.options[sel.selectedIndex].innerHTML = cc.label;
                break;
            }
    }
    cSerie = sel.options[sel.selectedIndex].value;
    bSerie['st'] = cSerie;
    bSerie['ct'] = cSerie;
    bSerie['sct'] = cSerie;
    bSerie['c'] = cSerie;
    bSerie['t'] = cSerie;
    bSerie['bg'] = cSerie;
    bSerie['b'] = cSerie;
}

function CleverMergeDIR(vw1, vw2, DIR) {
    if (!vw1.intersects(vw2)) return null;
    if (vw1.contains(vw2) || vw2.contains(vw1)) return null;
    var ne1 = vw1.getNorthEast();
    var ne2 = vw2.getNorthEast();
    var sw1 = vw1.getSouthWest();
    var sw2 = vw2.getSouthWest();
    var diffV = Math.max(Math.abs(sw1.lat - ne2.lat), Math.abs(sw2.lat - ne1.lat)) / Math.abs(sw1.lat - ne1.lat);
    var diffH = Math.max(Math.abs(sw1.lng - ne2.lng), Math.abs(sw2.lng - ne1.lng)) / Math.abs(sw1.lng - ne1.lng);
    if (diffV > diffH && DIR == 'HORZ') return null;
    if (diffH > diffV && DIR == 'VERT') return null;
    var w = 0;
    var e = 0;
    var s = 0;
    var n = 0;
    if (diffV > diffH) {
        w = Math.min(ne1.lng, ne2.lng);
        e = Math.max(sw1.lng, sw2.lng);
        s = Math.min(sw1.lat, sw2.lat);
        n = Math.max(ne1.lat, ne2.lat);
    } else {
        w = Math.max(ne1.lng, ne2.lng);
        e = Math.min(sw1.lng, sw2.lng);
        s = Math.max(sw1.lat, sw2.lat);
        n = Math.min(ne1.lat, ne2.lat);
    }
    var vw = new L.LatLngBounds(new L.LatLng(s, w), new L.LatLng(n, e));
    return vw;
}

function CleverMergeRemoveDuplicates(vwTAB) {
    if (!vwTAB.length) return;
    var toDEL = [];
    for (var v1 = 0; v1 < vwTAB.length; v1++)
        for (var v2 = v1 + 1; v2 < vwTAB.length; v2++) {
            if (vwTAB[v1].contains(vwTAB[v2]))
                toDEL.push(v2);
            else if (vwTAB[v2].contains(vwTAB[v1]))
                toDEL.push(v1);
        }
    if (!toDEL.length) return;
    toDEL = sort_unique(toDEL);
    for (var d = 0; d < toDEL.length; d++)
        vwTAB.splice(toDEL[d], 1);
}

function vwTABsort(a, b) {
    return a.getNorthEast().distanceTo(a.getSouthWest()) - b.getNorthEast().distanceTo(b.getSouthWest());
}

function CleverMerge(vwTAB) {
    var vwH = [];
    for (var v1 = 0; v1 < vwTAB.length; v1++)
        for (var v2 = v1 + 1; v2 < vwTAB.length; v2++) {
            var vw = CleverMergeDIR(vwTAB[v1], vwTAB[v2], "HORZ");
            if (vw == null) continue;
            vwH.push(vw);
        }
    CleverMergeRemoveDuplicates(vwH);
    var vwHV = [];
    if (vwH.length) {
        for (var v1 = 0; v1 < vwH.length; v1++)
            for (var v2 = v1 + 1; v2 < vwH.length; v2++) {
                var vw = CleverMergeDIR(vwH[v1], vwH[v2], "VERT");
                if (vw == null) continue;
                vwHV.push(vw);
            }
        CleverMergeRemoveDuplicates(vwHV);
    }
    var vwV = [];
    for (var v1 = 0; v1 < vwTAB.length; v1++)
        for (var v2 = v1 + 1; v2 < vwTAB.length; v2++) {
            var vw = CleverMergeDIR(vwTAB[v1], vwTAB[v2], "VERT");
            if (vw == null) continue;
            vwV.push(vw);
        }
    CleverMergeRemoveDuplicates(vwV);
    var vwVH = [];
    if (vwV.length) {
        for (var v1 = 0; v1 < vwV.length; v1++)
            for (var v2 = v1 + 1; v2 < vwV.length; v2++) {
                var vw = CleverMergeDIR(vwV[v1], vwV[v2], "HORZ");
                if (vw == null) continue;
                vwVH.push(vw);
            }
        CleverMergeRemoveDuplicates(vwVH);
    }
    for (var v = 0; v < vwH.length; v++) vwTAB.push(vwH[v]);
    for (var v = 0; v < vwV.length; v++) vwTAB.push(vwV[v]);
    for (var v = 0; v < vwHV.length; v++) vwTAB.push(vwHV[v]);
    for (var v = 0; v < vwVH.length; v++) vwTAB.push(vwVH[v]);
    CleverMergeRemoveDuplicates(vwTAB);
    vwTAB.sort(vwTABsort);
}
var rectTAB = [];

function AddViewportLoaded(boxType, vw, debug) {
    if (boxType == "st1") {
        vw[0][0] = -180;
        vw[0][1] = -90;
        vw[1][0] = 180;
        vw[1][1] = 90;
    }
    vw = new L.LatLngBounds(new L.LatLng(vw[0][1], vw[0][0]), new L.LatLng(vw[1][1], vw[1][0]));
    var d = (typeof debug != "undefined") ? debug : "";
    if (vwLOADED[boxType] === null) {
        vwLOADED[boxType] = [];
        vwLOADED["default_" + boxType] = vw.toBBoxString();
    }
    vwLOADED[boxType].push(vw);
    var prevLEN = 0;
    while (prevLEN != vwLOADED[boxType].length) {
        prevLEN = vwLOADED[boxType].length;
        CleverMerge(vwLOADED[boxType]);
    }
    if (typeof window.bgMODE != 'undefined' && window.bgMODE == 1) {
        return;
    }
    var cvw = GetViewport(gmL_MapsDict[mapBOX], boxType);
    DebugMSG("AddViewportLoaded(): " + boxType + "=" + vw.toBBoxString() + "   current=" + cvw.toBBoxString() + " " + d + "<br/>");
    if (!cvw.equals(vw)) {
        setTimeout("onMapStateChange({ 'type': 'VW_DIFF' });", 100);
    }
}

function needNewData(vw, boxType) {
    var prp = gmL_MapsPropsDict[mapBOX],
        KEY = 'featureGroup' + boxType;
    if (typeof prp[KEY] == 'undefined') return false;
    var polys = prp[KEY].getLayers(),
        poly = null,
        b = null,
        aSerie = (cSerie.length < 4) ? MAIN_PROJ + cSerie : cSerie;
    for (var p = 0; p < polys.length; p++) {
        poly = polys[p];
        b = poly.getBounds();
        if (CheckPolySerieLoaded(poly, boxType, aSerie)) continue;
        if (vw.contains(b) || vw.intersects(b))
            return true;
    }
    return false;
}

function getSkipViewport(vw) {
    var osmMAP = gmL_MapsDict[mapBOX];
    var z = osmMAP.getZoom();
    var skipTab = [];
    var bLVLS = (z <= 6) ? ['b', 'bg', 't', 'c', 'sct', 'st'] : ['b', 'bg', 't', 'c', 'ct', 'st'];
    for (var b = 0; b < bLVLS.length; b++) {
        var skip = null;
        var boxType = bLVLS[b];
        var bVW = vwLOADED[boxType];
        if (bVW !== null && (SEARCH_REQ != reqID)) {
            var bLEN = bVW.length;
            for (var v = bLEN - 1; v >= 0 && skip === null; v--) {
                var bv = bVW[v];
                if (bv.contains(vw))
                    skip = !needNewData(bv, boxType) ? bv.toBBoxString() : "S";
            }
            var sTAB = [],
                bnds = new L.LatLngBounds(vw.getSouthEast(), vw.getNorthWest());
            for (var v = bLEN - 1; v >= 0 && skip === null; v--) {
                var bv = bVW[v];
                if (vw.intersects(bv) && !needNewData(bv, boxType)) {
                    bnds.extend(bv);
                    sTAB.push(bv.toBBoxString());
                }
            }
            if (skip === null && sTAB.length >= 3)
                skip = bnds.toBBoxString() + ":" + sTAB.join(":");
            for (var v = bLEN - 1; v >= 0 && skip === null; v--) {
                var bv = bVW[v];
                if (vw.contains(bv) && !needNewData(bv, boxType))
                    skip = bv.toBBoxString();
            }
            for (var v = bLEN - 1; v >= 0 && skip === null; v--) {
                var bv = bVW[v];
                if (vw.intersects(bv) && !needNewData(bv, boxType)) {
                    skip = bv.toBBoxString();
                }
            }
        }
        skip = (skip === null) ? '' : skip;
        skipTab.push(skip);
    }
    return skipTab.join("|");
}

function AddViewport(boxType, vw) {
    var skip = getSkipViewport(vw).toString();
    return {
        'load': vw.toBBoxString(),
        'skip': skip
    };
}

function IsViewportLoaded(vw, boxType) {
    var vp = vwLOADED[boxType];
    if (vp === null)
        return 0;
    var vwLEN = vp.length - 1;
    for (var v = vwLEN; v >= 0; v--)
        if (vp[v].contains(vw) && !needNewData(vp[v], boxType))
            return 1;
    return 0;
}

function GetViewport(osmMAP, boxType) {
    var add = (window.mobileVersion) ? 0.05 : 0.03;
    var adj = Math.min(MAP_WIDTH, 900);
    var vw = osmMAP.getBounds().padEx(add, 900 / adj);
    CACHE_IT |= (boxType == "st") || (vwLOADED["default_" + boxType] == vw.toBBoxString());
    return vw;
}

function CanSkipBoxTypeSwitch(pBoxType, nBoxType, serie) {
    var vKEY = nBoxType + serie,
        prp = gmL_MapsPropsDict[mapBOX],
        nKEY = 'featureGroup' + nBoxType;
    if (typeof serieCache[vKEY] == 'undefined' || typeof prp[nKEY] == 'undefined') return true;
    var nPolys = prp[nKEY].getLayers(),
        poly = null,
        b = null,
        vw = gmL_MapsDict[mapBOX].getBounds();
    for (var p = 0; p < nPolys.length; p++) {
        poly = nPolys[p];
        b = poly.getBounds();
        if (vw.contains(b) || vw.intersects(b))
            return false;
    }
    return true;
}
(function() {
    var initializing = false,
        fnTest = /xyz/.test(function() {
            xyz;
        }) ? /\b_super\b/ : /.*/;
    this.Class = function() {};
    Class.extend = function(prop) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
                return function() {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]) : prop[name];
        }

        function Class() {
            if (!initializing && this.init) this.init.apply(this, arguments);
        }
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        return Class;
    };
})();
var AbstractColor = Class.extend({});
var Hex = AbstractColor.extend({
    init: function(hex) {
        this.hex = hex;
    },
    toRGB: function() {
        var r = ((this.hex & 0xFF0000) >> 16);
        var g = ((this.hex & 0x00FF00) >> 8);
        var b = ((this.hex & 0x0000FF));
        return new RGB(r, g, b);
    },
    toCIELCh: function() {
        return this.toRGB().toXYZ().toCIELab().toCIELCh();
    },
    toString: function() {
        var s = this.hex.toString(16);
        return ("000000".substr(0, (6 - s.length)) + s).toUpperCase();
    }
});
var RGB = AbstractColor.extend({
    init: function(r, g, b) {
        this.r = Math.min(255, Math.max(r, 0));
        this.g = Math.min(255, Math.max(g, 0));
        this.b = Math.min(255, Math.max(b, 0));
    },
    toHex: function() {
        return new Hex(this.r << 16 | this.g << 8 | this.b);
    },
    toXYZ: function() {
        var tmp_r = this.r / 255;
        var tmp_g = this.g / 255;
        var tmp_b = this.b / 255;
        if (tmp_r > 0.04045) {
            tmp_r = Math.pow(((tmp_r + 0.055) / 1.055), 2.4);
        } else {
            tmp_r = tmp_r / 12.92;
        }
        if (tmp_g > 0.04045) {
            tmp_g = Math.pow(((tmp_g + 0.055) / 1.055), 2.4);
        } else {
            tmp_g = tmp_g / 12.92;
        }
        if (tmp_b > 0.04045) {
            tmp_b = Math.pow(((tmp_b + 0.055) / 1.055), 2.4);
        } else {
            tmp_b = tmp_b / 12.92;
        }
        tmp_r = tmp_r * 100;
        tmp_g = tmp_g * 100;
        tmp_b = tmp_b * 100;
        var x = tmp_r * 0.4124 + tmp_g * 0.3576 + tmp_b * 0.1805;
        var y = tmp_r * 0.2126 + tmp_g * 0.7152 + tmp_b * 0.0722;
        var z = tmp_r * 0.0193 + tmp_g * 0.1192 + tmp_b * 0.9505;
        return new XYZ(x, y, z);
    }
});
var XYZ = AbstractColor.extend({
    init: function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    },
    toRGB: function() {
        var var_X = this.x / 100;
        var var_Y = this.y / 100;
        var var_Z = this.z / 100;
        var var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986;
        var var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415;
        var var_B = var_X * 0.0557 + var_Y * -0.2040 + var_Z * 1.0570;
        if (var_R > 0.0031308) {
            var_R = 1.055 * Math.pow(var_R, (1 / 2.4)) - 0.055;
        } else {
            var_R = 12.92 * var_R;
        }
        if (var_G > 0.0031308) {
            var_G = 1.055 * Math.pow(var_G, (1 / 2.4)) - 0.055;
        } else {
            var_G = 12.92 * var_G;
        }
        if (var_B > 0.0031308) {
            var_B = 1.055 * Math.pow(var_B, (1 / 2.4)) - 0.055;
        } else {
            var_B = 12.92 * var_B;
        }
        var r = Math.round(var_R * 255);
        var g = Math.round(var_G * 255);
        var b = Math.round(var_B * 255);
        return new RGB(r, g, b);
    },
    toCIELab: function() {
        var Xn = 95.047;
        var Yn = 100.000;
        var Zn = 108.883;
        var x = this.x / Xn;
        var y = this.y / Yn;
        var z = this.z / Zn;
        if (x > 0.008856) {
            x = Math.pow(x, 1 / 3);
        } else {
            x = (7.787 * x) + (16 / 116);
        }
        if (y > 0.008856) {
            y = Math.pow(y, 1 / 3);
        } else {
            y = (7.787 * y) + (16 / 116);
        }
        if (z > 0.008856) {
            z = Math.pow(z, 1 / 3);
        } else {
            z = (7.787 * z) + (16 / 116);
        }
        if (y > 0.008856) {
            var l = (116 * y) - 16;
        } else {
            var l = 903.3 * y;
        }
        var a = 500 * (x - y);
        var b = 200 * (y - z);
        return new CIELab(l, a, b);
    }
});
var CIELCh = AbstractColor.extend({
    init: function(l, c, h) {
        this.l = l;
        this.c = c;
        this.h = h < 360 ? h : (h - 360);
    },
    toHex: function() {
        return this.toCIELab().toXYZ().toRGB().toHex();
    },
    toCIELab: function() {
        var l = this.l;
        var hradi = this.h * (Math.PI / 180);
        var a = Math.cos(hradi) * this.c;
        var b = Math.sin(hradi) * this.c;
        return new CIELab(l, a, b);
    }
});
var CIELab = AbstractColor.extend({
    init: function(l, a, b) {
        this.l = l;
        this.a = a;
        this.b = b
    },
    toXYZ: function() {
        var ref_X = 95.047;
        var ref_Y = 100.000;
        var ref_Z = 108.883;
        var var_Y = (this.l + 16) / 116;
        var var_X = this.a / 500 + var_Y;
        var var_Z = var_Y - this.b / 200;
        if (Math.pow(var_Y, 3) > 0.008856) {
            var_Y = Math.pow(var_Y, 3);
        } else {
            var_Y = (var_Y - 16 / 116) / 7.787;
        }
        if (Math.pow(var_X, 3) > 0.008856) {
            var_X = Math.pow(var_X, 3);
        } else {
            var_X = (var_X - 16 / 116) / 7.787;
        }
        if (Math.pow(var_Z, 3) > 0.008856) {
            var_Z = Math.pow(var_Z, 3);
        } else {
            var_Z = (var_Z - 16 / 116) / 7.787;
        }
        var x = ref_X * var_X;
        var y = ref_Y * var_Y;
        var z = ref_Z * var_Z;
        return new XYZ(x, y, z);
    },
    toCIELCh: function() {
        var var_H = Math.atan2(this.b, this.a);
        if (var_H > 0) {
            var_H = (var_H / Math.PI) * 180;
        } else {
            var_H = 360 - (Math.abs(var_H) / Math.PI) * 180
        }
        var l = this.l;
        var c = Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.b, 2));
        var h = var_H;
        return new CIELCh(l, c, h);
    }
});
eval(function(p, a, c, k, e, r) {
    e = function(c) {
        return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) r[e(c)] = k[c] || e(c);
        k = [function(e) {
            return r[e]
        }];
        e = function() {
            return '\\w+'
        };
        c = 1
    };
    while (c--)
        if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p
}('e s(){f.8=g;f.9=g;h i,j=Q.R;3((i=j.r("S"))>=0)f.8=6;U 3((i=j.r("V/"))>=0||(i=j.r("W"))>=0)f.9=6}h 5=t s();h 1=t Z();e 11(a,b){1.N=2.12(b);3(5.8){1.X=4.7.k+2.l.m+2.n.m;1.Y=4.7.o+2.l.p+2.n.p}3(5.9){1.X=a.k+4.u;1.Y=a.o+4.v}1.L=w(1.N.q.z,10);1.T=w(1.N.q.A,10);3(B(1.L))1.L=0;3(B(1.T))1.T=0;3(5.8){2.C("D",c);2.C("E",d);4.7.F=6;4.7.G=g}3(5.9){2.H("I",c,6);2.H("J",d,6);a.K()}}e c(a){h x,y;3(5.8){x=4.7.k+2.l.m+2.n.m;y=4.7.o+2.l.p+2.n.p}3(5.9){x=a.k+4.u;y=a.o+4.v}1.N.q.z=(1.L+x-1.X)+"M";1.N.q.A=(1.T+y-1.Y)+"M";3(5.8){4.7.F=6;4.7.G=g}3(5.9)a.K()}e d(a){3(5.8){2.O("D",c);2.O("E",d)}3(5.9){2.P("I",c,6);2.P("J",d,6)}}', 62, 65, '|dOb|document|if|window|bw|true|event|isIE|isNS|||dragGo|dragStop|function|this|false|var||ua|clientX|documentElement|scrollLeft|body|clientY|scrollTop|style|indexOf|Browser|new|scrollX|scrollY|parseInt|||left|top|isNaN|attachEvent|onmousemove|onmouseup|cancelBubble|returnValue|addEventListener|mousemove|mouseup|preventDefault||px||detachEvent|removeEventListener|navigator|userAgent|MSIE||else|Netscape6|Gecko|||Object||dragStartPopup|getElementById'.split('|'), 0, {}));

function getDOMPosition(who) {
    var T = 0,
        L = 0;
    while (who) {
        L += who.offsetLeft;
        T += who.offsetTop;
        who = who.offsetParent;
    }
    return [L, T];
}

function SetStyleValue(obj, name, value) {
    try {
        obj[name] = value;
    } catch (e) {
        ReportError("PROBLEM SETTING CSS " + name + "=" + value);
    }
}
var interpolateTAB = [];
interpolateTAB[parseInt(0xA50026).toString() + "_" + parseInt(0x006837).toString()] = [0xA50026, 0xD73027, 0xF46D43, 0xFDAE61, 0xFEE08B, 0xFFFFBF, 0xD9EF8B, 0xA6D96A, 0x66BD63, 0x1A9850, 0x006837];
interpolateTAB[parseInt(0xA50026).toString() + "_" + parseInt(0x313695).toString()] = [0xA50026, 0xD73027, 0xF46D43, 0xFDAE61, 0xFEE090, 0xFFFFBF, 0xE0F3F8, 0xABD9E9, 0x74ADD1, 0x4575B4, 0x313695];
interpolateTAB[parseInt(0x9E0142).toString() + "_" + parseInt(0x5E4FA2).toString()] = [0x9E0142, 0xD53E4F, 0xF46D43, 0xFDAE61, 0xFEE08B, 0xFFFFBF, 0xE6F598, 0xABDDA4, 0x66C2A5, 0x3288BD, 0x5E4FA2];
interpolateTAB[parseInt(0xFFF556).toString() + "_" + parseInt(0x000000).toString()] = [0xFFF556, 0xFFED4D, 0xFFE645, 0xFFDE3D, 0xFFD735, 0xFFCF2D, 0xFFC726, 0xFFBF1E, 0xFFB717, 0xFFAF0F, 0xFFA708, 0xFF9F02, 0xFF9600, 0xFE8E00, 0xFD8500, 0xFC7D00, 0xFB7401, 0xF96A05, 0xF7610A, 0xF5560E, 0xF34C12, 0xF14016, 0xEE321A, 0xEB211D, 0xE80020, 0xE80020, 0xDF0023, 0xD50025, 0xCC0027, 0xC20029, 0xB9002A, 0xAF002A, 0xA5022B, 0x9B042B, 0x92072A, 0x88092A, 0x7E0C29, 0x740E28, 0x6B0F26, 0x611025, 0x581123, 0x4E1121, 0x45111E, 0x3C111C, 0x331019, 0x2A0F16, 0x220D12, 0x1A090E, 0x100407, 0x000000];
interpolateTAB[parseInt(0xF9F8FF).toString() + "_" + parseInt(0x1C3E40).toString()] = [0xF9F8FF, 0xF3F3FB, 0xEDEDF7, 0xE6E8F4, 0xDFE3F0, 0xD8DEEC, 0xD1D9E8, 0xCAD4E5, 0xC2CFE1, 0xBACADD, 0xB2C6D9, 0xAAC1D4, 0xA2BDD0, 0x9AB8CB, 0x92B4C7, 0x89AFC2, 0x81ABBD, 0x78A7B7, 0x70A2B2, 0x679EAC, 0x5F9AA6, 0x5695A0, 0x4E9199, 0x468C93, 0x3E888C, 0x3E888C, 0x3D8589, 0x3B8185, 0x3A7E82, 0x387B7F, 0x37787B, 0x357578, 0x347175, 0x326E72, 0x316B6E, 0x2F686B, 0x2E6568, 0x2D6265, 0x2B5F62, 0x2A5C5E, 0x28595B, 0x275658, 0x265355, 0x245052, 0x234D4F, 0x214A4C, 0x204749, 0x1F4446, 0x1D4143, 0x1C3E40];
interpolateTAB[parseInt(0xFFEA17).toString() + "_" + parseInt(0x1C3E40).toString()] = [0xFFEA17, 0xEEE923, 0xDEE72D, 0xCEE537, 0xBFE340, 0xB0E049, 0xA2DD52, 0x94DA5A, 0x86D761, 0x79D368, 0x6DCF6F, 0x61CA75, 0x55C67B, 0x4AC280, 0x40BD85, 0x36B889, 0x2EB38C, 0x29AE8F, 0x26A991, 0x26A392, 0x289E92, 0x2D9992, 0x329391, 0x388E8F, 0x3E888C, 0x3E888C, 0x3D8589, 0x3B8185, 0x3A7E82, 0x387B7F, 0x37787B, 0x357578, 0x347175, 0x326E72, 0x316B6E, 0x2F686B, 0x2E6568, 0x2D6265, 0x2B5F62, 0x2A5C5E, 0x28595B, 0x275658, 0x265355, 0x245052, 0x234D4F, 0x214A4C, 0x204749, 0x1F4446, 0x1D4143, 0x1C3E40];
interpolateTAB[parseInt(0xF8FFE3).toString() + "_" + parseInt(0x000000).toString()] = [0xF8FFE3, 0xF4F9D7, 0xF0F2CB, 0xEDECC0, 0xEBE5B4, 0xE9DEA8, 0xE7D69D, 0xE6CF92, 0xE6C787, 0xE5BF7D, 0xE5B774, 0xE5AF6B, 0xE5A662, 0xE59E5B, 0xE59554, 0xE58B4E, 0xE58249, 0xE57745, 0xE56D42, 0xE56241, 0xE45640, 0xE34940, 0xE23940, 0xE02642, 0xDE0044, 0xDE0044, 0xD40343, 0xCA0742, 0xC10A41, 0xB70D3F, 0xAD0F3E, 0xA4113C, 0x9A123A, 0x911438, 0x871536, 0x7E1534, 0x751631, 0x6C162F, 0x63162C, 0x5A1529, 0x511526, 0x481423, 0x401420, 0x37131D, 0x2F111A, 0x271016, 0x200D13, 0x19090E, 0x0F0507, 0x000000];
interpolateTAB[parseInt(0xFFD1A2).toString() + "_" + parseInt(0x000000).toString()] = [0xFFD1A2, 0xFACB9C, 0xF4C596, 0xEFBF90, 0xEABA8A, 0xE4B485, 0xDFAE7F, 0xDAA879, 0xD5A373, 0xCF9D6E, 0xCA9768, 0xC59263, 0xC08C5D, 0xBB8758, 0xB58152, 0xB07C4D, 0xAB7648, 0xA67143, 0xA16B3D, 0x9C6638, 0x966133, 0x915C2E, 0x8C5629, 0x875124, 0x824C1F, 0x824C1F, 0x7E4820, 0x7A4421, 0x764021, 0x713C22, 0x6D3922, 0x683522, 0x633222, 0x5E2F22, 0x592C22, 0x532921, 0x4E2621, 0x492320, 0x43211F, 0x3E1E1E, 0x381C1C, 0x331A1B, 0x2D1819, 0x281517, 0x221315, 0x1D1112, 0x180D0F, 0x12090B, 0x0A0406, 0x000000];
var gDist = null;
var dist = null;
var rsPrevSerie = "";
var rsPrevVW = null;
var dontClearDists = 0;
var myNav = navigator.userAgent.toLowerCase();
var ieVer = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : 20;
var isSAFARI = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
var GRAD_ME_OFFSET_X = 0;
var GRD_LEFT = getDOMPosition(document.getElementById(mapBOX))[0];

function initAllLevels(defaultValue) {
    var obj = {};
    for (var i in DL_OSM) {
        obj[i] = defaultValue;
    }
    return obj;
}
var vwLOADED = initAllLevels(null);
var bOpactDEF = initAllLevels(opacit);
bOpactDEF.st += 0.15;
bOpactDEF.ct += 0.10;
bOpactDEF.sct += 0.10;
bOpactDEF.c += 0.10;
var bThick = initAllLevels(0.5);
var bFill = initAllLevels('#0000AA');
var bSerie = initAllLevels(cSerie);
var oSlider = null;
var cPicker = null;
var bBordrDEF = '#FFFFFF';
var minValColorDEF = '0xF7FCFD';
var maxValColorDEF = '0x4D004B';
var showBordersDEF = 1;
var distUSdataDEF = 1;
var selColorDEF = '#FFFF15';
var plaColorDEF = '#FF0000';
var staColorDEF = '#DEC106';
var bBordr = getCookie('bBordr', bBordrDEF);
var minValColor = getCookie('minValColorEx', minValColorDEF);
var maxValColor = getCookie('maxValColorEx', maxValColorDEF);
var selColor = getCookie('selColor', selColorDEF);
var plaColor = getCookie('plaColor', plaColorDEF);
var staColor = getCookie('staColor', staColorDEF);
var showBordersC = getCookie('showBorders', showBordersDEF);
var distUSdataC = getCookie('distUSdata', distUSdataDEF);
var bOpact = {};
for (var b in bOpactDEF)
    bOpact[b] = getCookie('op_' + b, bOpactDEF[b]);
var showBorders = 1;

function recalcScale(src) {
    if (typeof serieCache[cBoxType + cSerie] == 'undefined') return;
    ChangeStatus();
    var sSerie = getSelectOption(cSerie).innerHTML;
    var osmMAP = gmL_MapsDict[mapBOX];
    var vw = osmMAP.getBounds();
    CUR_ZOOM_LEVEL = osmMAP.getZoom();
    if (rsPrevSerie == sSerie && rsPrevVW && rsPrevVW.equals(vw)) {
        if (typeof window.bgMODE == 'undefined' || window.bgMODE == 0)
            DebugMSG('recalcScale()[SRC = ' + src + ' s=' + cSerie + ' t=' + cBoxType + ' SKIP]<br/>\n');
        return;
    }
    rsPrevVW = vw;
    rsPrevSerie = sSerie;
    distViewPolys = [];
    var rsKEY = 'featureGroup' + cBoxType,
        prp = gmL_MapsPropsDict[mapBOX];
    if (0 || typeof prp[rsKEY] == 'undefined') {
        var sbox = (SEARCH_REQ) ? document.getElementById('sbox').value : "";
        var mv = LAST_MOVE.value.toString();
        var log = "rsKEY not defined SRC=" + src + " LAST_POPUP_FIPS=" + window.lastPopupFIPS + " SEARCH_REQ=" + SEARCH_REQ + " SBOX=" + sbox;
        log += " LAST_MOVE = " + mv + " VW=" + vw.toBBoxString() + " LAST_AJAX_REQUEST=" + LAST_AJAX_REQUEST;
        log += " polySTATS = " + GetPolyStats();
        ReportError(log);
    }
    var polys = prp[rsKEY].getLayers(),
        pUsed = [],
        vUsed = [],
        minVal = null,
        maxVal = null,
        distView = {},
        plen = polys.length,
        scPV = serieCache[cBoxType + cSerie].pv;
    for (var p = 0; p < plen; p++) {
        if (!vw.intersects(polys[p].getBounds())) continue;
        var val = scPV[p];
        if (val != "" && val != naFLAG) {
            var dVal = parseFloat(val.match(/-{0,1}[0-9,.]+/gi).toString().replace(',', ''));
            if (isNaN(dVal)) continue;
            if (typeof distView[dVal] == 'undefined') distView[dVal] = 0;
            distView[dVal]++;
            if (minVal === null || (dVal < minVal)) {
                minVal = dVal;
            }
            if (maxVal === null || (dVal > maxVal)) {
                maxVal = dVal;
            }
            distViewPolys.push({
                'val': dVal,
                'idx': p
            });
        }
        pUsed.push(p);
        vUsed.push(val);
    }
    var mm = normalizeMinMax(minVal, maxVal, sSerie);
    distView = normalizeDistribution(distView, mm, sSerie);
    dist = distView.join("\n");
    if (isNaN(mm[0]) || isNaN(mm[1])) throw new Error("NaN detected");
    DebugMSG('recalcScale()[SRC = ' + src + ' s=' + cSerie + ' t=' + cBoxType + ' minVal=' + mm[0] + '  maxVal=' + mm[1] + '  minValG=' + mm[2] + '  maxValG=' + mm[3] + ' ZL=' + osmMAP.getZoom() + ']<br/>\n');
    var polyColors = getFillColors(vUsed, mm[0], mm[1]);
    var bWeight = (showBorders) ? bThick[cBoxType].toString() : 0;
    plen = polyColors.length;
    for (var p = 0; p < plen; p++) {
        var fColor = polyColors[p],
            pu = pUsed[p],
            poly = polys[pu];
        var fOpac = (!hideNoData || fColor != noDataColor) ? bOpact[cBoxType] : 0;
        var bOpac = (showBorders) ? opacit : fOpac / 10;
        var bColor = (showBorders) ? bBordr : polyColors[p];
        poly._fillColor = fColor;
        poly.setStyle({
            color: bColor,
            weight: bWeight,
            opacity: bOpac,
            fillColor: fColor,
            fillOpacity: fOpac
        });
    }
    showDistributionGraph();
    omapLegendUpdate(mm, minVal, maxVal, sSerie);
    mL_layerToFront(mapBOX, [selectedPoly, cityPoly, stateBorders, brdLayer, lblLayer]);
    var z = osmMAP.getZoom();
    HandleStateBorders(z);
    togglePopup();
    distView = null;
}

function getStateBorderWeight(zl) {
    if (zl < 6) return 0.5;
    if (zl < 10) return 1.0;
    return 2.0;
}

function getStateBorderDetail(zl) {
    if (zl < 6) return "LOW";
    if (zl < 10) return "MED";
    return "HIGH";
}

function getStateBorderStyle(zl) {
    var bWeight = getStateBorderWeight(zl);
    return "'" + staColor + "', " + bWeight + ", 0.75,'#000000',0";
}

function HandleStateBorders(z) {
    var LVL = getStateBorderDetail(z);
    var stCurSTYLE = getStateBorderStyle(z);
    if (stateBorders !== null && (cBoxType == "st" || dEpST_LVL != LVL)) {
        stateBorders.hideLayerGroup();
        stateBorders = null;
    }
    if (stateBorders === null && dEpST[LVL] !== null && cBoxType != "st") {
        if (typeof gmL_MapsPropsDict[mapBOX]['featureGroupstate' + LVL] == 'undefined')
            stateBorders = mL_addRawPoly(mapBOX, false, dEpST[LVL], stCurSTYLE, [], [], "state" + LVL);
        else
            stateBorders = gmL_MapsPropsDict[mapBOX]['featureGroupstate' + LVL];
        dEpST[LVL] = "";
        stateBorders._map = gmL_MapsDict[mapBOX];
        stateBorders.showLayerGroup();
        stSTYLE = stCurSTYLE;
    }
    dEpST_LVL = LVL;
    if (stateBorders !== null && stCurSTYLE != stSTYLE) {
        stSTYLE = stCurSTYLE;
        var bWeight = getStateBorderWeight(z);
        stateBorders.setStyle({
            weight: bWeight
        });
    }
}

function genStyle(boxType, fillColor) {
    var brdC = (showBorders) ? bBordr : fillColor;
    var brdW = (showBorders) ? bThick[boxType].toString() : 1;
    var sOp = (!hideNoData || fillColor != noDataColor) ? bOpact[boxType].toString() : "0";
    var style = "'" + brdC + "', " + brdW + ", " + bOpact[boxType].toString() + ",'" + fillColor + "'," + sOp;
    return style;
}

function getFillColors(values, minValGrad, maxValGrad) {
    var c0 = parseInt(minValColor),
        c1 = parseInt(maxValColor),
        colors = [],
        range = maxValGrad - minValGrad;
    for (var v = 0; v < values.length; v++) {
        if (values[v].toString() == '' || values[v] == naFLAG || values[v] == ldFLAG) {
            colors.push(noDataColor);
            continue;
        }
        var x = (!range) ? 0.0 : Math.max(0, (values[v] - minValGrad) / range);
        var c = long2css(interpolate(c0, c1, x));
        colors.push(c);
    }
    return colors;
}

function SwitchColorMode(mode) {
    var sel = document.getElementById('bMAPpopUPcolSEL');
    var a = sel.getElementsByTagName('a');
    var ud = document.getElementById('bMAPpopUPcol');
    var pd = document.getElementById('bMAPpopUPpredefined');
    if (mode) {
        var sel = document.getElementById('selColType');
        if (sel.selectedIndex != 0) {
            sel.selectedIndex = 0;
            var nColor = bBordr;
            cPicker.setValue([parseInt(nColor.substr(1, 2), 16), parseInt(nColor.substr(3, 2), 16), parseInt(nColor.substr(5, 2), 16)], false);
        }
        L.DomUtil.removeClass(a[0], 'active');
        SetStyleValue(ud.style, 'display', 'none');
        SetStyleValue(ud.style, 'visibility', 'hidden');
        L.DomUtil.addClass(a[1], 'active');
        SetStyleValue(pd.style, 'display', 'block');
        SetStyleValue(pd.style, 'visibility', 'visible');
        return;
    }
    L.DomUtil.removeClass(a[1], 'active');
    SetStyleValue(pd.style, 'display', 'none');
    SetStyleValue(pd.style, 'visibility', 'hidden');
    L.DomUtil.addClass(a[0], 'active');
    SetStyleValue(ud.style, 'display', 'block');
    SetStyleValue(ud.style, 'visibility', 'visible');
}

function PatternClick(minCol, maxCol) {
    DebugMSG("PatternClick() ='" + minCol + "','" + maxCol + "'<br/>");
    minValColor = minCol;
    maxValColor = maxCol;
    DrawGradientOnly(parseInt(minValColor), parseInt(maxValColor), 100, 25);
    var s = document.getElementById('selColType');
    s = s.options[s.selectedIndex].value;
    if (s == "MIN")
        cPicker.setValue([parseInt(minValColor.substr(2, 2), 16), parseInt(minValColor.substr(4, 2), 16), parseInt(minValColor.substr(6, 2), 16)], false);
    if (s == "MAX")
        cPicker.setValue([parseInt(maxValColor.substr(2, 2), 16), parseInt(maxValColor.substr(4, 2), 16), parseInt(maxValColor.substr(6, 2), 16)], false);
    rsPrevVW = null;
    recalcScale("pt");
    saveOptions();
}

function DrawColorPattern(minColIN, maxColIN, container) {
    minCol = parseInt(minColIN);
    maxCol = parseInt(maxColIN);
    var p = document.createElement('a');
    p.className = "colorPattern";
    SetStyleValue(p.style, 'backgroundColor', maxCol);
    p.title = "Click to select this color pattern";
    p.href = "javascript:PatternClick('" + minColIN + "','" + maxColIN + "');";
    var gradWidth = 98;
    var gradHeight = 20;
    var x, y, color, bg, spans = [];
    for (x = 0; x <= gradWidth; x++) {
        y = Math.ceil(yAt(x, gradWidth));
        color = interpolate(minCol, maxCol, x / gradWidth);
        bg = long2css(color);
        spans.push(makeSpan(x, y, 1, gradHeight - 2 * y, bg));
    }
    SetStyleValue(p.style, 'backgroundColor', bg);
    p.innerHTML = spans.join("");
    if (typeof window.ColorPatternTAB == 'undefined') window.ColorPatternTAB = [];
    window.ColorPatternTAB.push(p);
    if (window.ColorPatternTAB.length != window.COLOR_PRESETS) return;
    var lColorPatternTAB = window.ColorPatternTAB;
    while (lColorPatternTAB.length) {
        var r = Math.floor(Math.random() * lColorPatternTAB.length);
        r = 0;
        container.appendChild(lColorPatternTAB[r]);
        lColorPatternTAB.splice(r, 1);
    }
}

function getDistCount(distView) {
    var cnt = 0;
    for (var val in distView)
        cnt += distView[val];
    return cnt;
}

function roundDist(distView, minVal, maxVal, roundTo) {
    var distViewN = {};
    minVal = Math.round(minVal * 100.0) / 100;
    distViewN[minVal] = 0;
    distViewN[maxVal] = 0;
    var max = 0;
    for (var val in distView) {
        var tVAL = Math.round(((val - minVal) / roundTo) * 1000.0) / 1000;
        var nVal = Math.floor(tVAL) * roundTo + minVal;
        nVal = Math.round(nVal * 100.0) / 100;
        if (val >= minVal && nVal < minVal)
            nVal = minVal;
        if (val <= maxVal && nVal > maxVal)
            nVal = maxVal;
        if (nVal < minVal || nVal > maxVal) continue;
        if (typeof distViewN[nVal] == 'undefined') distViewN[nVal] = 0;
        distViewN[nVal] += distView[val];
        max = Math.max(distViewN[nVal], max);
    }
    window.roundDistMAX = max;
    return distViewN;
}

function usDistToggle() {
    distUSdata = !distUSdata;
    dist = (distUSdata) ? distViewSortedUS.join("\n") : distViewSortedVW.join("\n");
    showDistributionGraph();
}

function distViewSort(a, b) {
    return a.split(",")[0] - b.split(",")[0];
}

function normalizeDistribution(distView, mm, sSerie) {
    var minVal = mm[0];
    var maxVal = mm[1];
    var minValG = mm[0];
    var maxValG = mm[1];
    distViewSortedVW = [];
    distViewSortedUS = [];
    var boxCNT = getDistCount(distView);
    var bucketCNT = Math.max(Math.min(40, Math.floor(boxCNT / 3)), 2);
    var roundTo = (maxValG - minValG) / bucketCNT;
    DIST_CNT_VS = boxCNT;
    var prec = (roundTo <= 10) ? 10.0 : 1.0;
    while (roundTo * prec < 1) prec *= 10;
    roundTo = Math.round(roundTo * prec) / prec;
    if (roundTo < 0.1) roundTo = 0.1;
    bucketCNT = Math.ceil((maxValG - minValG) / roundTo);
    var val = 0;
    distViewBucket = roundTo;
    distViewMinValG = minValG;
    distViewMaxValG = maxValG;
    var distViewN = roundDist(distView, minVal, maxVal, roundTo);
    var maxV = window.roundDistMAX;
    for (val = minValG; val <= maxValG; val += roundTo) {
        val = Math.round(val * 100.0) / 100;
        var valV = (typeof distViewN[val] != 'undefined') ? distViewN[val] : 0;
        distViewSortedVW.push(val + "," + valV);
        if (roundTo == 0) break;
    }
    if (val - roundTo < maxValG) distViewSortedVW.push(maxValG + ",0");
    distViewSortedVW.sort(distViewSort);
    var distViewUS = roundDist(DistGetUS(cBoxType, cSerie), minVal, maxVal, roundTo);
    var maxU = (window.roundDistMAX) ? window.roundDistMAX : 1;
    distViewRS = Math.round(-maxU * 1000 / maxV) / 1000;
    for (val = minValG; val <= maxValG; val += roundTo) {
        val = Math.round(val * 100.0) / 100;
        var valV = (typeof distViewN[val] != 'undefined') ? distViewN[val] : 0;
        var valU = (typeof distViewUS[val] != 'undefined') ? distViewUS[val] : 0;
        distViewSortedUS.push(val + "," + valV + "," + Math.round(valU * 1000 / distViewRS) / 1000);
        if (roundTo == 0) break;
    }
    if (val - roundTo < maxValG) distViewSortedUS.push(maxValG + ",0,0");
    distViewSortedUS.sort(distViewSort);
    if (!distUSdata || (arr_indexOf(distSKIP, cBoxType) != -1))
        return distViewSortedVW;
    return distViewSortedUS;
}

function DistGetUS(boxType, serie) {
    boxType = boxType.replace("sct", "ct");
    return distCACHE[boxType + "_" + serie];
}

function GetUsDistStatus(serie) {
    var st = (typeof distCACHE["st_" + serie] != 'undefined') ? "1" : "0";
    var ct = (typeof distCACHE["ct_" + serie] != 'undefined') ? "1" : "0";
    var c = (typeof distCACHE["c_" + serie] != 'undefined') ? "1" : "0";
    var t = (typeof distCACHE["t_" + serie] != 'undefined') ? "1" : "0";
    var bg = (typeof distCACHE["bg_" + serie] != 'undefined') ? "1" : "0";
    var b = (typeof distCACHE["b_" + serie] != 'undefined') ? "1" : "0";
    return b + "|" + bg + "|" + t + "|" + c + "|" + ct + "|" + st;
}

function DistSaveUS(boxType, serie, dist) {
    boxType = boxType.replace("sct", "ct");
    dist = dist.split("|");
    var rnd = dist.shift();
    var nDist = [];
    var prev = 0;
    var sum = 0;
    for (var d = 0; d < dist.length; d += 2) {
        var val = prev + dist[d] * rnd;
        prev = val;
        nDist[val] = parseInt(dist[d + 1]);
        sum += parseInt(dist[d + 1]);
    }
    serie = serie.replace(MAIN_PROJ, '');
    distCACHE[boxType + "_" + serie] = nDist;
    DebugMSG("DistSaveUS(" + boxType + ", " + serie + ")[DISTINCT=" + dist.length / 2 + "  SUM=" + sum + "  PREC=" + rnd + "]<br/>");
    DIST_CNT_US = sum;
}

function interpolatePRV(a, b, s) {
    if (s > 1) s = 1;
    var n = 0;
    for (var i = 24;
        (i -= 8) >= 0;) {
        var ca = (a >> i) & 0xff;
        var cb = (b >> i) & 0xff;
        var cc = Math.floor(ca * (1 - s) + cb * s);
        n |= cc << i;
    }
    return n;
}

function h2s(hex) {
    var s = hex.toString(16);
    return ("000000".substr(0, (6 - s.length)) + s).toUpperCase();
}

function interpolate(a, b, s) {
    var KEY = a.toString() + "_" + b.toString();
    if (typeof interpolateTAB[KEY] == 'undefined') {
        var estTab = [],
            steps = 25;
        for (var e = 0; e < steps; e++)
            estTab.push("0x" + h2s(calcVAL(new Hex(a), new Hex(b), e * 1 / (steps - 1)).hex));
        interpolateTAB[KEY] = estTab;
        return interpolateEx(estTab, s);
    }
    return interpolateEx(interpolateTAB[KEY], s);
}

function long2css(n) {
    var a = "0123456789ABCDEF";
    var s = '#';
    for (var i = 24;
        (i -= 4) >= 0;) {
        s += a.charAt((n >> i) & 0xf);
    }
    return s;
}

function yAt(x, gradWidth) {
    var dx = Math.max(-x, x - gradWidth);
    if (dx >= 0) {
        return -Math.sqrt(-dx * dx);
    }
    return 0;
}

function makeSpan(x, y, width, height, color) {
    return '<div style="left:' + parseFloat(x) + '%;background:' + color + ';">&nbsp;</div>';
}

function cVal(val, minStr, maxStr, title) {
    minStr = minStr.toString();
    maxStr = maxStr.toString();
    if (val == ldFLAG) return val;
    var origVal = val;
    var y = (title.indexOf('year') != -1);
    var p = (title.indexOf('%') + title.indexOf('%') != -2);
    if (y && !p) return Math.round(val).toString();
    val = (parseFloat(val) >= 100) ? Math.round(val) : Math.round(val * 100) / 100;
    var sign = (val < 0) ? "-" : (title.indexOf('change') != -1) ? "+" : "";
    if (p) {
        if (sign == "") return parseFloat(Math.min(100, val)) + "%";
        return sign + parseFloat(Math.abs(val)) + "%";
    }
    val = Math.abs(val);
    if (parseInt(val) >= 1000) {
        val = val.toString();
        var off = val.length - 3;
        while (off > 0) {
            val = val.substr(0, off) + "," + val.substr(off);
            off -= 3;
        }
    }
    if (minStr.indexOf('$') + maxStr.indexOf('$') + title.indexOf('$') != -3) {
        val = "$" + val;
        if (origVal > 1000 && val.indexOf(',001') != -1)
            val = "over " + val.replace(/,001/, ",000");
    }
    return sign + val;
}

function valFloor(minValG, maxVal) {
    if (minValG >= 100000)
        minValG = Math.floor(minValG / 100000) * 100000;
    else if (minValG >= 50000)
        minValG = Math.floor(minValG / 10000) * 10000;
    else if (minValG >= 5000)
        minValG = Math.floor(minValG / 5000) * 5000;
    else if (minValG >= 2000)
        minValG = Math.floor(minValG / 500) * 500;
    else if (minValG >= 1000)
        minValG = Math.floor(minValG / 250) * 250;
    else if (minValG >= 100)
        minValG = Math.floor(minValG / 100) * 100;
    if (maxVal >= minValG * 100)
        minValG = 0;
    return Math.round(minValG * 10) / 10;
}

function valCeil(maxValG) {
    if (maxValG == 1000001) maxValG = 1000000;
    else if (maxValG == 250001) maxValG = 250000;
    else if (maxValG == 200001) maxValG = 200000;
    else if (maxValG == 2001) maxValG = 2000;
    if (maxValG >= 500000)
        maxValG = Math.ceil(maxValG / 50000) * 50000;
    if (maxValG >= 100000)
        maxValG = Math.ceil(maxValG / 25000) * 25000;
    else if (maxValG >= 100000)
        maxValG = Math.ceil(maxValG / 10000) * 10000;
    else if (maxValG >= 5000)
        maxValG = Math.ceil(maxValG / 5000) * 5000;
    else if (maxValG >= 2000)
        maxValG = Math.ceil(maxValG / 500) * 500;
    else if (maxValG >= 1000)
        maxValG = Math.ceil(maxValG / 250) * 250;
    else if (maxValG >= 100)
        maxValG = Math.ceil(maxValG / 50) * 50;
    else
        maxValG = Math.round(maxValG * 100) / 100;
    return maxValG;
}

function normalizeMinMax(minVal, maxVal, title) {
    var res = [];
    var mapOSM = gmL_MapsDict[mapBOX];
    var curW = MAP_WIDTH;
    var prvW = (typeof mapOSM.zoomFS != 'undefined' && typeof mapOSM.zoomFS.prevW != 'undefined') ? mapOSM.zoomFS.prevW : curW;
    var maxbreaks = Math.floor(curW / prvW * 9);
    var step = 0;
    var smallStep = 0;
    if (minVal !== null && maxVal !== null) {
        var diff = maxVal - minVal;
        var skipMinALG = (title.indexOf(" year ") != -1 && minVal >= 1800 && maxVal <= 2100);
        var skipMaxALG = (skipMinALG);
        if (!skipMinALG && minVal >= 0) minVal -= Math.min(minVal, diff * 2 / 100);
        if (!skipMaxALG) maxVal += diff * 2 / 100;
        if (title.indexOf("%") != -1) maxVal = Math.min(100, maxVal);
        diff = maxVal - minVal;
        var divpart = diff / maxbreaks;
        step = (divpart) ? Math.pow(10, Math.floor(Math.log(divpart) / Math.LN10)) : 0;
        smallStep = step / 10.0;
        res.push(minVal);
        res.push(maxVal);
    } else {
        res.push(0);
        res.push(0);
    }
    if (step == 0) {
        res.push(0);
        res.push(0);
        res.push(0);
        res.push(0);
        res.push(0);
        res.push(0);
        return res;
    }
    if (step * maxbreaks < diff) {
        step *= 2.0;
        smallStep = step / 2.0;
    }
    if (step * maxbreaks < diff) {
        step *= 2.5;
        smallStep = step / 5.0;
    }
    if (step * maxbreaks < diff) {
        step *= 2.0;
        smallStep = step / 10.0;
    }
    res.push(Math.ceil(minVal / step) * step);
    res.push(Math.floor(maxVal / step) * step);
    var numOfSmallSteps = (res[3] - res[2]) / smallStep;
    var maxAllowedSmallSteps = 7.0 * maxbreaks;
    if (numOfSmallSteps > maxAllowedSmallSteps)
        smallStep *= 5.0;
    var stepPRC = Math.round(step * 10000 / (res[1] - res[0])) / 100;
    res.push(step);
    res.push(stepPRC);
    var smallStepPRC = Math.round(smallStep / step * step * 100000 / (res[1] - res[0])) / 1000;
    res.push(smallStepPRC);
    var minOFF = 0;
    if (minVal < res[2]) {
        minOFF = Math.round((res[2] - minVal) * 100.0 / (maxVal - minVal) * 1000.0) / 1000.0;
    }
    res.push(minOFF);
    window.nomrmMM = res;
    return res;
}

function CalculateLabelDimmensions(vLabel) {
    var m = [];
    if (typeof window.gradLabDims == 'undefined') {
        var vlWidth, tLabel, vlTest = document.getElementById('vlTest');
        tLabel = "0123456789$";
        vlTest.innerHTML = tLabel;
        vlWidth = vlTest.clientWidth / tLabel.length;
        for (var c = 0; c < tLabel.length; c++) m[tLabel.charAt(c)] = vlWidth;
        tLabel = "%";
        vlTest.innerHTML = tLabel;
        vlWidth = vlTest.clientWidth / tLabel.length;
        for (var c = 0; c < tLabel.length; c++) m[tLabel.charAt(c)] = vlWidth;
        tLabel = ",";
        vlTest.innerHTML = tLabel;
        vlWidth = vlTest.clientWidth / tLabel.length;
        for (var c = 0; c < tLabel.length; c++) m[tLabel.charAt(c)] = vlWidth;
        window.gradLabDims = m;
    } else m = window.gradLabDims;
    var l = 0;
    for (var c = 0; c < vLabel.length; c++) {
        var ch = vLabel.charAt(c);
        l += (typeof m[ch] != 'undefined') ? m[ch] : m["0"];
    }
    return l;
}

function DrawGradientLables(mm, title) {
    var minVal = mm[0];
    var maxVal = mm[1];
    var minValG = mm[2];
    var maxValG = mm[3];
    var step = mm[4];
    var stepPRC = mm[5];
    var smallStepPRC = mm[6];
    var minOFF = mm[7];
    var lgd = document.getElementById('valuemap');
    var lab = document.getElementById('valmaplg');
    if (minValG == maxValG && minValG == 0) {
        minValG = minVal;
        maxValG = maxVal;
    }
    var cLabels = '';
    var off = 0;
    var mark = 0;
    var pWidth = MAP_WIDTH - 1;
    var lWidth = MAP_WIDTH - 1;
    var vWidth = maxValG - minValG;
    var lLabel = "";
    var center = 0,
        vLabel;
    var wFIX = pWidth / lWidth;
    while (mark * stepPRC <= 100) {
        vLabel = cVal(minValG + mark * step, '', '', title);
        if (window.mobileVersion)
            vLabel = vLabel.replace(/\,000/g, 'k');
        var vlWidth = CalculateLabelDimmensions(vLabel);
        center = ((vlWidth - 1) * 50 / lWidth);
        off = Math.round(((minOFF + mark * stepPRC) * 100) * wFIX) / 100 - center;
        if (off > 100) break;
        off = Math.min(off, (lWidth - vlWidth) * 100 / lWidth);
        off = Math.max(0, off);
        cLabels += "<span style='position:absolute;z-index:2000;left:" + off + "%;'>" + vLabel + "</span>";
        mark++;
        if (step == 0) break;
    }
    document.getElementById('valmaplg').innerHTML = "<span id='vlTest'>123</span>" + cLabels;
}

function omapLegendUpdate(mm, minVal, maxVal, title) {
    var lgd = document.getElementById('valuemap');
    var minStr = (minVal !== null) ? minVal.toString() : "null";
    var maxStr = (maxVal !== null) ? maxVal.toString() : "null";
    var isFS = (typeof gmL_MapsDict[mapBOX].zoomFS != 'undefined') ? gmL_MapsDict[mapBOX].zoomFS._isFullscreen.toString() : "FALSE";
    var gradCHECK = title + "_" + minStr + "_" + maxStr + "_" + isFS + "_" + minValColor.toString() + "_" + maxValColor.toString();
    if (typeof lgd.className !== 'undefined' && lgd.className == gradCHECK) return;
    lgd.className = gradCHECK;
    DrawMapGradient(mm);
    DrawGradientLables(mm, title);
}

function DrawGradientOnly(c0, c1, gradWidth, gradHeight) {
    var x, y, color, spans = [];
    var parent = document.getElementById('valuemap');
    for (x = 0; x <= gradWidth; x += 0.1) {
        y = Math.ceil(yAt(x, gradWidth));
        color = interpolate(c0, c1, x / gradWidth);
        spans.push(makeSpan(x, y, 1, gradHeight - 2 * y, long2css(color)));
    }
    var g = document.getElementById('gradientBAR');
    if (g === null) {
        g = document.createElement('div');
        g.id = "gradientBAR";
        SetStyleValue(g.style, 'width', "100%");
        SetStyleValue(g.style, 'height', '100%');
        SetStyleValue(g.style, 'position', 'absolute');
        SetStyleValue(g.style, 'left', '0px');
        SetStyleValue(g.style, 'top', '0px');
        SetStyleValue(g.style, 'zIndex', Math.max(90, parent.style.zIndex - 10));
        if (g.parentNode != parent) {
            parent.appendChild(g);
        }
    }
    g.innerHTML = spans.join('');
}

function getContrastYIQ(hexcolor) {
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '111111' : 'EEEEEE';
}

function oppositeColor(c) {
    return getContrastYIQ(c);
}

function DrawMapGradient(mm) {
    var minVal = mm[0];
    var maxVal = mm[1];
    var minValG = mm[2];
    var maxValG = mm[3];
    var step = mm[5] / 100;
    var smallstep = mm[6] / 100;
    var minOFF = mm[7];
    var c0 = parseInt(minValColor);
    var c1 = parseInt(maxValColor);
    var grd = document.getElementById('gradientBAR');
    var parent = document.getElementById('valuemap');
    var d, dd, off, m, scales = [];
    if (grd === null) {
        DrawGradientOnly(c0, c1, 100.0, 25.0);
        grd = document.getElementById('gradientBAR');
    } else {
        var gs = document.getElementById("gradientSCALES");
        if (gs !== null) parent.removeChild(gs);
    }
    if (step == 0) return;
    var mainSCALES = [];
    for (d = 0; d < 1.0; d += step) {
        if (minOFF == 0 && d == 0) continue;
        off = Math.round((minOFF + 100.0 * d) * 100.0) / 100.0;
        var c = long2css(interpolate(c0, c1, off / 100)).substr(1);
        var o = oppositeColor(c);
        scales.push('<div class="scale" style="left:' + off + '%;background:#' + o + '">&nbsp;</div>');
        mainSCALES.push(off);
    }
    if (minVal < 0 && maxVal > 0) {
        var d = -minVal / (maxVal - minVal);
        off = Math.round((100.0 * d) * 100.0) / 100.0;
        for (m = 0; m < mainSCALES.length; m++)
            if (Math.abs(mainSCALES[m] - off) < 0.1) break;
        if (m == mainSCALES.length)
            scales.push('<div classs="scale" style="left:' + off + '%;top:2px;height:22px;background:#55f;" title="0" alt="0">&nbsp;</div>');
    }
    var minStepOFF = (minOFF - Math.floor(minOFF / mm[6]) * mm[6]);
    for (d = 0.0; d < 1; d += smallstep) {
        off = Math.round(minStepOFF * 100.0 + d * 10000.0) / 100;
        if (off == 0 || off == 100) continue;
        for (m = 0; m < mainSCALES.length; m++)
            if (Math.abs(mainSCALES[m] - off) < 0.1) break;
        if (m != mainSCALES.length) continue;
        var c = long2css(interpolate(c0, c1, off / 100)).substr(1);
        var o = oppositeColor(c);
        scales.push('<div style="left:' + off + '%;background:#' + o + '">&nbsp;</div>');
    }
    var gs = document.createElement('div');
    gs.innerHTML = scales.join('');
    gs.id = "gradientSCALES";
    SetStyleValue(gs.style, 'width', "100%");
    SetStyleValue(gs.style, 'height', '100%');
    SetStyleValue(gs.style, 'position', 'absolute');
    SetStyleValue(gs.style, 'left', '0px');
    SetStyleValue(gs.style, 'top', '0px');
    SetStyleValue(gs.style, 'zIndex', Math.max(100, parseInt(grd.style.zIndex)) + 1);
    if (gs.parentNode != parent) {
        parent.appendChild(gs);
    }
}

function hndThumb() {
    if (window.mobileVersion) return;
    if (typeof sThumb != 'undefined') {
        return 0;
    }
    SetStyleValue(document.getElementById('ts' + mapBOX).style, 'display', "none");
    SetStyleValue(document.getElementById('ts' + mapBOX).style, 'visibility', "hidden");
    SetStyleValue(document.getElementById('th' + mapBOX).style, 'visibility', "visible");
    SetStyleValue(document.getElementById('sp' + mapBOX).style, 'visibility', "visible");
    SetStyleValue(document.getElementById('v' + mapBOX).style, 'visibility', "visible");
    sThumb = false;
    return 1;
}

function RGBToHex(rgb) {
    var char = "0123456789ABCDEF";
    return String(char.charAt(Math.floor(rgb / 16))) + String(char.charAt(rgb - (Math.floor(rgb / 16) * 16)));
}

function ChangeGmapOpacity(val) {
    hndThumb();
    opacit = val / 100;
    if (bOpact[cBoxType] == opacit) return;
    bOpact[cBoxType] = opacit;
    rsPrevSerie = null;
    recalcScale("cgo");
}

function toggleBorders() {
    if (window.mobileVersion) return;
    var b = document.getElementById('toggleBRD').childNodes[0];
    if (b.innerHTML == "Hide borders") {
        showBorders = 0;
        b.innerHTML = "Show borders";
    } else {
        showBorders = 1;
        b.innerHTML = "Hide borders";
    }
    if (typeof gmL_MapsPropsDict == 'undefined' || gmL_MapsPropsDict[mapBOX] == 'undefined' || typeof gmL_MapsPropsDict[mapBOX]['featureGroup' + cBoxType] == 'undefined') return;
    rsPrevVW = null;
    recalcScale("tb");
    if (showBordersC != 0)
        saveOptions();
    showBordersC = 1;
}

function togglePopup() {
    if (typeof window.openPopupOnLoad == 'undefined' || window.openPopupOnLoad == '') return;
    var props = gmL_MapsPropsDict[mapBOX];
    if (typeof props['featureGroup' + cBoxType] == 'undefined' || typeof fips2poly[cBoxType + window.openPopupOnLoad] == 'undefined') return;
    var polys = props['featureGroup' + cBoxType].getLayers();
    var p = fips2poly[cBoxType + window.openPopupOnLoad];
    window.openPopupOnLoad = '';
    SelectPoly(polys[p], 1);
}

function toggleHistogram() {
    var b = document.getElementById('toggleHIS').childNodes[0];
    if (b.innerHTML == "Hide US histogram") {
        distUSdata = 0;
        b.innerHTML = "Show US histogram";
    } else {
        distUSdata = 1;
        b.innerHTML = "Hide US histogram";
    }
    dontClearDists = 1;
    rsPrevVW = null;
    recalcScale("th");
    dist = (distUSdata && (arr_indexOf(distSKIP, cBoxType) == -1)) ? distViewSortedUS.join("\n") : distViewSortedVW.join("\n");
    showDistributionGraph();
    if (distUSdataC != 0)
        saveOptions();
    distUSdataC = 1;
}
var COOKIES_TO_SET = null;

function setCookieDomain(name, value, exp) {
    COOKIES_TO_SET += value + "|";
    return;
    var domain = location.hostname.replace("www", "") + (location.port ? ':' + location.port : '');
    setCookie(name, value, exp, "/", domain);
    return;
    var expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * exp);
    var cookie = name + "=" + escape(value) + ";expires=" + expires.toGMTString() + ";domain=" + domain + ";path=/";
    document.cookie = cookie;
    DebugMSG("SET COOCKIE = " + cookie + "<br/>");
}

function saveOptions() {
    COOKIES_TO_SET = "";
    var exdays = 365;
    setCookieDomain('showBorders', showBorders, exdays);
    setCookieDomain('bBordr', bBordr, exdays);
    setCookieDomain('minValColorEx', minValColor, exdays);
    setCookieDomain('maxValColorEx', maxValColor, exdays);
    for (var b in bOpact)
        setCookieDomain('op_' + b, bOpact[b], exdays);
    setCookieDomain('selColor', selColor, exdays);
    setCookieDomain('plaColor', plaColor, exdays);
    setCookieDomain('staColor', staColor, exdays);
    setCookieDomain('distUSdata', distUSdata, exdays);
    return ajaxRequest("COOKIE", 'js/getBoxes.php?setCookie=' + escape(COOKIES_TO_SET));
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name, defaultValue) {
    var PFIX = 'CK_';
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == PFIX + c_name) {
            return unescape(y);
        }
    }
    return defaultValue;
}

function resetOptions() {
    minValColor = minValColorDEF;
    maxValColor = maxValColorDEF;
    selColor = selColorDEF;
    plaColor = plaColorDEF;
    staColor = staColorDEF;
    document.getElementById('vmapOSM').value = bOpactDEF[cBoxType] * 100;
    ChangeGmapOpacity(bOpactDEF[cBoxType] * 100);
    oSlider.setValue(Math.round(bOpactDEF[cBoxType] * 100 / scaleFactor));
    for (var b in bOpactDEF) bOpact[b] = bOpactDEF[b];
    if (showBorders != showBordersDEF) toggleBorders();
    if (distUSdata != distUSdataDEF) toggleHistogram();
    if (bBordr != bBordrDEF) {
        var s = document.getElementById('selColType');
        var ps = s.selectedIndex;
        s.selectedIndex = 0;
        cPicker.setValue([parseInt(bBordrDEF.substr(1, 2), 16), parseInt(bBordrDEF.substr(3, 2), 16), parseInt(bBordrDEF.substr(5, 2), 16)], false);
    }
    if (selectedPoly !== null)
        selectedPoly.setStyle({
            color: selColor
        });
    if (cityPoly !== null)
        cityPoly.setStyle({
            color: plaColor
        });
    var prp = gmL_MapsPropsDict[mapBOX];
    var LVLS = ["LOW", "MED", "HIGH"];
    for (var i = 0; i < LVLS.length; i++) {
        LVL = LVLS[i];
        if (typeof prp['featureGroupstate' + LVL] == 'undefined') continue;
        prp['featureGroupstate' + LVL].setStyle({
            color: staColor
        });
    }
    DrawGradientOnly(parseInt(minValColor), parseInt(maxValColor), 100, 25);
    rsPrevVW = null;
    recalcScale("ro");
    saveOptions();
}

function ChangeGmapBorder(bColor) {
    var s = document.getElementById('selColType');
    s = s.options[s.selectedIndex].value;
    var newBrd = "#" + RGBToHex(bColor.newValue[0]) + RGBToHex(bColor.newValue[1]) + RGBToHex(bColor.newValue[2]);
    if (s == "BRD" && (bBordr != newBrd)) {
        bBordr = newBrd;
        gmL_MapsPropsDict[mapBOX]['featureGroup' + cBoxType].setStyle({
            color: bBordr
        });
        saveOptions();
        return;
    }
    var newCol = "0x" + RGBToHex(bColor.newValue[0]) + RGBToHex(bColor.newValue[1]) + RGBToHex(bColor.newValue[2]);
    if (s == "MIN" && (newCol != minValColor)) {
        minValColor = newCol;
        DrawGradientOnly(parseInt(minValColor), parseInt(maxValColor), 100, 25);
        rsPrevVW = null;
        recalcScale("cgb1");
        saveOptions();
        return;
    }
    if (s == "MAX" && (newCol != maxValColor)) {
        maxValColor = newCol;
        DrawGradientOnly(parseInt(minValColor), parseInt(maxValColor), 100, 25);
        rsPrevVW = null;
        recalcScale("cgb2");
        saveOptions();
        return;
    }
    if (s == "SEL" && (newBrd != selColor)) {
        selColor = newBrd;
        if (selectedPoly !== null)
            selectedPoly.setStyle({
                color: selColor
            });
        saveOptions();
        return;
    }
    if (s == "PLA" && (newBrd != plaColor)) {
        plaColor = newBrd;
        if (cityPoly !== null)
            cityPoly.setStyle({
                color: plaColor
            });
        saveOptions();
        return;
    }
    if (s == "STA" && (newBrd != staColor)) {
        staColor = newBrd;
        var prp = gmL_MapsPropsDict[mapBOX];
        var LVLS = ["LOW", "MED", "HIGH"];
        for (var i = 0; i < LVLS.length; i++) {
            LVL = LVLS[i];
            if (typeof prp['featureGroupstate' + LVL] == 'undefined') continue;
            prp['featureGroupstate' + LVL].setStyle({
                color: staColor
            });
        }
        saveOptions();
        return;
    }
}

function hideBPOP() {
    var p = document.getElementById('bMAPpopUP');
    SetStyleValue(p.style, 'visibility', 'hidden');
    SetStyleValue(document.getElementById('opContmapOSM').style, 'display', 'none');
    p = document.getElementById('bMAPpopUPcolBRD');
    SetStyleValue(p.style, 'visibility', 'hidden');
    SetStyleValue(p.style, 'display', 'none');
    oSlider.unsubscribe("change", oSliderSet);
    if (window.optionsPaterrnColors != minValColor + "-" + maxValColor) {
        var sCol = minValColor.toString().substr(2) + "-" + maxValColor.toString().substr(2);
        EventLogGA("PatternColorClick", sCol);
    }
}

function setPickBorderPos(m, p) {
    var osmMAP = gmL_MapsDict[mapBOX];
    if (typeof osmMAP.zoomFS == 'undefined' || !osmMAP.zoomFS._isFullscreen) {
        var pos = getDOMPosition(m);
        var lft = (pos[0] + m.clientWidth - 50);
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var o = Math.max(0, lft + p.clientWidth - w + 30);
        SetStyleValue(p.style, 'top', (pos[1] + 5).toString() + "px");
        SetStyleValue(p.style, 'left', (lft - o).toString() + "px");
        return;
    }
    SetStyleValue(p.style, 'top', "");
    SetStyleValue(p.style, 'left', "");
}
var colType = "BRD";

function SwitchColorType(cType) {
    if (cType == "BRD") {
        var c = bBordr;
        cPicker.setValue([parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)], false);
    }
    if (cType == "MIN") {
        var c = minValColor.toString().replace("0x", "#");
        cPicker.setValue([parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)], false);
    }
    if (cType == "MAX") {
        var c = maxValColor.toString().replace("0x", "#");
        cPicker.setValue([parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)], false);
    }
    if (cType == "SEL") {
        var c = selColor.toString().replace("0x", "#");
        cPicker.setValue([parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)], false);
    }
    if (cType == "PLA") {
        var c = plaColor.toString().replace("0x", "#");
        cPicker.setValue([parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)], false);
    }
    if (cType == "STA") {
        var c = staColor.toString().replace("0x", "#");
        cPicker.setValue([parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)], false);
    }
}

function oSliderSet(offsetFromStart) {
    Dom.get('v' + mapBOX).value = oSlider.getRealValue();
    ChangeGmapOpacity(oSlider.getRealValue());
}

function gmapPickBorderCol() {
    var osmMAP = gmL_MapsDict[mapBOX];
    if (!osmMAP.interactionMode) return;
    if (typeof CreateColorPickerPopUp === 'undefined') {
        SetStyleValue(document.getElementById('sb' + mapBOX).style, 'visibility', 'visible');
        var b = document.getElementById('bt' + mapBOX);
        SetStyleValue(b.style, 'width', '150px');
        b.innerHTML = "<span>Loading... </span>";
        ycCallback = gmapPickBorderCol;
        var s = document.createElement("script");
        s.async = true;
        s.type = "text/javascript";
        s.src = "http://pics3.city-data.com/js/yControlsPack.js";
        document.body.appendChild(s);
        return;
    }
    EventLogGA("OpenOptions", "");
    window.optionsPaterrnColors = minValColor + "-" + maxValColor;
    var m = document.getElementById('boxMAPborder');
    var p = document.getElementById('bMAPpopUP');
    var o = document.getElementById('opContmapOSM');
    var b = document.getElementById('bMAPpopUPcolBRD');
    SetStyleValue(o.style, 'visibility', 'visible');
    SetStyleValue(o.style, 'display', 'block');
    SetStyleValue(b.style, 'visibility', 'visible');
    SetStyleValue(b.style, 'display', 'block');
    if (typeof p.className != 'undefined' && p.className.indexOf('popupAlreadyLoaded') != -1) {
        SetStyleValue(p.style, 'visibility', 'visible');
        var v = bOpact[cBoxType] * 100;
        setPickBorderPos(m, p);
        oSlider.setValue(v);
        oSlider.subscribe("change", oSliderSet);
        return;
    }
    var t = document.getElementById('bMAPpopUPtit');
    t.onmousedown = function(e) {
        dragStartPopup(e || event, 'bMAPpopUP');
    };
    L.DomUtil.addClass(p, 'popupAlreadyLoaded');
    SetStyleValue(p.style, 'visibility', 'visible');
    setPickBorderPos(m, p);
    cPicker = new YAHOO.widget.ColorPicker('bMAPpopUPcol', {
        showhsvcontrols: true,
        showhexcontrols: true,
        images: {
            PICKER_THUMB: pThb,
            HUE_THUMB: hThb
        }
    });
    cPicker.on("rgbChange", ChangeGmapBorder);
    cPicker.setValue([parseInt(bBordr.substr(1, 2), 16), parseInt(bBordr.substr(3, 2), 16), parseInt(bBordr.substr(5, 2), 16)], false);
    oSlider = YAHOO.widget.Slider.getHorizSlider('sb' + mapBOX, 'th' + mapBOX, topConstraint, bottomConstraint);
    oSlider.setValue(Math.round(bOpact[cBoxType] * 100.0 / scaleFactor));
    oSlider.getRealValue = function() {
        return Math.round(this.getValue() * scaleFactor);
    };
    oSlider.subscribe("change", oSliderSet);
    setTimeout("SwitchColorMode(1);", 100);
}
var compSeries = [];

function compBtnSet(label, btn1, btn2) {
    if (window.mobileVersion) {
        if (label.indexOf(" change since 2000)") != -1) {
            var chg = (label.indexOf("(% change since 2000)") != -1) ? '% change since 2k' : '$ change since 2k';
            btn1.lastElementChild.innerHTML = chg;
            btn1.firstElementChild.checked = false;
        } else {
            btn1.firstElementChild.checked = true;
        }
    } else {
        if (label.indexOf(" change since 2000)") != -1) {
            L.DomUtil.addClass(btn1, 'active');
            L.DomUtil.removeClass(btn2, 'active');
        } else {
            L.DomUtil.addClass(btn2, 'active');
            L.DomUtil.removeClass(btn1, 'active');
        }
    }
}

function compSerieSet() {
    var sel = document.getElementById("sel" + mapBOX);
    var val = sel.options[sel.selectedIndex].value;
    var c = compSeries[val];
    if (window.mobileVersion) {
        var swit = document.getElementById('CM_seriesSwitch');
        if (typeof compSeries[val] == 'undefined') {
            SetStyleValue(swit.style, 'visibility', 'hidden');
            return;
        }
        SetStyleValue(swit.style, 'visibility', 'visible');
        if (c.label.indexOf(" change since 2000)") != -1) {
            var chg = (c.label.indexOf("(% change since 2000)") != -1) ? '% change since 2k' : '$ change since 2k';
            swit.lastElementChild.innerHTML = chg;
        }
        compBtnSet(c.label, swit);
    } else {
        var btn1 = document.getElementById('compSerie1');
        var btn2 = document.getElementById('compSerie2');
        if (typeof compSeries[val] == 'undefined') {
            SetStyleValue(btn1.style, 'visibility', 'hidden');
            SetStyleValue(btn2.style, 'visibility', 'hidden');
            return;
        }
        SetStyleValue(btn1.style, 'visibility', 'visible');
        SetStyleValue(btn2.style, 'visibility', 'visible');
        if (c.label.indexOf(" change since 2000)") != -1) {
            var chg = (c.label.indexOf("(% change since 2000)") != -1) ? '% change since 2k' : '$ change since 2k';
            btn2.innerHTML = '<span>' + chg + '</span>';
        }
        compBtnSet(c.label, btn1, btn2);
    }
}

function compSerieClick(btn) {
    var sel = document.getElementById("sel" + mapBOX);
    var val = sel.options[sel.selectedIndex].value;
    var c = compSeries[val];
    if (window.mobileVersion) {
        var swit = document.getElementById('CM_seriesSwitch');
        if (sel.options[sel.selectedIndex].innerHTML.indexOf(" change since 2000)") != -1 && btn == 2) return;
        if (sel.options[sel.selectedIndex].innerHTML.indexOf(" change since 2000)") == -1 && btn == 1) return;
        compBtnSet(c.label, swit);
    } else {
        var btn1 = document.getElementById('compSerie1');
        var btn2 = document.getElementById('compSerie2');
        if (sel.options[sel.selectedIndex].innerHTML.indexOf(" change since 2000)") != -1 && btn == 2) return;
        if (sel.options[sel.selectedIndex].innerHTML.indexOf(" change since 2000)") == -1 && btn == 1) return;
        compBtnSet(c.label, btn1, btn2);
    }
    sel.options[sel.selectedIndex].value = c.value;
    sel.options[sel.selectedIndex].className = c.className;
    sel.options[sel.selectedIndex].innerHTML = c.label;
    SwitchSerie(c.value);
}

function ParseSeries() {
    var sel = document.getElementById("sel" + mapBOX);
    for (var s = 0; s < sel.options.length; s++) {
        var curr = sel.options[s];
        curr.value = curr.value.replace(MAIN_PROJ, "");
        boxMapSerieToTitle[curr.value] = curr.innerHTML;
        if (curr.value.toString().length < 4)
            boxMapSerieToTitle[MAIN_PROJ + curr.value] = curr.innerHTML;
        if (sel.options[s].innerHTML.indexOf(" change since 2000)") != -1) {
            if (!s) continue;
            p = s - 1;
            var prev = sel.options[p];
            var cS = curr.innerHTML.replace(" change since 2000)", "");
            cS = cS.substr(0, cS.length - 3);
            if (prev.innerHTML.indexOf(cS) == -1) continue;
            var chg = (curr.innerHTML.indexOf("(% change since 2000)") != -1) ? '% change since 2000' : '$ change since 2000';
            compSeries[prev.value] = {
                'className': curr.className,
                'value': curr.value,
                'label': curr.innerHTML,
                'button': chg
            };
            compSeries[curr.value] = {
                'className': prev.className,
                'value': prev.value,
                'label': prev.innerHTML,
                'button': 'Most recent value'
            };
            sel.remove(s);
            s--;
        }
    }
}

function SelectPoly(poly, open) {
    if (selectedPoly !== null)
        selectedPoly.clearLayers();
    var llTAB = [];
    if (typeof poly._latlngs != 'undefined')
        llTAB.push(poly._latlngs);
    else if (typeof poly._layers != 'undefined') {
        for (var l in poly._layers)
            llTAB.push(poly._layers[l]._latlngs);
    }
    if (gDist !== null) {
        var p = fips2poly[cBoxType + poly._FIPS];
        var v = serieCache[cBoxType + cSerie].pv;
        distViewVAL = v[p];
        drawDistCircle(gDist, distViewVAL);
    }
    selectedPoly = mL_addRawPoly(mapBOX, false, llTAB, "'" + selColor + "', 3, 1,'#000000',0", [], [], "sel");
    if (!open) return;
    if (typeof poly._openPopup != 'undefined')
        poly._openPopup({
            latlng: poly.mLcentroid
        });
    if (typeof poly._layers != 'undefined')
        for (l in poly._layers) {
            poly._layers[l]._openPopup({
                latlng: poly.mLcentroid[0]
            });
            break;
        }
    handleGroupPolyClick({
        'layer': poly
    });
}

function markPoly(mp) {
    var mpKEY = 'featureGroup' + cBoxType,
        polys = gmL_MapsPropsDict[mapBOX][mpKEY].getLayers();
    var pWeight = (showBorders) ? bThick[cBoxType].toString() : 0;
    var pST = {
        color: bBordr,
        weight: pWeight,
        opacity: 1
    };
    if (markedPoly !== null && markedPoly < polys.length) {
        var p = markedPoly;
        if (typeof polys[p]._fillColor != 'undefined') {
            var fOpac = (!hideNoData || polys[p]._fillColor != noDataColor) ? bOpact[cBoxType] : 0;
            pST.opacity = (showBorders) ? opacit : fOpac;
            polys[p].setStyle(pST);
        }
    }
    if (mp !== null) {
        var pWeight = bThick[cBoxType].toString();
        pST = {
            color: '#FFFFFF',
            weight: pWeight,
            opacity: 1
        };
        polys[mp].setStyle(pST);
        polys[mp].bringToFront();
    }
    markedPoly = mp;
    mL_layerToFront(mapBOX, isIE ? [brdLayer, lblLayer] : [brdLayer, lblLayer, selectedPoly, cityPoly]);
}

function clearMatchingPolys() {
    if (distViewMathingPolys !== null && distViewMathingPolys.length > 0) {
        var pWeight = (showBorders) ? bThick[cBoxType].toString() : 0;
        var clKEY = 'featureGroup' + cBoxType,
            polys = gmL_MapsPropsDict[mapBOX][clKEY].getLayers();
        for (var d = 0; d < distViewMathingPolys.length; d++) {
            var p = distViewMathingPolys[d];
            if (p >= polys.length) continue;
            var fOpac = (!hideNoData || polys[p]._fillColor != noDataColor) ? bOpact[cBoxType] : 0;
            var bOpac = (showBorders) ? opacit : fOpac;
            polys[p].setStyle({
                color: bBordr,
                weight: pWeight,
                opacity: bOpac
            });
        }
    }
    distViewMathingPolys = null;
    mL_layerToFront(mapBOX, [selectedPoly, cityPoly, stateBorders, brdLayer, lblLayer]);
}

function selectMatchingPolys(minVal, maxVal) {
    minVal = Math.round(minVal * 1000.0) / 1000;
    maxVal = Math.round(maxVal * 1000.0) / 1000;
    clearMatchingPolys();
    var smKEY = 'featureGroup' + cBoxType,
        polys = gmL_MapsPropsDict[mapBOX][smKEY].getLayers();
    var matches = [];
    for (var p = 0; p < distViewPolys.length; p++) {
        var dp = distViewPolys[p],
            idx = dp.idx;
        if (dp.val < minVal || dp.val >= maxVal) continue;
        matches.push(idx);
        polys[idx].setStyle({
            color: '#000000',
            weight: 1,
            opacity: 1
        });
        polys[idx].bringToFront();
    }
    if (!matches.length) return;
    distViewMathingPolys = matches;
}

function underlayCallback(canvas, area, g) {
    if (gDist === null || distViewVAL === null || !gDist.osmMAP.interactionMode) return;
    drawDistCircle(gDist, distViewVAL);
};

function drawDistCircle(g, val) {
    if (g === null || typeof g.plotter_ == 'undefined') return;
    var canvas = g.canvas_ctx_;
    var stepPlot = (typeof g.user_attrs_['stepPlot'] != 'undefined' && g.user_attrs_['stepPlot'] == true);
    var vi = 1;
    var v = -1,
        h = val,
        s = 1;
    h = Math.min(h, g.rawData_[g.rawData_.length - 1][0]);
    h = Math.max(h, g.rawData_[0][0]);
    for (var p = 1; p < g.rawData_.length; ++p) {
        if (g.rawData_[p - 1][0] <= h && g.rawData_[p][0] >= h) {
            var d = g.rawData_[p][0] - g.rawData_[p - 1][0],
                v1 = g.rawData_[p - 1][s],
                v2 = g.rawData_[p][s];
            v = (stepPlot) ? v1 : v1 * (1.0 - (h - g.rawData_[p - 1][0]) / d) + v2 * (1.0 - (g.rawData_[p][0] - h) / d);
            break;
        }
    }
    var bottom_left = g.toDomCoords(h, v);
    var left = bottom_left[0],
        bottom = bottom_left[1];
    if (g.selCircle === null) {
        g.selCircle = document.createElement('div');
        g.selCircle.setAttribute('id', 'valSelected');
        g.selCircle.setAttribute('class', 'circleOverlay');
        g.selCircle.setAttribute('className', 'circleOverlay');
        g.canvas_.parentElement.appendChild(g.selCircle);
    }
    SetStyleValue(g.selCircle.style, 'visibility', 'visible');
    SetStyleValue(g.selCircle.style, 'top', (bottom - 2) + 'px');
    SetStyleValue(g.selCircle.style, 'left', (left - 2) + 'px');
}

function GradientBarMouseMove(e) {
    if (gDist === null || !gDist.osmMAP.interactionMode) return;
    if (!e) e = window.event;
    GRAD_ME_OFFSET_X = (ieVer == 8) ? GRD_LEFT + 10 : 0;
    eventShield.dispatchEvent(gDist.mouseEventElement_, eventShield.mouseEvent("mousemove", e.screenX, e.screenY, e.clientX, e.clientY));
    GRAD_ME_OFFSET_X = 0;
}

function GradientBarMouseLeave(e) {
    if (gDist === null || !gDist.osmMAP.interactionMode) return;
    gDist.legend.innerHTML = "";
    gDist.setLegend(null);
    clearMatchingPolys();
    gDist.clearSelection();
    if (gDist.selCircle !== null && selectedPoly === null) SetStyleValue(gDist.selCircle.style, 'visibility', 'hidden');
}

function GradientBarMouseOut(e) {
    if (!isSAFARI) return;
    if (gDist === null || !gDist.osmMAP.interactionMode) return;
    if (!e) e = window.event;
    GRAD_ME_OFFSET_X = (ieVer == 8) ? GRD_LEFT + 10 : 0;
    eventShield.dispatchEvent(gDist.mouseEventElement_, eventShield.mouseEvent("mouseout", e.screenX, e.screenY, e.clientX, e.clientY));
    GRAD_ME_OFFSET_X = 0;
}

function valueFormatterX(x) {
    selectMatchingPolys(x, x + distViewBucket);
    return cVal(x, "", "", aSerie).replace("+", "") + " &#0150; " + cVal(x + distViewBucket, "", "", aSerie).replace("+", "");
}

function valueFormatterY(x) {
    underlayCallback();
    var prc = 0;
    if (x < 0) {
        x = Math.round(x * distViewRS);
        prc = Math.round(x * 1000 / DIST_CNT_US) / 10;
    } else prc = Math.round(x * 1000 / DIST_CNT_VS) / 10;
    return cVal(x, "", "", "") + " (" + prc + "%)";
}

function handleDistViewMouseOut(a) {
    if (gDist === null) return;
    var d = a.relatedTarget || a.toElement;
    Dygraph.isElementContainedBy(a.target || a.fromElement, gDist.graphDiv) && !Dygraph.isElementContainedBy(d, gDist.graphDiv) && underlayCallback();
}

function handleDistViewMouseMove(e) {
    if (gDist === null) return;
    gDist.setLegend(e);
}

function unhighlightCallback(e) {
    if (gDist === null) return;
    gDist.setLegend(null);
    clearMatchingPolys();
    gDist.toClear = null;
}

function drawHighlightPointCallback(a, b, c, d, e, h, g) {
    if (gDist === null) return;
    var i = gDist.indexFromSetName(b) - 1;
    var p = gDist.layout_.points[i];
    var o = 0,
        n = 0;
    for (var k = 0; k < p.length - 1; k++) {
        if (p[k].canvasx != d) continue;
        n = p[k + 1].canvasx;
        break;
    }
    if (!i) {
        if (typeof gDist.toClear != 'undefined' && gDist.toClear !== null) {
            c.clearRect(gDist.toClear.x - 5 * g, 0, gDist.toClear.x2 - gDist.toClear.x + 10 * g, gDist.height_);
        }
        gDist.toClear = {
            x: d + o,
            y: e - 3,
            x2: n
        };
    }
    if (n > d) {
        var len = gDist.layout_.points.length;
        var ee = (gDist.height_ / len - e);
        c.beginPath();
        if (!i)
            c.rect(d, e - 3, n - d, ee + 3);
        else
            c.rect(d, gDist.height_ / len, n - d, -ee + 3);
        c.fill();
    }
}

function setLegend(e) {
    if (gDist === null || !gDist.osmMAP.interactionMode) return;
    var lg = gDist.legend,
        ls = lg.style;
    if (e === null) {
        SetStyleValue(ls, 'padding', '0');
        SetStyleValue(ls, 'border', '0');
        return;
    }
    var m = MAP_WIDTH;
    var c = L.DomEvent.getMousePosition(e);
    var f = (typeof gmL_MapsDict[mapBOX].zoomFS != 'undefined' && gmL_MapsDict[mapBOX].zoomFS._isFullscreen);
    var o = (!f || c.x / m <= 0.5) ? 0 : lg.clientWidth + 40;
    SetStyleValue(ls, 'padding', '2px 5px');
    SetStyleValue(ls, 'border', '2px solid #aaa');
    SetStyleValue(ls, 'top', (c.y - 5) + 'px');
    SetStyleValue(ls, 'left', (c.x + 20 - o) + 'px');
}

function showDistributionGraph() {
    if (typeof Dygraph == "undefined" || Dygraph === null || dist === null) return;
    dist = dist.replace("0,0\n", "0.0,0.001\n").replace("0,0,0\n", "0.0,0.001,0.001\n");
    if (dist.indexOf("\n") == -1) {
        if (gDist !== null) {
            gDist.destroy();
            gDist = null;
        }
        document.getElementById("graphdiv").innerHTML = "";
        return;
    }
    var sel = document.getElementById("sel" + mapBOX);
    aSerie = sel.options[sel.selectedIndex].innerHTML;
    var labels = (distUSdata && (arr_indexOf(distSKIP, cBoxType) == -1)) ? ["Value", "<span>In displayed area</span>", "<span>; Whole US</span>"] : ["Value", "<span>In displayed area</span>"];
    if (gDist === null) {
        Dygraph.prototype.setLegend = setLegend;
        try {
            var gHeight = (window.mobileVersion) ? 20 : 30;
            gDist = new Dygraph(document.getElementById("graphdiv"), dist, {
                fillGraph: true,
                fillAlpha: 0.40,
                stepPlot: true,
                drawHighlightPointCallback: drawHighlightPointCallback,
                unhighlightCallback: unhighlightCallback,
                labels: labels,
                strokeWidth: 1,
                '<span>; Whole US</span>': {
                    axis1: {},
                    fillGraph: true,
                    strokeWidth: 0
                },
                labelsDiv: "histLABEL",
                interactionModel: {},
                height: gHeight,
                drawXAxis: false,
                drawYAxis: false,
                drawXGrid: false,
                drawYGrid: (labels.length == 3),
                xValueParser: parseFloat,
                axes: {
                    x: {
                        valueFormatter: valueFormatterX
                    },
                    y: {
                        valueFormatter: valueFormatterY
                    }
                }
            });
            gDist.addEvent(window, "mouseout", handleDistViewMouseOut);
            gDist.addEvent(gDist.mouseEventElement_, "mousemove", handleDistViewMouseMove);
            gDist.osmMAP = gmL_MapsDict[mapBOX];
            gDist.legend = document.getElementById('histLABEL');
            if (isIE) SetStyleValue(gDist.legend.style, 'backgroundColor', "#666666");
            gDist.selCircle = null;
            gDist.file_ = null;
        } catch (e) {
            Dygraph = null;
        }
    } else {
        Dygraph.serie = aSerie;
        gDist.updateOptions({
            'file': dist,
            labels: labels,
            drawYGrid: (labels.length == 3),
            axes: {
                x: {
                    valueFormatter: valueFormatterX
                }
            }
        });
        gDist.file_ = null;
        underlayCallback();
    }
    dist = null;
    if (!dontClearDists) {
        distViewSortedVW = null;
        distViewSortedUS = null;
    }
    dontClearDists = 0;
}

function generateLegendDashHTML() {
    return "";
}
Dygraph.prototype.findClosestRow = function(a) {
    a -= GRAD_ME_OFFSET_X;
    var e = this.layout_.points;
    var j = e[0].length;
    do {
        j--;
    } while (j >= 0 && e[0][j].canvasx >= a);
    return this.idxToRow_(0, Math.max(0, j));
};
window.currentEventSHIELD = null;

function eventShield(shieldID, shieldedID, ms) {
    var s = document.createElement('div');
    s.className = 'eventShield';
    var t = s.style;
    s.id = shieldID;
    SetStyleValue(t, 'position', 'absolute');
    SetStyleValue(t, 'zIndex', '99999999');
    SetStyleValue(t, 'display', 'block');
    SetStyleValue(t, 'float', 'left');
    SetStyleValue(t, 'width', '100%');
    SetStyleValue(t, 'height', '100%');
    SetStyleValue(t, 'left', '0');
    SetStyleValue(t, 'top', '0');
    document.getElementById(shieldedID).appendChild(s);
    this.shieldID = shieldID;
    this.shieldedID = shieldedID;
    this.shieldTimeoutID = null;
    this.shieldIntervalID = null;
    this.ms = ms;
    this.shieldDIV = document.getElementById(this.shieldID);
    this.shieldedDIV = document.getElementById(this.shieldedID);
    var th = this;
    this.shieldDIV.onmouseover = function() {
        th.DeactivStart();
    };
    this.shieldDIV.onmouseout = function() {
        th.DeactivEnd();
    };
    this.shieldDIV.onclick = function(e) {
        th.MouseClick(e);
    };
    this.shieldDIV.onmousemove = function() {
        th.MouseMove();
    };
    this.skipVisibilityCheck = false;
}
eventShield.dispatchEvent = function(el, evt) {
    if (el.dispatchEvent) el.dispatchEvent(evt);
    else if (el.fireEvent) el.fireEvent('on' + evt.type, evt);
    return evt;
};
eventShield.mouseEvent = function(type, sx, sy, cx, cy) {
    var evt;
    var e = {
        bubbles: true,
        cancelable: (type != "mousemove"),
        view: window,
        detail: 0,
        screenX: sx,
        screenY: sy,
        clientX: cx,
        clientY: cy,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: undefined,
        type: type
    };
    if (typeof(document.createEvent) == "function") {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode);
    } else if (document.createEventObject) {
        evt = document.createEventObject();
        for (prop in e) {
            evt[prop] = e[prop];
        }
        evt.button = {
            0: 1,
            1: 4,
            2: 2
        }[evt.button] || evt.button;
    }
    return evt;
};
eventShield.prototype.ClearInterval = function() {
    if (this.shieldIntervalID !== null) clearInterval(this.shieldIntervalID);
    this.shieldIntervalID = null;
};
eventShield.prototype.IsVisible = function() {
    if (this.skipVisibilityCheck) return;

    function viewPortHeight() {
        var de = document.documentElement;
        if (!!window.innerWidth) {
            return window.innerHeight;
        } else if (de && !isNaN(de.clientHeight)) {
            return de.clientHeight;
        }
        return de.offsetHeight;
    }

    function getPositionTop(e) {
        var o = 0;
        while (e) {
            o += e["offsetTop"];
            e = e.offsetParent;
        }
        return o;
    }

    function isElementVisible(e) {
        var b = document.body,
            d = document.documentElement,
            pt = getPositionTop(e),
            pb = pt + e.offsetHeight,
            vt = Math.max(b.scrollTop, d.scrollTop),
            vb = vt + viewPortHeight();
        return ((pb >= vt) && (pt <= vb));
    }
    var v = isElementVisible(this.shieldedDIV);
    if (!v) {
        this.ClearInterval();
        this.Activ()
    };
};
eventShield.prototype.Activ = function() {
    var th = this;
    SetStyleValue(this.shieldDIV.style, 'visibility', 'visible');
    this.shieldDIV.onmouseout = function() {
        th.DeactivEnd();
    }
};
eventShield.prototype.Deactiv = function() {
    var th = this;
    if (this.shieldTimeoutID !== null) clearTimeout(this.shieldTimeoutID);
    this.shieldTimeoutID = null;
    SetStyleValue(this.shieldDIV.style, 'visibility', 'hidden');
    this.shieldDIV.onmouseout = null;
    this.shieldedDIV.onmouseout = function() {
        th.MouseOut();
    }
};
eventShield.prototype.MouseOut = function() {
    window.currentEventSHIELD = this;
    this.ClearInterval();
    this.shieldIntervalID = setInterval("window.currentEventSHIELD.IsVisible()", 2000);
};
eventShield.prototype.DeactivStart = function() {
    window.currentEventSHIELD = this;
    this.shieldTimeoutID = setTimeout("window.currentEventSHIELD.Deactiv()", this.ms);
};
eventShield.prototype.MouseMove = function() {
    this.ClearInterval();
    window.currentEventSHIELD = this;
    if (this.shieldTimeoutID !== null) clearTimeout(this.shieldTimeoutID);
    this.shieldTimeoutID = setTimeout("window.currentEventSHIELD.Deactiv()", this.ms);
};
eventShield.prototype.MouseClick = function(e) {
    this.ClearInterval();
    if (!e) var e = window.event;
    this.Deactiv();
    if (typeof document.elementFromPoint == 'function') {
        var el = document.elementFromPoint(e.clientX, e.clientY);
        if (el === null) return;
        eventShield.dispatchEvent(el, eventShield.mouseEvent("click", e.screenX, e.screenY, e.clientX, e.clientY));
    }
};
eventShield.prototype.DeactivEnd = function() {
    if (this.shieldTimeoutID !== null) {
        clearTimeout(this.shieldTimeoutID);
        this.shieldTimeoutID = null;
    }
};

function linInter(v1, v2, f) {
    return v1 + f * (v2 - v1);
}

function cirInter(v1, v2, f) {
    var v = 0;
    var d = v2 - v1;
    if (v1 > v2) {
        v = v1;
        v1 = v2;
        v2 = v;
        d = -d;
        f = 1 - f;
    }
    if (d > 180) {
        v1 = v1 + 360;
        v = (v1 + f * (v2 - v1)) % 360;
    };
    if (d <= 180) {
        v = v1 + f * d;
    }
    return v;
}

function calcLCh(lch1, lch2, f) {
    lch1 = lch1.toCIELCh();
    lch2 = lch2.toCIELCh();
    var nl = cirInter(lch1.l, lch2.l, f);
    var nc = linInter(lch1.c, lch2.c, f);
    var nh = linInter(lch1.h, lch2.h, f);
    var lch = new CIELCh(nl, nc, nh);
    return lch.toHex();
}

function interpolateEx(eTab, f) {
    var step = 1 / (eTab.length - 1);
    var idx = Math.min(eTab.length - 2, Math.floor(f / step));
    var ff = f - idx * step;
    var col = interpolatePRV(eTab[idx], eTab[idx + 1], ff / step);
    return col;
}

function calcVAL(v1, v2, f) {
    return calcLCh(v1, v2, f);
}
var IS_POPUP_OPEN = 0;
var POP_LOAD_MSG = '<div style="height:200px;text-align:center;margin-top:35%;font-weight:bold;">Loading detailed data ...</div>';
window.popupPoly = null;
window.lastPopupFIPS = 0;
window.popup_dragged = false;
var divNote = "<small><br/>(Higher value corresponds to higher diversity)</small>";

function GetPopupContent(poly) {
    if (typeof poly._popupData != 'undefined')
        return poly._popupData;
    if (typeof poly._popup != 'undefined')
        return poly._popup._content;
    if (typeof poly._popupContentRead != 'undefined')
        return poly._popupContentRead;
    if (typeof poly._popupContent != 'undefined')
        return poly._popupContent;
    return null;
}

function SetPopupGraphs() {
    if (typeof Highcharts == 'undefined') return;
    var ts = {
        'font-size': '11px',
        'font-weight': 'bold'
    };
    var ls = {
        'font-size': '9px'
    };

    function showHouseDivGraph(dataVals) {
        if (!dataVals.length) return;
        var chart = new Highcharts.Chart({
            credits: {
                "enabled": false
            },
            colors: ["#AE91CF", "#B4CF91"],
            chart: {
                renderTo: 'hsDiv',
                type: 'bar',
                spacing: [0, 5, 5, 5]
            },
            title: {
                margin: 0,
                text: 'Households by type',
                style: ts
            },
            xAxis: {
                minPadding: 0,
                maxPadding: 0,
                lineWidth: 0,
                title: '',
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    "enabled": false
                },
                tickLength: 0
            },
            yAxis: {
                min: 0,
                max: dataVals[0].data[0] + dataVals[1].data[0],
                title: '',
                minPadding: 0,
                maxPadding: 0,
                lineWidth: 0,
                gridLineWidth: 0,
                labels: {
                    "enabled": false
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    bar: {
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    },
                    events: {
                        legendItemClick: function() {
                            return false;
                        }
                    }
                }
            },
            legend: {
                enabled: true,
                margin: 5,
                reversed: true,
                itemStyle: ls
            },
            tooltip: {
                followPointer: false,
                formatter: function() {
                    return '<b>' + this.series.options.households + " (" + Math.round(this.point.y * 10) / 10 + '%)</b><br/> ' + this.series.name + ' households';
                },
                style: {
                    color: '#333333',
                    fontSize: '9px',
                    padding: '2px'
                },
                hideDelay: 100,
                positioner: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            series: dataVals
        });
        $('#hsDiv .highcharts-legend text').each(function(index, element) {
            $(element).hover(function() {
                chart.tooltip.refresh(chart.series[(index + 1) % 2].data[0]);
            }, function() {
                chart.tooltip.hide();
            });
        });
    }

    function showPopSexGraph(dataVals) {
        if (!dataVals.length) return;
        var chart = new Highcharts.Chart({
            credits: {
                "enabled": false
            },
            chart: {
                renderTo: 'sexDiv',
                type: 'bar',
                spacing: [0, 5, 5, 5]
            },
            colors: ["#AE91CF", "#B4CF91"],
            title: {
                margin: 0,
                text: 'Population by sex',
                style: ts
            },
            xAxis: {
                minPadding: 0,
                maxPadding: 0,
                lineWidth: 0,
                title: '',
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                labels: {
                    "enabled": false
                },
                tickLength: 0
            },
            yAxis: {
                min: 0,
                max: dataVals[0].data[0] + dataVals[1].data[0],
                title: '',
                minPadding: 0,
                maxPadding: 0,
                lineWidth: 0,
                gridLineWidth: 0,
                labels: {
                    "enabled": false
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    bar: {
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    },
                    events: {
                        legendItemClick: function() {
                            return false;
                        }
                    }
                }
            },
            legend: {
                enabled: true,
                margin: 5,
                reversed: true,
                itemStyle: ls
            },
            tooltip: {
                followPointer: false,
                formatter: function() {
                    return '<b>' + this.series.options.population + " (" + Math.round(this.point.y * 10) / 10 + '%)</b><br/> ' + this.series.name + ' population';
                },
                style: {
                    color: '#333333',
                    fontSize: '9px',
                    padding: '2px'
                },
                hideDelay: 100,
                positioner: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            series: dataVals
        });
        $('#sexDiv .highcharts-legend text').each(function(index, element) {
            $(element).hover(function() {
                chart.tooltip.refresh(chart.series[(index + 1) % 2].data[0]);
            }, function() {
                chart.tooltip.hide();
            });
        });
    }

    function showRacesGraph(dataVals) {
        if (!dataVals.length) return;
        var chart = new Highcharts.Chart({
            credits: {
                "enabled": false
            },
            colors: ["#BEA7D9", "#C3D9A7", "#FFFA94", "#F7B0B0", "#8F8FF1", "#FFD6AD", "#ADD6FF", "#CBFF7E", "#FFC774", "#DDD8B9", "#EB8686", "#D6AD33"],
            chart: {
                renderTo: 'racePop',
                defaultSeriesType: 'pie',
                spacing: [0, 0, 5, 0]
            },
            title: {
                margin: 0,
                text: 'Population by race',
                style: ts
            },
            legend: {
                itemStyle: ls
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.point.population + " (" + Math.round(this.point.percentage * 10) / 10 + '%)</b><br/> of population is ' + this.point.name;
                },
                style: {
                    color: '#333333',
                    fontSize: '10px',
                    padding: '4px'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                slicedOffset: 5,
                data: dataVals
            }]
        });
        $('#racePop .highcharts-legend text').each(function(index, element) {
            $(element).hover(function() {
                chart.tooltip.refresh(chart.series[0].data[index]);
            }, function() {
                chart.tooltip.hide();
            });
        });
    }
    showHouseDivGraph(window.gDataH);
    showRacesGraph(window.gDataR);
    showPopSexGraph(window.gDataS)
}

function tabUnpack(tab) {
    return tab.replace(/\^7/g, "#######").replace(/\^6/g, "######").replace(/\^5/g, "#####").replace(/\^4/g, "####").replace(/\^3/g, "###").replace(/@/g, "##");
}

function SetPopupContent(poly, content) {
    window.popupPoly = poly;
    window.lastPopupFIPS = poly._FIPS
    var osmMAP = gmL_MapsDict[mapBOX];
    osmMAP._popupSkipClose = false;
    if (typeof poly._popupData != 'undefined') {
        poly._popupData = content;
        document.getElementById('polyPopupContent').innerHTML = content;
    } else if (typeof poly._popup != 'undefined')
        poly._popup.setContent(content);
    else if (typeof poly._popupContent != 'undefined') {
        poly._popupContentRead = content;
        for (var l in poly._layers)
            poly._layers[l]._popup.setContent(content);
    }
}

function getExtraLinks(LINKS) {
    var sel = document.getElementById("sel" + mapBOX),
        so = sel.options[sel.selectedIndex],
        aSerie = so.value,
        aSrSTR = so.innerHTML;
    aSerie = (aSerie.length < 4) ? MAIN_PROJ : aSerie.replace(/\d+/, "");
    if (aSerie == 'blocks' || aSerie == 'city' || aSerie == 'sql') return LINKS;
    var pfix = "";
    if (aSerie == "income")
        pfix = "http://www.city-data.com/income/income-";
    else if (aSerie == "races")
        pfix = "http://www.city-data.com/races/races-";
    else if (aSerie == "poverty")
        pfix = "http://www.city-data.com/poverty/poverty-";
    else if (aSerie == "work")
        pfix = "http://www.city-data.com/work/work-";
    else if (aSerie == "housing")
        pfix = "http://www.city-data.com/housing/houses-";
    else if (aSerie == "new") {
        if (aSrSTR.indexOf("Common Industries") != -1 || aSrSTR.indexOf("Common Occupations") != -1) {
            aSerie = "work";
            pfix = "http://www.city-data.com/work/work-";
        } else return LINKS;
    }
    var ltab = LINKS.split("<br/>");
    LINKS = "";
    for (var l = 0; l < ltab.length; l++) {
        var line = ltab[l];
        if (line.indexOf("/city/") != -1 && line.indexOf("/forum/") == -1) {
            var ctab = line.split(">, <");
            for (var c = 0; c < ctab.length; c++) {
                if (ctab.length > 1 && c != ctab.length - 1)
                    ctab[c] = ctab[c] + ">";
                var city = ctab[c].substr(ctab[c].indexOf("'") + 1).replace("http://www.city-data.com/city/", "");
                city = city.substr(0, city.indexOf("'"));
                line = line.replace(ctab[c], ctab[c] + " <a href='" + pfix + city + "' target='_self'>(" + aSerie + ")</a>");
            }
        }
        LINKS += line + "<br/>";
    }
    return LINKS;
}

function HandlePopup(rsp) {
    var data = rsp.responseText.split("\n");
    var fips = data[0].trim("\r\n");
    var p = fips2poly[cBoxType + fips];
    var polys = gmL_MapsPropsDict[mapBOX]['featureGroup' + cBoxType].getLayers();
    polys[p]._META = data[1];
    polys[p]._NAME = "";
    EventLogGA("PopupOpen", fips);
    var popCont = GetPopupContent(polys[p]);
    var lTxt = popCont.match(POP_LOAD_MSG);
    if (lTxt) {
        var sSerie = document.getElementById("sel" + mapBOX);
        var race = parseInt(sSerie.options[sSerie.selectedIndex].className.substr(1));
        var pop = data[1].trim("\r\n").split("|");
        var dd = parseMetaData(pop[0], pop[1], pop[2], pop[3].replace(/,/g, "|"), race);
        polys[p]._cLINKS = data[5] + data[6];
        polys[p]._rLINKS = data[4] + data[3];
        if (data[2].trim(" \t\r\n") != "") {
            polys[p]._NAME = data[2];
            dd = data[2] + dd + "<hr/>" + polys[p]._rLINKS;
        } else {
            polys[p]._NAME = "";
            dd = getExtraLinks(polys[p]._cLINKS) + dd + "<hr/>" + polys[p]._rLINKS;
        }
        SetPopupContent(polys[p], popCont.replace(POP_LOAD_MSG, dd));
        SetPopupGraphs();
        onMapStateChange({
            'type': 'POLY_CLICK'
        });
    }
}

function LoadHighCharstLibIfNeeded(callback) {
    var myNav = navigator.userAgent.toLowerCase();
    var ieVer = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : 10;
    if (typeof Highcharts != 'undefined' || (ieVer <= 8) || window.mobileVersion) return callback();
    jQl.loadjQ('http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js', function() {
        jQuery.getScript("http://code.highcharts.com/highcharts.js", function(data, textStatus, jqxhr) {
            callback();
        });
    });
}

function handleGroupPolyClick(ctx) {
    var osmMAP = gmL_MapsDict[mapBOX];
    if (ctx.layer._boxTYPE != cBoxType) return;
    if (typeof ctx.layer._popup == 'undefined' && typeof ctx.layer._popupContent == 'undefined' && typeof ctx.layer._popupData == 'undefined') return;
    SelectPoly(ctx.layer, 0);
    var popCont = GetPopupContent(ctx.layer);
    var p = fips2poly[cBoxType + ctx.layer._FIPS];
    if (popCont == "")
        popCont = getMetaData(ctx.layer._FIPS, cBoxType, aSerie, p);
    var pv = serieCache[cBoxType + cSerie];
    var val = pv.pv[p];
    if (pv.pv[p] == "" || pv.pv[p] == naFLAG) val = "No data";
    else val = cVal(val, "", "", aSerie);
    var prvDesc = popCont.match(/<span>[^<].* : .*<.span>/)[0];
    var newDesc = "<span>" + aSerie + " : " + val + "</span>";
    if (prvDesc != newDesc) {
        if (aSerie.indexOf(' diversity') != -1) newDesc += divNote;
        popCont = popCont.replace(divNote, '').replace(prvDesc, newDesc);
    }
    var lTxt = popCont.match(/<!--LOADING-->/);
    if (lTxt) {
        SetPopupContent(ctx.layer, popCont.replace("<!--LOADING-->", POP_LOAD_MSG));
        return LoadHighCharstLibIfNeeded(function() {
            ajaxRequest("POPUP", 'js/getBoxes.php?popup=' + ctx.layer._FIPS);
        });
    }
    if (typeof ctx.layer._META != 'undefined') {
        var pTxt = popCont.match(/<hr\/>.*<hr\/>/);
        if (pTxt) {
            var sSerie = document.getElementById("sel" + mapBOX);
            var race = parseInt(sSerie.options[sSerie.selectedIndex].className.substr(1));
            var pop = ctx.layer._META.trim("\r\n").split("|");
            var lnk = (popCont.indexOf(ctx.layer._rLINKS) == -1) ? "<hr/>" + ctx.layer._rLINKS : "";
            var nam = (ctx.layer._NAME != "") ? ctx.layer._NAME : getExtraLinks(ctx.layer._cLINKS);
            var dd = parseMetaData(pop[0], pop[1], pop[2], pop[3].replace(/,/g, "|"), race);
            var nContent = popCont.replace(pTxt, "<hr/>" + nam + dd + lnk + "<hr/>");
            SetPopupContent(ctx.layer, nContent);
            SetPopupGraphs();
        }
    }
}

function handleGroupPolyOver(ctx) {
    if (gDist === null || !gDist.osmMAP.interactionMode || ctx.layer._boxTYPE != cBoxType) return;
    var poly = ctx.layer;
    if (gDist === null || typeof poly._FIPS == 'undefined') return;
    var idx = fips2poly[cBoxType + poly._FIPS];
    markPoly(idx);
    drawDistCircle(gDist, serieCache[cBoxType + cSerie].pv[idx]);
}

function handleGroupPolyOut(ctx) {
    if (gDist === null || gDist.selCircle === null || ctx.layer._boxTYPE != cBoxType) return;
    if (distViewVAL === null)
        SetStyleValue(gDist.selCircle.style, 'visibility', 'hidden');
    else
        drawDistCircle(gDist, distViewVAL);
    markPoly(null);
}

function reorderRaces(TAB) {
    TAB = TAB.split("#");
    var nTAB = [];
    nTAB.push(TAB[0]);
    nTAB.push(TAB[1]);
    nTAB.push(TAB[2]);
    nTAB.push(TAB[4]);
    nTAB.push(TAB[0]);
    nTAB.push(TAB[3]);
    nTAB.push(TAB[6]);
    nTAB.push(TAB[7]);
    return nTAB.join("#");
}

function parseMetaData(pTAB, hTAB, fTAB, mTAB, race) {
    var dd = "";
    var sR = raceTab[race];
    var prTAB = pTAB.split("#");
    var pop = parseInt(prTAB[race]);
    var hs = parseInt(hTAB.split("#")[race]);
    var fam = parseInt(fTAB.split("#")[race]);
    var nfam = (hs && fam) ? cVal(hs - fam, "", "", "") : "No data";
    var famPRC = (hs && fam) ? " (" + cVal(Math.round(fam * 1000.0 / hs) / 10, "", "", "%") + ")" : "";
    var nfamPRC = (hs && fam) ? " (" + cVal(Math.round(1000.0 - (fam * 1000.0 / hs)) / 10, "", "", "%") + ")" : "";
    var iPop = pop;
    var iFam = fam;
    var iHs = hs;
    pop = (pop) ? cVal(pop, "", "", "") : "No data";
    hs = (hs) ? cVal(hs, "", "", "") : "No data";
    fam = (fam) ? cVal(fam, "", "", "") : "No data";
    dd += "Population" + sR.replace(" (Hispanic)", "") + ": " + pop + "<br/>";
    dd += "Households" + sR + ": " + hs + "<br/>";
    window.gDataH = [];
    if (typeof Highcharts != 'undefined') {
        if (parseInt(hs) && parseInt(fam)) {
            dd += '<div id="hsDiv"></div>';
            var fh = (Math.round(iFam * 1000.0 / iHs) / 10);
            var nh = (Math.round(1000.0 - (iFam * 1000.0 / iHs)) / 10);
            window.gDataH.push({
                name: 'Non-Family',
                data: [nh],
                households: nfam
            });
            window.gDataH.push({
                name: 'Family',
                data: [fh],
                households: fam
            });
        }
    } else {
        dd += "Family households" + sR + ": " + fam + famPRC + "<br/>";
        dd += "Non-Family households" + sR + ": " + nfam + nfamPRC + "<br/>";
    }
    dd += "<br/>";
    var popSum = 0;
    for (var r = 1; r < raceTab.length; r++) {
        pop = parseInt(prTAB[r]);
        if (!pop || raceTab[r] == " (Hispanic)*") continue;
        popSum += pop;
    }
    window.gDataR = [];
    if (typeof Highcharts != 'undefined') dd += '<div id="racePop"></div>';
    for (var r = 1; r < raceTab.length; r++) {
        pop = parseInt(prTAB[r]);
        if (!pop || raceTab[r] == " (Hispanic)*") continue;
        var popPRC = (popSum) ? " (" + cVal(Math.round(pop * 1000.0 / popSum) / 10, "", "", "%") + ")" : "";
        var raceStr = raceTab[r].substring(2, raceTab[r].length - 1);
        var dVal = parseFloat(popPRC.replace(/[()%]/g, ""));
        if (typeof Highcharts == 'undefined')
            dd += raceStr + " Population: " + cVal(pop, "", "", "") + popPRC + "<br/>";
        window.gDataR.push({
            name: raceStr,
            y: dVal,
            population: cVal(pop, "", "", "")
        });
    }
    if (mTAB.length) {
        var meta = mTAB.split("|");
        var mhi = (parseInt(meta[2])) ? cVal(parseFloat(meta[2]), "", "", "($)") : "No data";
        var mhv = (parseInt(meta[5])) ? cVal(parseFloat(meta[5]), "", "", "($)") : "No data";
        var mcr = (parseInt(meta[6])) ? cVal(parseFloat(meta[6]), "", "", "($)") : "No data";
        var ump = (parseInt(meta[3])) ? cVal(parseFloat(meta[3]), "", "", "(%)") : "No data";
        var rbp = (parseInt(meta[4])) ? cVal(parseFloat(meta[4]), "", "", "(%)") : "No data";
        var mra = (parseInt(meta[0])) ? cVal(parseFloat(meta[0]), "", "", "") : "No data";
        var pml = (parseInt(meta[1])) ? cVal(parseFloat(meta[1]), "", "", "(%)") : "No data";
        var pfl = (parseInt(meta[1])) ? cVal(100.0 - parseFloat(meta[1]), "", "", "(%)") : "No data";
        dd += "<br/>Median household income: " + mhi + "<br/>";
        dd += "Median house or condo value: " + mhv + "<br/>";
        dd += "Median contract rent: " + mcr + "<br/>";
        dd += "Unemployment: " + ump + "<br/>";
        dd += "Residents below the poverty level: " + rbp + "<br/>";
        dd += "Median resident age: " + mra + "<br/>";
        window.gDataS = [];
        if (typeof Highcharts != 'undefined' && parseInt(meta[1])) {
            dd += '<div id="sexDiv"></div>';
            var mR = parseFloat(meta[1]) / 100;
            var fR = 1 - mR;
            window.gDataS.push({
                name: 'Male',
                data: [mR * 100],
                population: cVal(mR * iPop, "", "", "")
            });
            window.gDataS.push({
                name: 'Female',
                data: [fR * 100],
                population: cVal(fR * iPop, "", "", "")
            });
        } else {
            dd += "Males: " + pml + "<br/>";
            dd += "Females: " + pfl + "<br/>";
        }
    }
    if (window.mobileVersion) {
        return "<div class='CM_popupContent'>" + dd + "</div>";
    }
    return "<div>" + dd + "</div>";
}

function getMetaData(FIPS, boxType, serie, IDX) {
    var e = '',
        dd = '';
    var l = DL_OSM[boxType].toString();
    l = l.substring(0, l.length - 1);
    if (l == "countie") l = "county";
    var sel = document.getElementById("sel" + mapBOX);
    var ajaxSerie = sel.options[sel.selectedIndex].value;
    var val = serieCache[boxType + ajaxSerie].pv[IDX];
    if (val == "" || val == naFLAG) val = "No data";
    else val = cVal(val, "", "", serie);
    dd += "<!--MAIN_LINK-->";
    dd += "<span>" + serie + " : " + val + "</span>";
    if (serie.indexOf(' diversity') != -1)
        dd += divNote;
    dd += "<hr/><!--LOADING-->";
    if (e != "") dd += "<hr/>";
    l = l.substring(0, 1).toUpperCase() + l.substring(1);
    if (DEBUG !== null && typeof DEBUG != 'function')
        return "<b>" + l + "[" + IDX + "]:</b> " + FIPS + "<br/>" + dd + e;
    return dd + e;
}

function popupScroll(p) {
    var s = (typeof p.currentTarget != 'undefined') ? p.currentTarget : p.srcElement;
    while (s.className != 'leaflet-popup-content') s = s.parentNode;
    var D = p.deltaY * -30 || p.wheelDeltaY / 4 || (p.wheelDeltaY === undefined && p.wheelDelta / 4) || p.detail * -10 || 0;
    if (D == 0) return;
    var UP = (s.scrollTop > 0);
    var DN = (s.scrollTop < s.scrollHeight - s.clientHeight);
    var DIR = (D < 0) ? 'D' : 'U';
    if ((DIR == 'D' && !DN) || (DIR == 'U' && !UP)) {
        p.returnValue = false;
        if (p.preventDefault) p.preventDefault();
        return;
    }
    if (isIE) {
        if (DIR == 'D' && s.scrollTop - D > s.scrollHeight - s.clientHeight) {
            s.scrollTop = s.scrollHeight - s.clientHeight;
            p.returnValue = false;
            if (p.preventDefault) p.preventDefault();
            return
        }
        if (DIR == 'U' && s.scrollTop + D < 0) {
            s.scrollTop = 0;
            p.returnValue = false;
            if (p.preventDefault) p.preventDefault();
            return
        }
    }
}

function onPopupOpen(pop) {
    var p = pop.popup._contentNode,
        s = pop.popup._source;
    if (typeof s._parentLayer != 'undefined') s = s._parentLayer;
    if (typeof s._FIPS == 'undefined') return;
    L.DomEvent.on(p, 'mousewheel', popupScroll).on(p, 'MozMousePixelScroll', popupScroll);
    IS_POPUP_OPEN = 1;
    window.lastPopupFIPS = s._FIPS;
    handleGroupPolyClick({
        'layer': s
    });
}

function onPopupClose(pop) {
    if (!IS_POPUP_OPEN) return;
    var p = pop.popup._contentNode;
    L.DomEvent.off(p, 'mousewheel', popupScroll).off(p, 'MozMousePixelScroll', popupScroll);
    IS_POPUP_OPEN = 0;
    onMapStateChange({
        'type': 'POPUP_CLOSED'
    });
    window.popupPoly = null;
}
var currentState = null;
var filterSug = null;
var boxSearchCurrID = 0;
var boxSearchInProgress = 0;
var searchMAP = [];
var stateBoundaries = [];
var sbMAP = [];

function initStateBoundaties() {
    var sb = [];
    sb.push('01|30.22|-88.47|35.01|-84.89|AL');
    sb.push('02|51.22|-179.15|71.35|179.78|AK');
    sb.push('04|31.33|-114.81|37.00|-109.05|AZ');
    sb.push('05|33.00|-94.62|36.50|-89.64|AR');
    sb.push('06|32.53|-124.41|42.01|-114.13|CA');
    sb.push('08|36.99|-109.06|41.00|-102.04|CO');
    sb.push('09|40.99|-73.73|42.05|-71.79|CT');
    sb.push('10|38.45|-75.79|39.84|-75.05|DE');
    sb.push('11|38.79|-77.12|39.00|-76.91|DC');
    sb.push('12|24.54|-87.63|31.00|-80.03|FL');
    sb.push('13|30.36|-85.61|35.00|-80.84|GA');
    sb.push('15|18.65|-161.27|23.02|-154.48|HI');
    sb.push('16|41.99|-117.24|49.00|-111.04|ID');
    sb.push('17|36.97|-91.51|42.51|-87.50|IL');
    sb.push('18|37.77|-88.06|41.76|-84.78|IN');
    sb.push('19|40.38|-96.64|43.50|-90.14|IA');
    sb.push('20|36.99|-102.05|40.00|-94.59|KS');
    sb.push('21|36.50|-89.57|39.15|-81.96|KY');
    sb.push('22|28.93|-94.04|33.02|-88.82|LA');
    sb.push('23|43.06|-71.08|47.46|-66.95|ME');
    sb.push('24|37.91|-79.49|39.72|-75.05|MD');
    sb.push('25|41.24|-73.51|42.89|-69.93|MA');
    sb.push('26|41.70|-90.42|47.48|-82.41|MI');
    sb.push('27|43.50|-97.24|49.38|-89.49|MN');
    sb.push('28|30.17|-91.66|35.00|-88.10|MS');
    sb.push('29|36.00|-95.77|40.61|-89.10|MO');
    sb.push('30|44.36|-116.05|49.00|-104.04|MT');
    sb.push('31|40.00|-104.05|43.00|-95.31|NE');
    sb.push('32|35.00|-120.01|42.00|-114.04|NV');
    sb.push('33|42.70|-72.56|45.31|-70.70|NH');
    sb.push('34|38.93|-75.56|41.36|-73.89|NJ');
    sb.push('35|31.33|-109.05|37.00|-103.00|NM');
    sb.push('36|40.50|-79.76|45.02|-71.86|NY');
    sb.push('37|33.84|-84.32|36.59|-75.46|NC');
    sb.push('38|45.94|-104.05|49.00|-96.55|ND');
    sb.push('39|38.40|-84.82|41.98|-80.52|OH');
    sb.push('40|33.62|-103.00|37.00|-94.43|OK');
    sb.push('41|41.99|-124.55|46.27|-116.46|OR');
    sb.push('42|39.72|-80.52|42.27|-74.69|PA');
    sb.push('44|41.15|-71.86|42.02|-71.12|RI');
    sb.push('45|32.03|-83.35|35.22|-78.54|SC');
    sb.push('46|42.48|-104.06|45.95|-96.44|SD');
    sb.push('47|34.98|-90.31|36.68|-81.65|TN');
    sb.push('48|25.84|-106.65|36.50|-93.52|TX');
    sb.push('49|37.00|-114.05|42.00|-109.04|UT');
    sb.push('50|42.73|-73.44|45.02|-71.46|VT');
    sb.push('51|36.54|-83.68|39.47|-75.24|VA');
    sb.push('53|45.54|-124.73|49.00|-116.92|WA');
    sb.push('54|37.20|-82.64|40.64|-77.72|WV');
    sb.push('55|42.49|-92.89|46.96|-86.97|WI');
    sb.push('56|40.99|-111.06|45.01|-104.05|WY');
    for (var s = 0; s < sb.length; s++) {
        var si = sb[s].split("|");
        sbMAP[si[0]] = stateBoundaries.length;
        stateBoundaries.push({
            "stateCode": si[0],
            "stateAbbv": si[5],
            "bounds": new L.LatLngBounds([new L.LatLng(si[1], si[2]), new L.LatLng(si[3], si[4])]),
            "countiesLoaded": 0
        });
    }
}

function getCurrentState() {
    var osmMAP = gmL_MapsDict[mapBOX];
    var bnds = osmMAP.getBounds();
    var sToLoad = [];
    for (var s = 0; s < stateBoundaries.length; s++) {
        if (bnds.contains(stateBoundaries[s].bounds) || bnds.intersects(stateBoundaries[s].bounds)) {
            sToLoad.push(stateBoundaries[s].stateAbbv);
        }
    }
    DebugMSG("CURRENT STATE(S): " + sToLoad.toString() + "<br/>");
    return sToLoad;
}

function getStateByAbbv(abbv) {
    for (var s = 0; s < stateBoundaries.length; s++)
        if (stateBoundaries[s].stateAbbv == abbv)
            return stateBoundaries[s];
    return null;
}

function clear_boxsearch(c, deftext, blur) {
    if (c) {
        if (c.value == deftext && !blur) c.value = '';
        if (c.value == '' && blur) c.value = deftext;
        SetStyleValue(c.style, 'color', (c.value == deftext) ? 'gray' : 'black');
    }
}

function findPlace() {
    var osmMAP = gmL_MapsDict[mapBOX];
    if (!osmMAP.interactionMode) return;
    if (boxSearchInProgress) {
        boxSearchInProgress++;
        return;
    }
    var sgs = document.getElementById("autocomplete");
    if (sgs.style.display == "") SetStyleValue(sgs.style, 'display', 'none');
    if (sgs.style.display != "none") {
        var sug = document.getElementById("idx" + boxSearchCurrID.toString());
        if (sug !== null) {
            sug.click();
            return;
        }
    }
    var sch = document.getElementById('sbox').value;
    if (sch.length < 2) {
        return;
    }
    var sCheck = sch;
    while (sCheck.length >= 2) {
        if (typeof searchMAP[sCheck] != 'undefined') {
            HandleSearch(searchMAP[sCheck], sch);
            return;
        }
        sCheck = sCheck.substr(0, sCheck.length - 1);
    }
    boxSearchInProgress = 1;
    return ajaxRequest("SEARCH", 'js/getBoxes.php?search=' + sch);
}

function isInCurrentStates(name) {
    for (var s = 0; s < currentState.length; s++) {
        var abbv = currentState[s].toLowerCase();
        if (name.indexOf(", " + abbv) != -1) return 1;
    }
    return 0;
}

function sortSuggestions(a, b) {
    var sMAP = [];
    sMAP["s "] = 3;
    sMAP["c "] = 2;
    sMAP["p "] = 1;
    sMAP["n "] = 1;
    sMAP["z "] = 0;
    var resA = a.split("=");
    var resB = b.split("=");
    var typeA = sMAP[resA[0].substr(0, 2)];
    var typeB = sMAP[resB[0].substr(0, 2)];
    var nameA = resA[0].substr(2).toLowerCase();
    var nameB = resB[0].substr(2).toLowerCase();
    var startA = (nameA.indexOf(filterSug) == 0 || (typeA == 3 && filterSug.length == 2 && nameA.indexOf(", " + filterSug) != -1)) ? 1 : 0;
    var startB = (nameB.indexOf(filterSug) == 0 || (typeB == 3 && filterSug.length == 2 && nameB.indexOf(", " + filterSug) != -1)) ? 1 : 0;
    if (startA != startB)
        return startB - startA;
    var cstateA = isInCurrentStates(nameA);
    var cstateB = isInCurrentStates(nameB);
    if (cstateA != cstateB)
        return cstateB - cstateA;
    if (typeA != typeB)
        return typeA - typeB;
    var popA = parseInt(resA[1]);
    var popB = parseInt(resB[1]);
    return popB - popA;
}

function ss(id) {
    var ac = document.getElementById("autocomplete").getElementsByTagName('div');
    var maxID = ac.length - 1;
    if (id > maxID) id = 0;
    else if (id < 0) id = maxID;
    var s = document.getElementById("idx" + id);
    s.className = "selected";
    us(boxSearchCurrID);
    boxSearchCurrID = id;
}

function us(id) {
    var s = document.getElementById("idx" + id);
    if (s) s.className = "";
}

function HandleSearch(req, sVal) {
    EventLogGA("SearchPlaceRequest", "");
    var value = "";
    var responseText = "";
    if (req.responseText.length) {
        responseText = req.responseText.split("\n");
        value = responseText[0];
        responseText.splice(0, 1);
        responseText = responseText.join("\n");
    }
    if (sVal !== null) value = sVal.trim();
    if (typeof searchMAP[value] == 'undefined')
        searchMAP[value] = req;
    if (sVal === null && value != document.getElementById('sbox').value) {
        value = document.getElementById('sbox').value.toLowerCase();
    }
    var pattern = value.replace("(", "\\(").replace(")", "\\)").replace("$", "\\$");
    var re = new RegExp(pattern, "gi");
    var sCnt = 0;
    var fSug = "";
    var sgs = "";
    var ac = document.getElementById('autocomplete');
    SetStyleValue(ac.style, 'display', "block");
    ac.innerHTML = "";
    if (typeof ac.selectedIndex != 'undefined')
        delete ac.selectedIndex;
    var lMAP = [];
    lMAP["s "] = " State,";
    lMAP["c "] = " County,";
    lMAP["n "] = " neighborhood,";
    lMAP["p "] = ",";
    lMAP["z "] = " Zip Code,";
    var res = null;
    var directMatch = 0;
    var sug = responseText.split("|\n");
    sug.pop();
    filterSug = value.toLowerCase();
    currentState = getCurrentState();
    sug.sort(sortSuggestions);
    for (var s = 0; s < sug.length; s++) {
        var resS = sug[s].split("=");
        if (resS.length != 3) continue;
        res = resS;
        res[2] = res[2].replace("\r", "").replace("\n", "");
        var l = res[0].substr(0, 2);
        if (sCnt >= 25) {
            if (l != "s ") continue;
            var sugTab = sgs.split("\n");
            sugTab.pop();
            sugTab.pop();
            sgs = sugTab.join("\n") + "\n";
            sCnt--;
        }
        res[0] = res[0].substr(2);
        var sRes = res[0];
        if (l == "c " || l == "n ") sRes = res[0].replace(",", lMAP[l]);
        var m = sRes.match(re);
        if (m == null) continue;
        var hRes = res[0].replace(",", lMAP[l]);
        m = hRes.match(re);
        for (var mi = 0; mi < m.length; m++) hRes = hRes.replace(m[mi], "<b>" + m[mi] + "</b>");
        if (parseInt(res[1])) hRes += " (pop. " + cVal(res[1], "", "", "") + ")";
        var cSel = (!sCnt) ? "class='selected' " : "";
        sgs += "<div id='idx" + sCnt.toString() + "' " + cSel + "onmouseover='ss(" + sCnt.toString() + ");' onmouseout='us(" + sCnt.toString() + ");' onclick='selectSuggestion(\"" + res[2] + "\");'>" + hRes + "</div>\n";
        if (pattern.toLowerCase() == res[0].toLowerCase() || boxSearchInProgress > 1) {
            directMatch = 1;
            break;
        }
        sCnt++;
    }
    if (!sCnt && !directMatch) sgs = "No suggestions meet your criteria</b>";
    sgs += "<a style='position:absolute;bottom:0px;right:10px;' href='javascript:hideSuggestions();'>[CLOSE]</a>";
    ac.innerHTML = sgs;
    if (directMatch) {
        var sug = document.getElementById("idx" + sCnt.toString());
        if (sug !== null) sug.click();
    }
    boxSearchCurrID = 0;
    boxSearchInProgress = 0;
}

function hideSuggestions() {
    SetStyleValue(document.getElementById("autocomplete").style, 'display', "none");
}

function selectSuggestion(coords) {
    document.getElementById('autocomplete').innerHTML = "";
    SetStyleValue(document.getElementById('autocomplete').style, 'display', "none");
    var osmMAP = gmL_MapsDict[mapBOX];
    osmMAP.closePopup();
    var cPoly = mL_decodeLatLonString([coords]);
    if (cityPoly !== null) cityPoly.clearLayers();
    cityPoly = mL_addRawPoly(mapBOX, false, cPoly, "'" + plaColor + "', 4, 1,'#000000',0", [], [], 'city', 0);
    CACHE_IT = 1;
    SEARCH_REQ = reqID;
    osmMAP.fitBounds(cityPoly.getBounds());
    EventLogGA("SearchPlaceSelect", "");
    onMapStateChange({
        'type': 'SEARCH'
    });
}

function getCharCodeFromKeyEvent(event) {
    if (event === null) return 0;
    var charCode = ((typeof event.which != 'undefined') && event.which) ? event.which : event.keyCode;
    return charCode;
}

function sKD(value, event) {
    if (!isIE) return;
    var charCode = getCharCodeFromKeyEvent(event);
    if (charCode != 13) return;
    sKU(value, event);
}

function sKU(value, event) {
    var sgs = document.getElementById("autocomplete");
    if (sgs.style.display == "") SetStyleValue(sgs.style, 'display', 'none');
    var charCode = getCharCodeFromKeyEvent(event);
    if (charCode == 27) {
        if (sgs.style.display != "none") hideSuggestions();
        return;
    }
    if (charCode == 37) {
        return;
    }
    if (charCode == 38) {
        ss(boxSearchCurrID - 1);
        return;
    }
    if (charCode == 39) {
        return;
    }
    if (charCode == 40) {
        if (sgs.style.display != "none") {
            ss(boxSearchCurrID + 1);
            return;
        } else charCode == 13;
    }
    if (charCode == 16) {
        return;
    }
    if (charCode == 17) {
        return;
    }
    if (charCode == 13) {
        if (boxSearchInProgress) {
            boxSearchInProgress++;
            return;
        }
        if (sgs.style.display != "none") {
            var sug = document.getElementById("idx" + boxSearchCurrID.toString());
            if (sug !== null) {
                sug.click();
                return;
            }
        }
    }
    if (boxSearchInProgress) {
        return;
    }
    var sbx = document.getElementById("sbox");
    if (sbx.value.length < 2) {
        sgs.innerHTML = "";
        SetStyleValue(sgs.style, 'display', "none");
        return;
    }
    SetStyleValue(sgs.style, 'display', "block");
    var sCheck = sbx.value.trim();
    while (sCheck.length >= 3) {
        if (typeof searchMAP[sCheck] != 'undefined') {
            HandleSearch(searchMAP[sCheck], sbx.value);
            return;
        }
        sCheck = sCheck.substr(0, sCheck.length - 1);
    }
    sgs.innerHTML = "Loading suggestions...";
    findPlace();
}
var schedInterval = null;
var schedQUEUE = [];
var schedCACHE = [];
var BG_SCHED = (1 && !window.mobileVersion);
MOVE = {
    NONE: {
        value: "NONE"
    },
    ZOOM_IN: {
        value: "ZOOM_IN"
    },
    ZOOM_OUT: {
        value: "ZOOM_OUT"
    },
    MOVE_LEFT: {
        value: "MOVE_LEFT"
    },
    MOVE_RIGHT: {
        value: "MOVE_RIGHT"
    },
    MOVE_TOP: {
        value: "MOVE_TOP"
    },
    MOVE_BOTTOM: {
        value: "MOVE_BOTTOM"
    }
};
var LAST_MOVE = MOVE.NONE;

function ClearSchedule() {
    if (schedInterval !== null)
        clearInterval(schedInterval);
    schedInterval = null;
    schedQUEUE = [];
}

function HandleSchedule() {
    if (!BG_SCHED || ieVer <= 8 || IS_POPUP_OPEN) return;
    if (reqID <= 1) return;
    var osmMAP = gmL_MapsDict[mapBOX];
    if (!schedQUEUE.length) {
        var bnds = osmMAP.getBounds();
        var nbnds = bnds.pad(1);
        var ne = bnds.getNorthEast();
        var sw = bnds.getSouthWest();
        var une = nbnds.getNorthEast();
        var usw = nbnds.getSouthWest();
        var TOP = new L.LatLngBounds(new L.LatLng(ne.lat, sw.lng), new L.LatLng(une.lat, une.lng));
        var BTM = new L.LatLngBounds(new L.LatLng(usw.lat, usw.lng), new L.LatLng(sw.lat, ne.lng));
        var LFT = new L.LatLngBounds(new L.LatLng(une.lat, usw.lng), new L.LatLng(sw.lat, sw.lng));
        var RGT = new L.LatLngBounds(new L.LatLng(ne.lat, ne.lng), new L.LatLng(usw.lat, une.lng));
        var CSH_IT = (LAST_AJAX_REQUEST.indexOf("&c=1") != -1);
        if (cBoxType != 'st' && cBoxType != 'b') {
            if (typeof schedCACHE[TOP.toBBoxString()] == 'undefined' && !IsViewportLoaded(TOP, cBoxType)) {
                var q = {
                    vw: TOP,
                    CSH: CSH_IT,
                    boxType: cBoxType,
                    url: 'js/getBoxes.php?BG=2&mv=T&vw=' + TOP.toBBoxString(),
                    code: "TOP"
                };
                if (schedQUEUE.length && LAST_MOVE == MOVE.MOVE_TOP)
                    schedQUEUE.unshift(q);
                else
                    schedQUEUE.push(q);
            }
            if (typeof schedCACHE[LFT.toBBoxString()] == 'undefined' && !IsViewportLoaded(LFT, cBoxType)) {
                var q = {
                    vw: LFT,
                    CSH: CSH_IT,
                    boxType: cBoxType,
                    url: 'js/getBoxes.php?BG=2&mv=L&vw=' + LFT.toBBoxString(),
                    code: "LFT"
                };
                if (schedQUEUE.length && LAST_MOVE == MOVE.MOVE_LEFT)
                    schedQUEUE.unshift(q);
                else
                    schedQUEUE.push(q);
            }
            if (typeof schedCACHE[RGT.toBBoxString()] == 'undefined' && !IsViewportLoaded(RGT, cBoxType)) {
                var q = {
                    vw: RGT,
                    CSH: CSH_IT,
                    boxType: cBoxType,
                    url: 'js/getBoxes.php?BG=2&mv=R&vw=' + RGT.toBBoxString(),
                    code: "RGT"
                };
                if (schedQUEUE.length && LAST_MOVE == MOVE.MOVE_RIGHT)
                    schedQUEUE.unshift(q);
                else
                    schedQUEUE.push(q);
            }
            if (typeof schedCACHE[BTM.toBBoxString()] == 'undefined' && !IsViewportLoaded(BTM, cBoxType)) {
                var q = {
                    vw: BTM,
                    CSH: CSH_IT,
                    boxType: cBoxType,
                    url: 'js/getBoxes.php?BG=2&mv=B&vw=' + BTM.toBBoxString(),
                    code: "BTM"
                };
                if (schedQUEUE.length && LAST_MOVE == MOVE.MOVE_BOTTOM)
                    schedQUEUE.unshift(q);
                else
                    schedQUEUE.push(q);
            }
        }
        if (cBoxType != 'st') {
            if (typeof schedCACHE[nbnds.toBBoxString()] == 'undefined') {
                var q = {
                    vw: nbnds,
                    CSH: CSH_IT,
                    boxType: cBoxType,
                    url: 'js/getBoxes.php?BG=1&mv=O&vw=' + nbnds.toBBoxString(),
                    code: "Z_OUT"
                };
                if (schedQUEUE.length && LAST_MOVE == MOVE.ZOOM_OUT)
                    schedQUEUE.unshift(q);
                else
                    schedQUEUE.push(q);
            }
        }
        var s = IsNextZlAvailable();
        if (s.avail && typeof schedCACHE[bnds.toBBoxString()] == 'undefined') {
            var q = {
                vw: bnds,
                CSH: CSH_IT,
                boxType: cBoxType,
                url: 'js/getBoxes.php?BG=2&mv=I&vw=' + bnds.toBBoxString(),
                code: "Z_IN"
            };
            if (schedQUEUE.length && LAST_MOVE == MOVE.ZOOM_IN)
                schedQUEUE.unshift(q);
            else
                schedQUEUE.push(q);
        }
        if (schedQUEUE.length) {
            DebugMSG("BG_UPDATE(): MAKE_SCHED - LAST_MOVE = " + LAST_MOVE.value + " QUEUE[" + schedQUEUE.length + "]<br/>");
            schedInterval = setTimeout("HandleSchedule();", 1000);
        }
        return;
    }
    if (!schedQUEUE.length) return;
    while (schedQUEUE.length) {
        var qEL = schedQUEUE.shift();
        schedCACHE[qEL.vw.toBBoxString()] = 1;
        vwSTATE = AddViewport(qEL.boxType, qEL.vw);
        if (vwSTATE.load === null) continue;
        CACHE_IT = qEL.CSH;
        ajaxRequest(qEL.boxType, qEL.url + '&svw=' + vwSTATE.skip);
        break;
    }
};
boxMAP_VERSION = '2014-02-17 14:00:00';
leaflet_DATE = '2014-02-13 16:05:28.';