app.directive("auth", [function () {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'app/people/auth.html',
		controller: ['$scope', 'peopleProvider', function ($scope, peopleProvider) {
			$scope.selectedPerson = peopleProvider.authenticatedPerson;
			$scope.authenticate = peopleProvider.registerUser;
		}],
		link: function ($scope, $el, $attr) {

		}
	}
}]);
