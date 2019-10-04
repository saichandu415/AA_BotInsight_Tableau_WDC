(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {

        var cols = [{
            id: "machineName",
            alias: "unique ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "runStatus",
            alias: "Event Description",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "userId",
            alias: "User ID",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "dateLogged",
            alias: "Date Logged",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "variables",
            alias: "Variables",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "vProcess",
            alias: "Process",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "vSecond",
            alias: "Seconds",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "vTime",
            alias: "Time",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "operationAnalytics",
            alias: "CR operation Analytics",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        var postBody = {
            runDateStr: "2019-10-04",
            taskName:"AnalyticsTest"
        };

        var authenticateBody = {
            username: "biadmin",
            password: "12345678"
        };

        // Console.log doesn't work in Tableau
        // tableau.log("My console message goes here!");

        $.ajax({
            url: 'http://localhost:8889/localhost/v1/authentication',
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            dataType: 'json', 
            async: false,
            data: JSON.stringify(authenticateBody),
        }).done(function (authenticationData) {

            $.ajax({
                url: 'http://localhost:8889/localhost/v2/botinsight/data/api/gettasklogdata',
                headers: {
                    'X-AUTHORIZATION': authenticationData.token,
                    'Access-Control-Allow-Origin': 'http://localhost:8888'
                },
                method: 'POST',
                dataType: 'json',
                async: false,
                data: JSON.stringify(postBody),
            }).done(function (data) {
                var feat = data.list,
                    tableData = [];

                  var tempList =  _.sortBy(feat,['dateLogged']);

                  var sortedList = tempList.reverse();
                  
                  var varData = {
                      vProcess : "NO_PROCESS_LOGGED",
                      vSecond : "NO_LOG_DATA",
                      vTime : "NO_TIME_DATA"
                  }

                //   for (var i = 0, len = feat.length; i < len; i++) {
                    
                //   }
                  

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    if(feat[i].variables != ""){
                        var tempVal = JSON.parse(feat[i].variables);
                        console.log(tempVal);
                        varData = tempVal;
                      }

                    tableData.push({
                        "machineName": feat[i].machineName,
                        "runStatus": feat[i].runStatus,
                        "userId": feat[i].userId,
                        "dateLogged": feat[i].dateLogged,
                        "variables": feat[i].variables,
                        "vProcess": varData.vProcess,
                        "vSecond": varData.vSecond,
                        "vTime": varData.vTime,
                        "objectName": feat[i].objectName,
                        "detail": feat[i].detail,
                        "createdOn": feat[i].createdOn,
                        "requestId": feat[i].requestId,
                        "createdBy": feat[i].createdBy,
                    });
                }

                table.appendRows(tableData);
                doneCallback();

            }).fail(function (msg) {
                tableau.log(msg);
            });

        });



    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "AA Control Room Analytics"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();