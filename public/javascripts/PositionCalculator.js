function PositionCalculator(issue) {
  this.issue = issue;
}

PositionCalculator.prototype.getVotesForPosition = function (position) {
  var result = [];

  angular.forEach(this.issue.vote_connections, function (vc) {
    if (vc.position_id === position.id) {
      result.push(vc);
    }
  });

  return result;
}

PositionCalculator.prototype.getPartyNamesForPosition = function (position) {
  var votes = this.getVotesForPosition(position).map(function (vc) { return vc.vote; })
  var result = [];

  angular.forEach(votes, function (vote) {
    angular.forEach(vote.stats.parties, function (stats, partyName) {
      var againstCount = stats.against || 0;
      var forCount = stats.for || 0;

      if(forCount > againstCount && result.indexOf(partyName) == -1) {
        result.push(partyName);
      }
    });
  });

  return result;
}
