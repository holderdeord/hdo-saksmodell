describe("PositionCalculator", function() {
  var issue, calc;

  beforeEach(function() {
    issue = {
      vote_connections: [
        {
          position_id: 1,
          title: 'vote 1',
          vote: {
            stats: {
              parties: {
                "Høyre": {
                  absent: 12,
                  against: 18
                },
                "Fremskrittspartiet": {
                  absent: 18,
                  against: 23
                },
                "Sosialistisk Venstreparti": {
                  against: 7,
                  absent: 4
                },
                "Arbeiderpartiet": {
                  absent: 25,
                  against: 38,
                  'for': 1
                },
                "Venstre": {
                  absent: 1,
                  'for': 1
                },
                "Kristelig Folkeparti": {
                  absent: 4,
                  against: 6
                },
                "Senterpartiet": {
                  absent: 5,
                  against: 6
                }
              }
            }
          }
        },
          {
          position_id: 2,
          title: 'vote 2',
          vote: {
            stats: {}
          }
        },
      ]
    };

    calc = new PositionCalculator(issue);
  });

  it("should get votes for position", function() {
    var votes = calc.getVotesForPosition({id: 1})

    expect(votes.length).toBe(1);
    expect(votes[0].title).toEqual('vote 1');
  });

  it('should get party names for position', function () {
    var partyNames = calc.getPartyNamesForPosition({id: 1})
    expect(partyNames).toEqual(["Venstre"]);
  })

});