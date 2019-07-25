(function () {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function (schemaCallback) {

        var cols = [{
            id: "id",
            alias: "unique ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "eventDescription",
            alias: "Event Description",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "activityType",
            alias: "Activity Type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "environmentName",
            alias: "Environment Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "hostName",
            alias: "Host Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "userName",
            alias: "User Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "status",
            alias: "Status",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "source",
            alias: "Source",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "objectName",
            alias: "ObjectName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "detail",
            alias: "Detail",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "createdOn",
            alias: "Created On",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "requestId",
            alias: "Request Id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "createdBy",
            alias: "Created By",
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
            date: "2019-07-23"
        };

        var authenticateBody = {
            username: "username",
            password: "password"
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
                url: 'http://localhost:8889/localhost/v2/botinsight/data/api/getaudittraildata',
                headers: {
                    'X-Authorization': authenticationData.token,
                    'Access-Control-Allow-Origin': 'http://localhost:8888'
                },
                method: 'POST',
                dataType: 'json',
                async: false,
                data: JSON.stringify(postBody),
            }).done(function (data) {
                var feat = data.list,
                    tableData = [];

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "id": feat[i].id,
                        "eventDescription": feat[i].eventDescription,
                        "activityType": feat[i].activityType,
                        "environmentName": feat[i].environmentName,
                        "hostName": feat[i].hostName,
                        "userName": feat[i].userName,
                        "status": feat[i].status,
                        "source": feat[i].source,
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
