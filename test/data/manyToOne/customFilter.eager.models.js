var patio = require("index"),
    sql = patio.SQL,
    helper = require("./helper"),
    comb = require("comb");

exports.loadModels = function () {
    var ret = new comb.Promise()
    return comb.executeInOrder(helper, patio, function (helper, patio) {
        var DB = helper.createTables();
        var Company = patio.addModel(DB.from("company"), {
            static:{
                init:function () {
                    this._super(arguments);
                    this.oneToMany("employees", {fetchType:this.fetchType.EAGER});
                    this.oneToMany("omahaEmployees", {model:"employee", fetchType:this.fetchType.EAGER}, function (ds) {
                        return ds.filter(sql.identifier("city").ilike("omaha"));
                    });
                    this.oneToMany("lincolnEmployees", {model:"employee", fetchType:this.fetchType.EAGER}, function (ds) {
                        return ds.filter(sql.identifier("city").ilike("lincoln"));
                    });
                }
            }
        });
        var Employee = patio.addModel(DB.from("employee"), {
            static:{
                init:function () {
                    this._super(arguments);
                    this.manyToOne("company", {fetchType:this.fetchType.EAGER});
                }
            }
        });
        //define associations
        patio.syncModels();

    });

};


exports.dropModels = function () {
    return helper.dropTableAndDisconnect();
};
