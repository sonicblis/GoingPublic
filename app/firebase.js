var baseUrl = "quickgoals.firebaseio.com";

app.constant('firebase', {
    root: new Firebase(baseUrl),
    people: new Firebase(baseUrl + "/people"),
    tasks: new Firebase(baseUrl + "/tasks"),
    questions: new Firebase(baseUrl + "/questions"),
    meetings: new Firebase(baseUrl + "/meetings"),
    events: {
        valueChanged: 'value',
        childAdded: 'child_added',
        childRemoved: 'child_removed'
    },
    now: Firebase.ServerValue.TIMESTAMP,
    stringify: function(firebaseObj){
        var path = firebaseObj.toString().replace(firebaseObj.root(), ''); //trims the root url from the path
        for (var i in arguments){
            if (arguments[i] != firebaseObj){
                path += '/' + arguments[i];
            }
        }
        return decodeURIComponent(path);
    },
    cleanAngularObject: function(object){
        if (angular){
            var tempObj = angular.fromJson(angular.toJson(object)); //cleans off all $$hashkey values from child collections
            for (var n in tempObj){
                if (n.substring(0,1) == '$'){
                    delete tempObj[n];
                }
            }
            return tempObj;
        }
        else{
            console.error("Angular is not available to use to clean the angular object.  This method doesn't need to be called in this context.");
        }
    }
});
