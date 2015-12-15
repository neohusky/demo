/**
 * Created by nucmed on 17/11/2015.
 */
var logic = {


    getBarcode: function () {
        url = "http://" + config.HotlabConnectServer + ":" + config.HotlabConnectPort + "/getBarcode";
        //retrieve barcode data from hotlab connect if barcopde string is empty
        if (config.BarcodeIncomming==="") {
            dhx.ajax().get(url, function (text, xml) {
                var obj = dhx.DataDriver.json.toObject(text, xml);
                config.BarcodeIncomming = obj["0"].Barcode;
                //If there is no data the reformat undefined/null to "" string
                if (config.BarcodeIncomming === undefined || config.BarcodeIncomming === null) {
                    config.BarcodeIncomming = "";
                    console.log("Funny data received and therefore reset config string to empty");
                }
            });
            console.log("Barcode data received and string updated to:"+config.BarcodeIncomming);
            //barcodeForm.setItemValue("barcode","Theo");
        }
    },
    getAppSettings: function(){

        dhx.ajax().get("data/appSettings.php", function(text,xml){
            var AppSettings = dhx.DataDriver.json.toObject(text,xml);

            config.TimeOut = AppSettings.AppSettings["0"].App_TimeOut;
            config.HotlabConnectServer =AppSettings.AppSettings["0"].App_HotlabConnectServer;
            config.HotlabConnectPort =AppSettings.AppSettings["0"].App_HotlabConnectPort;

        });

    },
    getUrlVars: function () {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            function(m,key,value) {
                vars[key] = value;
            });
        return vars;
    },

    getUserDetails: function() {

        dhx.ajax().get("data/userDetails.php?id=" + config.UserName, function (text, xml) {
            var UserDetails = dhx.DataDriver.json.toObject(text, xml);

            config.StaffName = UserDetails.UserDetails["0"].Staffname;
            config.StaffPosition = UserDetails.UserDetails["0"].Position;

            //msgbox(Position);

        })
    },
/*    zplLastAddedId: function(tble){

        dhx.ajax().get("data/lastadded.php?id="+tble, function(text,xml){
            var id = dhx.DataDriver.json.toObject(text,xml);

            id = id.id["0"].id;
            //zplURL = "http://10.7.145.101/NMIS/labels/generator.php?id=" + id;
            zplURL = "labels/generator.php?id=" + id;
            dhtmlx.message({
                text: zplURL ,
                expire: -1, //milliseconds. You can use negative value (-1) to make notice persistent.
                type: "myNotice" // 'customCss' - css class
            });
        });
        return zplURL;
    },*/

    getLastAddedId: function(tble){

        dhx.ajax().("data/lastadded.php?id="+tble, function(text,xml){
            var id = dhx.DataDriver.json.toObject(text,xml);

            id = id.id["0"].id;

        });
        return id;
    },
    printLabel: function(label,id,copies){

        var zplurl = "labels/"+ label + ".php?id=" + id +"&copies="+copies;
        dhx.ajax().get(zplurl, function(text,xml){
        console.log(zplurl);

        });
    },
    barCodeReader: function(value){
        switch (value) {
            case config.BarcodeScanned:
                console.log("Incoming Barcode: " + config.BarcodeIncomming + "ScannedBarcode: " + config.BarcodeScanned);
                logic.log("barcodeConfirm", config.BarcodeScanned);
                config.BarcodeScanned = "";
                dhtmlx.message({
                    text: "Scan Successfull..Do Something" ,
                    expire: -1, //milliseconds. You can use negative value (-1) to make notice persistent.
                    type: "myNotice" // 'customCss' - css class
                });
                break;
            default:
                console.log(config.BarcodeIncomming);
                config.BarcodeScanned = config.BarcodeIncomming;
                logic.log("barcode", config.BarcodeScanned);
                break;
        }

        config.BarcodeIncomming="";

    },
/*    printKitBatchLabel: function(numberOfKits){
        var id = logic.getLastAddedId("generators");


        for (i = id-numberOfKits; i=id; i++) {
            var zplurl = "labels/"+ "generator" + ".php?id=" + i;
            dhx.ajax().get(zplurl, function(text,xml){


            });
        }


    }*/
    log: function(Type,value){

        switch (Type) {
            case "barcode": statusBar.setText("Scanned Barcode:"+value+". Please rescan");break;
            case "barcodeConfirm":statusBar.setText("Confirmed Barcode:"+value);break;
            case "btnLast2Days": dhtmlx.alert("Last 2 Days"); break;
            case "btnLast7Days": dhtmlx.alert("Last 7 Days"); break;
            default: break;
        }
    }
};