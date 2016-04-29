app.service('peopleProvider', ['$q', 'firebase', 'firebaseArrayWatcher', 'logProvider', '$rootScope', function($q, firebase, firebaseArrayWatcher, logProvider, $rootScope){
    var self = this;

    var peopleLoadedPromise = $q.defer();
    this.people = firebaseArrayWatcher.getWatcher(firebase.people, peopleLoadedPromise);
    this.peopleLoaded = peopleLoadedPromise.promise;
    this.authenticatedPerson = undefined;

    function setUserInfo(authInfo){
        logProvider.info('peopleProvider', 'authInfo provided to setUserInfo', authInfo);
        var userInfo = {
            imgPath: authInfo.google.profileImageURL,
            name: authInfo.google.displayName
        };
        logProvider.info('peopleProvider','userInfo from auth', userInfo);
        firebase.people.child(authInfo.uid).set(userInfo);
        userInfo.id = authInfo.uid;
        self.authenticatedPerson = userInfo;
    }

    this.registerUser = function(authProvider){
        if (!authProvider){
            authProvider = 'google';
        }
        logProvider.info('peopleProvider', 'user being registered');
        firebase.root.authWithOAuthPopup(authProvider, function (error, auth) {
            if (!error){
                logProvider.info('peopleProvider', 'user info retrieved from google', auth);
                setUserInfo(auth);
            }
            else{
                console.error('couldn\'t log the user in', error);
            }
        });
    };
    this.checkAuth = function(){
        var auth = firebase.root.getAuth();
        if (auth){
            setUserInfo(auth);
        }
    }
}]);