/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8202127659574469, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-69"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-36"], "isController": false}, {"data": [0.5, 500, 1500, "/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-269"], "isController": false}, {"data": [0.95, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-34"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-66"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-39"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/TelemetryManager.svc/ProcessEventData-75"], "isController": false}, {"data": [0.65, 500, 1500, "/51c430bd-76e4-4a20-b049-b56e1012c74f/login-12"], "isController": false}, {"data": [0.65, 500, 1500, "/-268-0"], "isController": false}, {"data": [0.95, 500, 1500, "/-268-1"], "isController": false}, {"data": [0.45, 500, 1500, "/-17"], "isController": false}, {"data": [0.65, 500, 1500, "/-268-2"], "isController": false}, {"data": [0.5, 500, 1500, "/-18"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/TelemetryManager.svc/ProcessEventData-58"], "isController": false}, {"data": [0.5, 500, 1500, "/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-269-1"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/TelemetryManager.svc/ProcessEventData-79"], "isController": false}, {"data": [1.0, 500, 1500, "/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-269-0"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/TelemetryManager.svc/ProcessEventData-77"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-72"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-71"], "isController": false}, {"data": [0.75, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-42"], "isController": false}, {"data": [0.55, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-76"], "isController": false}, {"data": [0.7, 500, 1500, "/kmsi-15"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-74"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-57"], "isController": false}, {"data": [0.5, 500, 1500, "/-17-0"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-78"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-55"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-49"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-59"], "isController": false}, {"data": [0.4, 500, 1500, "/common/GetCredentialType?mkt=en-US-283"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/TelemetryManager.svc/ProcessEventData-62"], "isController": false}, {"data": [0.95, 500, 1500, "/-17-1"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/TelemetryManager.svc/ProcessEventData-45"], "isController": false}, {"data": [0.4, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?-24"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-61"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-60"], "isController": false}, {"data": [0.825, 500, 1500, "/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-7"], "isController": false}, {"data": [0.5, 500, 1500, "https://login.live.com/Me.htm?v=3"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-53"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-65"], "isController": false}, {"data": [0.45, 500, 1500, "/-268"], "isController": false}, {"data": [0.55, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-54"], "isController": false}, {"data": [0.35, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-51"], "isController": false}, {"data": [1.0, 500, 1500, "/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-63"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 470, 0, 0.0, 458.8617021276596, 0, 2955, 197.0, 1171.1000000000004, 1417.1, 2124.150000000003, 10.773392013936643, 97.83134448207491, 0.06513998246458534], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-69", 10, 0, 0.0, 165.60000000000002, 150, 195, 161.5, 193.6, 195.0, 195.0, 0.4201504138481576, 0.38601319272299484, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-36", 10, 0, 0.0, 159.80000000000004, 152, 171, 161.5, 170.3, 171.0, 171.0, 0.39410420115078426, 0.40411075313312844, 0.0], "isController": false}, {"data": ["/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-269", 10, 0, 0.0, 941.0, 727, 1280, 850.0, 1273.5, 1280.0, 1280.0, 0.375206363499925, 7.8252511537595675, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-34", 10, 0, 0.0, 280.6, 206, 620, 234.0, 590.8000000000002, 620.0, 620.0, 0.3924030764401193, 2.707772830501491, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-66", 10, 0, 0.0, 204.4, 171, 272, 195.5, 270.6, 272.0, 272.0, 0.4200621692010418, 2.463681031042594, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-39", 10, 0, 0.0, 157.1, 147, 199, 150.5, 196.5, 199.0, 199.0, 0.3943217665615142, 0.32073300719637227, 0.0], "isController": false}, {"data": ["/Services/TelemetryManager.svc/ProcessEventData-75", 10, 0, 0.0, 142.6, 138, 146, 142.5, 145.9, 146.0, 146.0, 0.4221903233977877, 0.1884189236257705, 0.0], "isController": false}, {"data": ["/51c430bd-76e4-4a20-b049-b56e1012c74f/login-12", 10, 0, 0.0, 611.4, 424, 1190, 584.5, 1140.0000000000002, 1190.0, 1190.0, 0.38153376573826786, 5.318558338897367, 0.0], "isController": false}, {"data": ["/-268-0", 10, 0, 0.0, 444.1, 137, 756, 529.0, 737.7, 756.0, 756.0, 0.3631741420010895, 0.8482102324314509, 0.0], "isController": false}, {"data": ["/-268-1", 10, 0, 0.0, 259.6, 166, 639, 232.0, 598.7000000000002, 639.0, 639.0, 0.37023324694557574, 0.8496563772676786, 0.0], "isController": false}, {"data": ["/-17", 10, 0, 0.0, 1364.8, 1065, 1645, 1417.0, 1626.6000000000001, 1645.0, 1645.0, 0.37030179596371043, 16.269375752175524, 0.0], "isController": false}, {"data": ["/-268-2", 10, 0, 0.0, 696.9000000000001, 460, 1144, 586.0, 1138.4, 1144.0, 1144.0, 0.3717195747528065, 6.9329330765370605, 0.0], "isController": false}, {"data": ["/-18", 10, 0, 0.0, 975.7, 433, 2007, 834.0, 1953.8000000000002, 2007.0, 2007.0, 0.3733572281959379, 14.715160520273297, 0.0], "isController": false}, {"data": ["/Services/TelemetryManager.svc/ProcessEventData-58", 10, 0, 0.0, 142.0, 134, 159, 140.5, 157.9, 159.0, 159.0, 0.42009746261132586, 0.187361827318938, 0.0], "isController": false}, {"data": ["/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-269-1", 10, 0, 0.0, 727.5, 503, 1116, 617.0, 1108.9, 1116.0, 1116.0, 0.3775294472968892, 7.037163644858049, 0.0], "isController": false}, {"data": ["/Services/TelemetryManager.svc/ProcessEventData-79", 10, 0, 0.0, 150.0, 137, 206, 145.0, 200.50000000000003, 206.0, 206.0, 0.4724781478856603, 0.2108618296716277, 0.0], "isController": false}, {"data": ["/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-269-0", 10, 0, 0.0, 213.0, 164, 252, 230.5, 250.10000000000002, 252.0, 252.0, 0.38402457757296465, 0.8509294594854071, 0.0], "isController": false}, {"data": ["/Services/TelemetryManager.svc/ProcessEventData-77", 10, 0, 0.0, 145.0, 139, 160, 142.5, 159.4, 160.0, 160.0, 0.47281323877068554, 0.21101137706855794, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-72", 10, 0, 0.0, 169.60000000000002, 152, 195, 167.0, 194.4, 195.0, 195.0, 0.42022103626507545, 0.6137935585367903, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-71", 10, 0, 0.0, 163.4, 154, 172, 162.5, 172.0, 172.0, 172.0, 0.42043304603741855, 0.5826528668278327, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-42", 10, 0, 0.0, 403.79999999999995, 159, 579, 495.0, 578.1, 579.0, 579.0, 0.3878975950349108, 0.593930311772692, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-76", 10, 0, 0.0, 1210.3000000000002, 400, 2955, 553.5, 2950.2, 2955.0, 2955.0, 0.41776329531687345, 0.36848028157246104, 0.0], "isController": false}, {"data": ["/kmsi-15", 10, 0, 0.0, 530.6, 438, 675, 521.0, 668.3000000000001, 675.0, 675.0, 0.38367096378146104, 2.0818645929251076, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-74", 10, 0, 0.0, 170.7, 154, 217, 163.5, 214.3, 217.0, 217.0, 0.4208577080089222, 0.5708293658726484, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-57", 10, 0, 0.0, 161.2, 151, 177, 160.0, 176.7, 177.0, 177.0, 0.4198329065032117, 0.43127171323313324, 0.0], "isController": false}, {"data": ["/-17-0", 10, 0, 0.0, 948.9999999999999, 694, 1207, 1003.5, 1196.8, 1207.0, 1207.0, 0.3743775972445809, 1.693034938789263, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-78", 10, 0, 0.0, 175.70000000000002, 151, 311, 160.5, 297.90000000000003, 311.0, 311.0, 0.4723665564478035, 0.43407903282947563, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-55", 10, 0, 0.0, 191.0, 178, 200, 193.0, 199.9, 200.0, 200.0, 0.41942790034393085, 2.7630632130274306, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-49", 10, 0, 0.0, 170.69999999999996, 163, 184, 169.5, 183.9, 184.0, 184.0, 0.39401103230890466, 0.7757092198581561, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-59", 10, 0, 0.0, 158.89999999999998, 144, 181, 156.0, 179.8, 181.0, 181.0, 0.41992105484168973, 0.3854744058117074, 0.0], "isController": false}, {"data": ["/common/GetCredentialType?mkt=en-US-283", 10, 0, 0.0, 1173.8000000000002, 731, 2220, 1002.0, 2186.6000000000004, 2220.0, 2220.0, 0.37947783849423194, 1.6324958731785064, 0.0], "isController": false}, {"data": ["/Services/TelemetryManager.svc/ProcessEventData-62", 10, 0, 0.0, 150.60000000000002, 131, 240, 143.0, 231.40000000000003, 240.0, 240.0, 0.4209462872537464, 0.18782261586546556, 0.0], "isController": false}, {"data": ["/-17-1", 10, 0, 0.0, 414.20000000000005, 293, 516, 428.0, 509.20000000000005, 516.0, 516.0, 0.38056094683563574, 14.999118466244244, 0.0], "isController": false}, {"data": ["Debug Sampler", 10, 0, 0.0, 3.1, 0, 8, 2.0, 7.9, 8.0, 8.0, 0.47544335092473733, 23.857134473208767, 0.0], "isController": false}, {"data": ["/Services/TelemetryManager.svc/ProcessEventData-45", 10, 0, 0.0, 144.2, 137, 154, 142.0, 153.7, 154.0, 154.0, 0.39444619753865573, 0.17607554384269486, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?-24", 10, 0, 0.0, 1335.1000000000001, 799, 1585, 1360.5, 1578.5, 1585.0, 1585.0, 0.3736362277686444, 9.317152062939023, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-61", 10, 0, 0.0, 164.4, 149, 208, 160.5, 203.9, 208.0, 208.0, 0.42053913116615504, 0.5473579629084486, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-60", 10, 0, 0.0, 173.6, 155, 254, 161.5, 247.3, 254.0, 254.0, 0.42018572208916344, 0.5478007216689778, 0.0], "isController": false}, {"data": ["/51c430bd-76e4-4a20-b049-b56e1012c74f/oauth2/authorize-7", 20, 0, 0.0, 532.85, 435, 1158, 470.0, 614.6, 1130.8999999999996, 1158.0, 0.7571455612341472, 13.356410006151808, 0.0], "isController": false}, {"data": ["https://login.live.com/Me.htm?v=3", 10, 0, 0.0, 745.0, 716, 780, 748.5, 777.4, 780.0, 780.0, 0.38321517532094274, 1.1563817302165167, 0.10890196876796322], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-53", 10, 0, 0.0, 171.79999999999998, 158, 196, 169.0, 195.1, 196.0, 196.0, 0.4083299305839118, 0.4693401643527971, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-65", 10, 0, 0.0, 174.2, 151, 250, 166.5, 244.60000000000002, 250.0, 250.0, 0.4205921938088829, 0.5474681007108008, 0.0], "isController": false}, {"data": ["/-268", 10, 0, 0.0, 1402.3999999999996, 979, 2489, 1310.5, 2386.4000000000005, 2489.0, 2489.0, 0.35331943610218, 8.225787129456242, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-54", 10, 0, 0.0, 742.8000000000002, 498, 1281, 634.0, 1272.5, 1281.0, 1281.0, 0.40089801154586274, 4.373116092547306, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=USRT&lng=en-us&-51", 10, 0, 0.0, 1298.5, 612, 2085, 1328.0, 2050.6000000000004, 2085.0, 2085.0, 0.3786157807057398, 7.804994237941088, 0.0], "isController": false}, {"data": ["/Services/ReliableCommunicationManager.svc/ProcessMessages?cmp=usrt&lng=en-us&-63", 10, 0, 0.0, 171.1, 162, 183, 169.5, 182.7, 183.0, 183.0, 0.42036235234772373, 0.5642871968136534, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 470, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
