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
            id: "userName",
            alias: "User Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "firstName",
            alias: "First Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lastName",
            alias: "Last Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "email",
            alias: "Email",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "clientType",
            alias: "Client Type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "hostName",
            alias: "Host Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "iPAddress",
            alias: "IP Address",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "applicationPath",
            alias: "Application Path",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "username1",
            alias: "User Name 1",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "fileName",
            alias: "File Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "fileType",
            alias: "File Type",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "startTime",
            alias: "Start Time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "endTime",
            alias: "End Time",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "status",
            alias: "Status",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "errorMessage",
            alias: "Error Message",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "totalLines",
            alias: "Total Lines",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "timeTaken",
            alias: "Time Taken",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "successIndicator",
            alias: "Success Indicator",
            dataType: tableau.dataTypeEnum.int
        }];
            
        var tableSchema = {
            id: "botrundata",
            alias: "CR BOT RUN DATA",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function (table, doneCallback) {
        var postBody = {
            dateStr: "2019-09-30"
        };

        var authenticateBody = {
            username: "apiuser",
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
                url: 'http://localhost:8889/localhost/v2/botinsight/data/api/getbotrundata',
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

                // Iterate over the JSON object
                for (var i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "id": feat[i].id,
                        "userName": feat[i].userName,
                        "firstName": feat[i].firstName,
                        "lastName": feat[i].lastName,
                        "email": feat[i].email,
                        "clientType": feat[i].clientType,
                        "hostName": feat[i].hostName,
                        "iPAddress": feat[i].iPAddress,
                        "applicationPath": feat[i].applicationPath,
                        "username1": feat[i].username1,
                        "fileName": feat[i].fileName,
                        "fileType": feat[i].fileType,
                        "startTime": feat[i].startTime,
                        "endTime": feat[i].endTime,
                        "status": feat[i].status,
                        "errorMessage": feat[i].errorMessage,
                        "totalLines": feat[i].totalLines,
                        "timeTaken": feat[i].timeTaken,
                        "successIndicator": feat[i].successIndicator
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
