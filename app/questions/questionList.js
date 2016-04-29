app.directive("questionList", [function () {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'app/questions/questionList.html',
		controller: ['$scope', 'firebaseArrayWatcher', 'firebase', 'peopleProvider', 'logProvider', function ($scope, firebaseArrayWatcher, firebase, peopleProvider, logProvider) {
			$scope.questions = firebaseArrayWatcher.getWatcher(firebase.questions);
			$scope.question = {};
			$scope.answer = {};
			$scope.initQuestion = function(){
				$scope.question = {askedOn: new Date()};
			};
			$scope.saveQuestion = function(){
				var question = $scope.question;
				question.askedOn = question.askedOn.getTime();
				question.askedBy = peopleProvider.authenticatedPerson.id;
				if (question.$id){
					firebase.questions.child(question.$id).set(firebase.cleanAngularObject(question));
				}
				else{
					firebase.questions.push(question);
				}
				$scope.initQuestion();
				$scope.editing = false;
			};
			$scope.addQuestion = function(){
				$scope.editing = true;
			};
			$scope.cancel = function(){
				$scope.editing = false;
				$scope.initQuestion();
			};
			$scope.cancelAnswer = function(){
				$scope.answering = false;
				$scope.answer.text = '';
			};
			$scope.editQuestion = function(question){
				question.askedOn = new Date(question.askedOn);
				$scope.question = question;
				$scope.editing = true;
			};
			$scope.deleteQuestion = function(question){
				firebase.questions.child(question.$id).remove();
			};
			$scope.getPersonNameFromId = function(personId){
				var person = peopleProvider.people.find(function(person){
					return person.$id === personId;
				});
				return person.name;
			};
			$scope.addAnswer = function(question){
				if (!question.answered) {
					$scope.selectedQuestion = question;
					$scope.answering = true;
				}
			};
			$scope.saveAnswer = function(){
				var questionId = $scope.selectedQuestion.$id;
				$scope.answer.answeredOn = new Date().getTime();
				$scope.answer.answeredBy = peopleProvider.authenticatedPerson.id;
				firebase.questions.child(questionId).child('answers').push($scope.answer);
				$scope.answering = false;
			};
			$scope.acceptAnswer = function(question, answer){
				answer.accepted = true;
				logProvider.info('questionList', 'setting answers', question.answers);
				firebase.questions.child(question.$id).child('answers').set(question.answers);
				firebase.questions.child(question.$id).child('answered').set(true);
			};
			$scope.reOpenQuestion = function(question){
				for (var n in question.answers){
					question.answers[n].accepted = false;
				}
				firebase.questions.child(question.$id).child('answers').set(question.answers);
				firebase.questions.child(question.$id).child('answered').set(false);
			};
			$scope.initQuestion();
		}],
		link: function ($scope, $el, $attr) {

		}
	}
}]);