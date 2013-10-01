angular.module('app', ['ngResource', 'ngHttp']);

function AppController($scope, $http){
  $scope.issue = null;
  $scope.votePositions = {}

  $scope.$watch('votePositions', function (before, after) {
    console.log(arguments);
  })

  $http.get('/issues').then(function (response) {
    $scope.issueNames = response.data;
  })

  $scope.openIssue = function (name) {
    $http.get('/issues/' + name).then(function (response) {
      $scope.issue = response.data.data;
      $scope.positions = $scope.issue.valence_issue_explanations;
    })
  }

  $scope.getPositions = function (issue) {
    return issue ? issue.valence_issue_explanations : [];
  }

  $scope.getVotes = function (issue) {
    var votes = issue ? issue.vote_connections : [];
    return votes.sort(function (va, vb) {
      var a = new Date(va.vote.time);
      var b = new Date(vb.vote.time);

      return a < b ? -1 : a > b ? 1 : 0;
    })
  }

  $scope.getPartyList = function (position) {
    return position.parties.map(function (p) {
      return p.external_id;
    }).join(',')
  }

  $scope.getCalculatedPartyList = function (position) {
    return JSON.stringify($scope.votePositions);
  }

}
