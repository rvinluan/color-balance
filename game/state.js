export default class State {
  constructor() {
    this.goalPs = this.generateRandomGoals();
  }

  generateRandomGoals() {
    var g = [];
    for (var i = 0; i < 3; i++) {
      g.push(Math.floor(Math.random() * 92));
    }
    g.sort((a, b) => a - b);
    g.push(92);
    g.unshift(0);
    var goals = [];
    for (var i = 0; i < g.length - 1; i++) {
      goals.push(g[i + 1] - g[i]);
    }
    goals = goals.map((e) => e + 2);
  
    //set widths of things
    this.adjustBars("goal", goals);
    return goals;
  }

  adjustBars(which, amountsArray) {
    for (var i = 0; i < amountsArray.length; i++) {
      var cn = "." + which + " .indicator" + (i + 1);
      document.querySelector(cn).style.width = amountsArray[i] + "%";
    }
  }
}
