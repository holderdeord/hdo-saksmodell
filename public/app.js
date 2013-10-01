angular.module('app', ['ngResource', 'ngHttp']);

function AppController($scope, $http){
  $scope.issue = null;

  $http.get('/issues').then(function (response) {
    $scope.issueNames = response.data;
  })

  $scope.openIssue = function (name) {
    $http.get('/issues/' + name).then(function (response) {
      $scope.issue = response.data.data;
    })
  }

  $scope.getPositions = function (issue) {
    return issue ? issue.valence_issue_explanations : [];
  }

  $scope.getVoteCountForPosition = function (position) {
    return $scope.getVotesForPosition(position).length;
  }

  $scope.getVotesForPosition = function (position) {
    var result = [];

    angular.forEach($scope.issue.vote_connections, function (vc) {
      if (vc.position == position) {
        result.push(vc);
      }
    });

    return result;
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
      return p.name;
    }).join(',')
  }

  $scope.getCalculatedPartyList = function (position) {
    var votes = $scope.getVotesForPosition(position).map(function (vc) { return vc.vote; })
    var result = [];

    angular.forEach(votes, function (vote) {
      angular.forEach(vote.stats.parties, function (stats, partyName) {
        var againstCount = stats.against || 0;
        var forCount = stats.for || 0;

        if(forCount > againstCount) {
          result.push(partyName);
        }
      });
    });

    return result.length ? result.join(',') : '???';
  }
}
