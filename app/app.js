var app = angular.module('angularApp', ['firebase','checklist-model', 'ngSanitize']);
app.run(['logProvider', 'peopleProvider', function(logProvider, peopleProvider){
    logProvider.setLoggingLevels({
        warn: true,
        error: true,
        debug: false,
        info: true
    });

    peopleProvider.checkAuth();
}]);