describe("PositionCalculator", function() {
  var issue, calculator;

  beforeEach(function() {
    issue = {};
    calculator = new PositionCalculator(issue);
  });

  it("should not do anything yet", function() {
    // player.play(song);
    // expect(player.currentlyPlayingSong).toEqual(song);
    //
    // //demonstrates use of custom matcher
    // expect(player).toBePlaying(song);
    expect(calculator.calculate()).toEqual({})
  });

});