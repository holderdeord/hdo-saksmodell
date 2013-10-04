app = angular.module('app', ['ngResource', 'ngHttp']);

function AppController($scope, $http){
  $scope.issue = null;
  $scope.newPosition = null;

  $scope.spinner = function (show) {
    var el = document.getElementById('spinner');

    if (show) {
      el.style.display = 'inline';
    } else {
      el.style.display = 'none';
    }
  }

  $scope.updateIssueNames = function () {
    $scope.spinner(true);
    $http.get('/issues').then(function (response) {
      $scope.issueNames = response.data;
      $scope.spinner(false);
    })
  }

  $scope.updateIssueNames();

  $scope.openIssue = function (name) {
    $scope.issue = null;
    $scope.spinner(true);

    $http.get('/issues/' + name).then(function (response) {
      $scope.issue = response.data.data;
      $scope.spinner(false);
    })
  }

  $scope.saveIssue = function (copy) {
    var newSlug, method;

    if (copy) {
      newSlug = $scope.issue.slug + ' ' + prompt('Nytt navn (kopi):', 'kopi');
      method = 'POST';
    } else {
      newSlug = $scope.issue.slug;
      method = 'PUT';
    }
    $scope.spinner(true);

    $http({method: method, url: '/issues/' + newSlug, data: $scope.issue}).then(function (response) {
      $scope.spinner(false);
      $scope.updateIssueNames();
    })
  }

  $scope.deleteIssue = function () {
    $scope.spinner(true);

    $http({method: 'DELETE', url: '/issues/' + $scope.issue.slug}).then(function (response) {
      $scope.issue = null;
      $scope.spinner(false);
      $scope.updateIssueNames();
    })
  }

  $scope.getPositions = function (issue) {
    return issue ? issue.valence_issue_explanations : [];
  }

  $scope.getVoteCountForPosition = function (position) {
    return new PositionCalculator($scope.issue).getVotesForPosition(position).length;
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
    var result = new PositionCalculator($scope.issue).getPartyNamesForPosition(position);

    return result.length ? result.sort().join(',') : '???';
  }

  $scope.createPosition = function () {
    $scope.newPosition = {parties: [], id: guid()};
  }

  $scope.saveNewPosition = function () {
    $scope.issue.valence_issue_explanations.unshift($scope.newPosition);
    $scope.newPosition = null;
  }

  $scope.deletePosition = function (id) {
    if (!confirm("Sikker?")) {
      return;
    }

    var positions = $scope.issue.valence_issue_explanations;
    var result = [];

    // remove position
    angular.forEach(positions, function (pos) {
      if (pos.id != id) {
        result.push(pos)
      }
    });

    // remove from vote connections
    angular.forEach($scope.issue.vote_connections, function (vc) {
      if(vc.position_id == id) {
        vc.position_id = null;
      }
    });

    $scope.issue.valence_issue_explanations = result;
  }
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}
