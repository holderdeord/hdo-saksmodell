function PositionCalculator(issue) {
  this.issue = issue;
}

PositionCalculator.prototype.calculate = function () {
  return this.issue;
}