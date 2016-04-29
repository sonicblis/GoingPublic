app.directive("meetingList", [function () {
	return {
		restrict: '',
		scope: true,
		templateUrl: 'app/meetings/meetingList.html',
		controller: ['$scope', 'firebaseArrayWatcher', 'firebase', 'peopleProvider', function ($scope, fbaWatcher, firebase, peopleProvider) {
			$scope.people = peopleProvider.people;
			$scope.meetings = fbaWatcher.getWatcher(firebase.meetings);
			$scope.meeting = {};
			$scope.initMeeting = function(){
				$scope.meeting = {on: new Date()};
			};
			$scope.saveMeeting = function(){
				$scope.meeting.on = $scope.meeting.on.getTime();
				if ($scope.meeting.$id){
					firebase.meetings.child($scope.meeting.$id).set(firebase.cleanAngularObject($scope.meeting));
				}
				else {
					firebase.meetings.push($scope.meeting);
				}
				$scope.editing = false;
				$scope.initMeeting();
			};
			$scope.addMeeting = function(){
				$scope.editing = true;
			};
			$scope.editMeeting = function(meeting){
				meeting.on = new Date(meeting.on);
				$scope.meeting = meeting;
				$scope.editing = true;
			};
			$scope.deleteMeeting = function(meeting){
				firebase.meetings.child(meeting.$id).remove();
			};
			$scope.cancel = function(){
				$scope.meeting = {};
				$scope.editing = false;
				$scope.initMeeting();
			};
			$scope.getPersonNameFromId = function(personId){
				var person = peopleProvider.people.find(function(person){
					return person.$id === personId;
				});
				return person.name;
			};
			$scope.getAttendeeNames = function(idArray){
				var names = idArray.map(function(id){
					return $scope.getPersonNameFromId(id);
				});
				return names.join(', ');
			};
			$scope.initMeeting();
		}],
		link: function ($scope, $el, $attr) {

		}
	}
}]);
