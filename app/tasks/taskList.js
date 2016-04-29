app.directive("taskList", [function () {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'app/tasks/taskList.html',
		controller: ['$scope', 'firebaseArrayWatcher', 'firebase', 'peopleProvider', 'logProvider', function($scope, firebaseArrayWatcher, firebase, peopleProvider, logProvider){
			$scope.tasks = firebaseArrayWatcher.getWatcher(firebase.tasks);
			$scope.newTask = {};
			$scope.initTask = function(){
				$scope.newTask = {due: new Date(), owner: $scope.newTask.owner || peopleProvider.people[0].$id};
			};
			$scope.saveTask = function(){
				var task = $scope.newTask;
				logProvider.info('taskList', 'saving task', task);
				task.due = task.due.getTime();
				if (!task.$id) {
					task.createdOn = firebase.now;
					task.createdBy = peopleProvider.authenticatedPerson.id;
					firebase.tasks.push(task);
				}
				else{
					task.lastEditedOn = firebase.now;
					task.lastEditedBy = peopleProvider.authenticatedPerson.id;
					firebase.tasks.child(task.$id).set(firebase.cleanAngularObject(task));
				}
				$scope.initTask();
			};
			$scope.editTask = function(task){
				task.due = new Date(task.due);
				$scope.newTask = task;
			};
			$scope.deleteTask = function(task){
				firebase.tasks.child(task.$id).remove();
			};
			$scope.cancel = function(){
				$scope.initTask();
			};
			$scope.people = peopleProvider.people;
			$scope.getTaskOwnerName = function(id){
				var person = peopleProvider.people.find(function(person){
					logProvider.debug('taskList', 'finding person\'s name', [person, id]);
					return person.$id === id;
				});
				return person.name;
			};
			$scope.updateCompletion = function(task){
				firebase.tasks.child(task.$id).child('completed').set(!task.completed);
			};
			$scope.user = peopleProvider.authenticatedPerson;

			$scope.initTask();
		}],
		link: function ($scope, $el, $attr) {

		}
	}
}]);
