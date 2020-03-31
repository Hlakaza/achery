

window.onload = function () {

  String.prototype.repeat = String.prototype.repeat ||
    function (c) {
      var r = '';
      for (var i = 0; i < c; ++i);
      r += this;
      return r;
    }

  var startPage = document.getElementById("startMenu");
  startPage.addEventListener("click", startGame)
  function startGame() {
    startPage.style.display = "none";
    loadGame();
    try {
      startSound.play().catch(function (e) { });
      if (bgSound.paused) bgSound.play().catch(function (e) { });
      if (runCount == 0) {
        endSound.play().catch(function (e) { })
        hitSound.play().catch(function (e) { });
        successSound.play().catch(function (e) { });
        highScoreSound.play().catch(function (e) { });
        runCount++;
      }
    } catch (err) { }

  }

  var bestScore = 0;
  var runCount = 0;

  var startSound = new Audio();
  startSound.src = "sounds/zapsplat_sport_referee_whistle_001_14667.mp3";
  startSound.volume = 0.6;

  var shootSound = new Audio();
  shootSound.src = "sounds/zapsplat_warfare_bow_arrow_fire_shoot_001_40986.mp3";

  var hitSound = new Audio();
  hitSound.src = "sounds/zapsplat_warfare_arrow_shoot_hit_target_001_14336.mp3";

  var bgSound = new Audio();
  // bgSound.src = "sounds/music_dave_miles_still_learning_004.mp3"//"music2.ogg";
  bgSound.loop = true;
  bgSound.volume = 0.4;

  var endSound = new Audio();
  endSound.src = "sounds/zapsplat_sport_referee_whistle_002_14668.mp3";
  endSound.volume = 0.6;

  var successSound = new Audio();
  successSound.src = "sounds/smartsound_HUMAN_CROWD_Applause_Short.mp3";

  var highScoreSound = new Audio();
  highScoreSound.src = "sounds/smartsound_HUMAN_CROWD_Applause_Short.mp3";


  function loadGame() {
    "use strict";

    var gameScore = document.getElementById("score");
    var maincontainer = document.getElementById("mainContainer");
    var totalScore = 0;
    var autoMove = false;

    var w = window.innerWidth;
    var h = window.innerHeight;
    var canvas_width = window.innerWidth;
    var canvas_height = window.innerHeight;

    if (h > w) {
      // alert('Please play in landscape mode')
      maincontainer.style.transform = "translateX(" + (w) + "px) rotate(90deg)";
      maincontainer.style.width = h + "px";
      var nh = h;
      h = w;
      w = nh;
    }


    var updatePointArea = document.getElementById("showPoint");
    updatePointArea.style.height = h + "px";
    updatePointArea.style.width = w + "px";
    var uScore = document.querySelector("#showPoint .u");
    var arrs = document.getElementById("arrs");

    function updArr(arrNum) {
      var arr = "&uarr;";
      arr = arr.repeat(arrNum);
      arrs.innerHTML = arr;
    }

    function animateScore(scr, arrNum) {
      if (scr >= 7) uScore.innerHTML = "&uarr; +" + scr;
      else uScore.innerHTML = "+" + scr;
      updArr(arrNum);
      var t = 50, l = 70, o = 1;
      var animIntv = setInterval(function () {
        uScore.style.top = t + "%";
        uScore.style.left = l + "%";
        uScore.style.opacity = o;
        uScore.style.color = '#fff';
        t -= 4;
        l -= 3;
        o -= 0.1;
      }, 100)
      setTimeout(function () {
        clearInterval(animIntv);
        uScore.style.opacity = 0;
        uScore.style.top = "50%";
        uScore.style.left = "70%";
      }, 1000);
    }


    var c2 = document.getElementById("animCanvas");
    c2.height = h;
    c2.width = w;
    var ctx2 = c2.getContext("2d");

    var fwBuilder = function (n, x, y, speed) {
      this.n = n;
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.balls = [];
    }

    fwBuilder.prototype.ready = function () {
      for (var i = 0; i < this.n; i++) {
        this.balls[i] = {
          x: this.x,
          y: this.y,
          dx: this.speed * Math.sin(i * Math.PI * 2 / this.n),
          dy: this.speed * Math.cos(i * Math.PI * 2 / this.n),
          u: this.speed * Math.cos(i * Math.PI * 2 / this.n),
          t: 0
        }
      }
    }

    fwBuilder.prototype.draw = function () {
      for (var i = 0; i < this.n; i++) {
        ctx2.beginPath();
        ctx2.arc(this.balls[i].x, this.balls[i].y, 4, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.fillStyle = '#fff'
        ctx2.closePath();
        this.balls[i].x += this.balls[i].dx;
        this.balls[i].y += this.balls[i].dy;

        this.balls[i].dy += .025;
      }

      if (this.balls[Math.round(this.n / 2)].y > h) {
        clearInterval(intvA);
        running = false;
        ctx2.clearRect(0, 0, w, h);
      }
    }

    var fw1 = new fwBuilder(50, w / 5, h, 3);
    var fw2 = new fwBuilder(50, 4 * w / 5, h, 3);

    var intvA;
    var running = false;

    function newF() {
      if (!running) {
        fw1.ready();
        fw2.ready();
        running = true;
        intvA = setInterval(function () {
          ctx2.clearRect(0, 0, w, h);
          fw1.draw();
          fw2.draw();
        }, 15)
      }
    }
    newF();
    var c = document.getElementById("myCanvas");

    c.height = h;
    c.width = w;

    var ctx = c.getContext("2d");

    var checkArrowMoveWithBoard1 = false;
    var checkArrowMoveWithBoard2 = false;


    // Objects...

    // Backrounbd image
    // var bg = document.getElementById("background");
    // var ctb = bg.getContext("2d");
    // bg.width = w;
    // bg.height = h;
    // var bgImage = new Image();
    // bgImage.src = 'imgs/IMG_5065.jpg';
    // bgImage.addEventListener('load', drawBG, false);
    // function drawBG() {
    //     ctb.drawImage(bgImage, 0, 0)
    // }



    var arc = {
      x: 30,
      y: 100,
      dy: 3,
      r: 50,
      color: "#fff",
      lw: 3,
      start: Math.PI + Math.PI / 2,
      end: Math.PI - Math.PI / 2
    }

    var rope = {
      h: arc.r * 2,
      lw: 1,
      x: arc.x - 25,
      color: "#fff",
      status: true
    }

    var board = {
      x: w - 100,
      y: h / 2,
      dy: 4,
      height: 150,
      width: 7
    }

    var boardY;
    var boardMove = false;
    var totalArr = 10;
    updArr(totalArr);
    // var target = new Image();
    // target.src = 'imgs/target.png';
    // target.addEventListener('load', drawBoard, false);
    drawBoard()
    function drawBoard() {
      ctx.fillRect(board.x, board.y - board.height / 2, board.width, board.height);
      ctx.beginPath();
      ctx.fillRect(board.x, board.y - 5, 40, board.width + 3);
      ctx.moveTo(board.x, board.y - 15);
      ctx.quadraticCurveTo(board.x - 10, board.y, board.x, board.y + 15);
      // ctx.lineTo(10, 6);
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = "#fff";
      // ctx.drawImage(target, board.x, board.y -70, 100, board.width + 140);

      if (board.y >= h || board.y <= 0) {
        board.dy *= -1;
      }


      if (autoMove) {
        board.y += board.dy;
        if (checkArrowMoveWithBoard1) {
          arrow1.moveArrowWithBoard(1);
        }
        else if (checkArrowMoveWithBoard2) {
          arrow2.moveArrowWithBoard(1);
        }
      }
      else {

        if (boardMove) {
          if (Math.abs(board.y - boardY) > 5) {
            board.y += board.dy;
            arrow1.moveArrowWithBoard(1);
            arrow2.moveArrowWithBoard(1);
          }
        }
        else {
          if (Math.abs(board.y - boardY) > 5) {
            board.y -= board.dy;
            arrow1.moveArrowWithBoard(-1);
            arrow2.moveArrowWithBoard(-1);
          }
        }
      }
    }

    function Arrow() {
      this.w = 85;
      this.x = arc.x - 25;
      this.dx = 20;
      this.status = false;
      this.vis = true;
      this.fy = arc.y;
    }
    var arrowImg = new Image();
    // arrowImg.src = 'imgs/arrow.png';
    // arrowImg.addEventListener('load', false);
    Arrow.prototype.drawArrow = function () {
      if (this.vis) {
        if (this.status) {
          ctx.fillRect(this.x, this.fy - 3, 10, 6);
          ctx.fillRect(this.x, this.fy - 1, this.w, 2);
          ctx.beginPath();
          ctx.moveTo(this.x + this.w, this.fy - 4);
          ctx.lineTo(this.x + this.w + 12, this.fy);
          ctx.lineTo(this.x + this.w, this.fy + 4);
          ctx.fill();

          if (moveArrowCheck) {
            if (this.x < w - 155) {
              this.x += this.dx;
            }
            else {
              if (!(this.fy <= board.y - board.height / 2 || this.fy >= board.y + board.height / 2) || this.x > w) {
                if (this.x > w - 110) {
                  if (this == arrow1) {
                    arrow2.vis = true;
                    checkArrowMoveWithBoard1 = true;
                    checkArrowMoveWithBoard2 = false;
                  }
                  else {
                    arrow1.vis = true;
                    checkArrowMoveWithBoard1 = false;
                    checkArrowMoveWithBoard2 = true;
                  }
                  moveArrowCheck = false;
                  score++;
                  //console.log(score);
                  if (score === 4) {
                    arc.dy = 5;
                  }
                  else if (score === 8) {
                    autoMove = true;
                  }


                  if (this.fy >= board.y - board.height / 2 && this.fy <= board.y + board.height / 2) {
                    try {
                      // hitSound.play().catch(function(e){});
                    } catch (err) { }
                    var scores = this.fy - board.y;
                    var currentScore = Math.round(board.height / 20) - Math.round(Math.abs(scores / 10));
                    if (currentScore >= 7) {
                      newF();
                      // totalArr += 2; / adding arrows when hit bulls eye
                      try {
                        successSound.play().catch(function (e) { });
                      } catch (err) {
                      }
                    }

                    totalScore += currentScore;
                    gameScore.innerHTML = totalScore;

                    animateScore(currentScore, totalArr);

                    //board.y += scores;// + Math.floor(Math.random()*20);
                    boardY = board.y + scores;
                    if (scores >= 0) {
                      boardMove = true;
                    }
                    else {
                      boardMove = false;
                    }

                    //this.fy += scores;
                  }
                  else updArr(totalArr);
                  if (totalArr <= 0) {
                    clearInterval(intv);
                    try {
                      bgSound.pause();
                      endSound.play().catch(function (e) { });
                    } catch (err) {
                    }
                    document.getElementById("animCanvas").removeEventListener("click", shoot);
                    document.body.removeEventListener("keydown", shoot);
                    startPage.style.display = "block";
                    document.getElementById("title").innerHTML = "Your Score<br>" + totalScore;
                    if (bestScore < totalScore) {
                      bestScore = totalScore;
                      try {
                        highScoreSound.play().catch(function (e) { });
                      } catch (err) {
                      }
                    }
                    document.getElementById("score").innerHTML = 0;
                    document.getElementById("best").innerHTML = bestScore;
                  }

                }
                else {
                  this.x += this.dx;
                }
              }
              else {
                this.x += this.dx;
              }
            }
          }
        }
        else {
          ctx.fillRect(rope.x, arc.y - 3, 10, 6);
          ctx.fillRect(rope.x, arc.y - 1, this.w, 2);
          ctx.beginPath();
          ctx.moveTo(rope.x + this.w, arc.y - 4);
          ctx.lineTo(rope.x + this.w + 12, arc.y);
          ctx.lineTo(rope.x + this.w, arc.y + 4);
          ctx.fill();
        }
      }
    }

    // Arrow Move With Board

    Arrow.prototype.moveArrowWithBoard = function (dir) {
      if (this == arrow1) {
        arrow1.fy += board.dy * dir;
      }
      else {
        arrow2.fy += board.dy * dir;
      }
    }




    var arrow1 = new Arrow();
    var arrow2 = new Arrow();

    var arrows = 0;
    var moveArrowCheck = false;
    var score = 0;

    // Drawing functions...
    var Vector = function (x, y) {
      return {
        x: x,
        y: y
      }
    }

   var position = new Vector(60, 200);
   var angle = 0;
   var scale = new Vector(3, 1);

    function drawArc() {
      // ctx.beginPath();
      // ctx.arc(arc.x, arc.y, arc.r, arc.start, arc.end);
      // ctx.strokeStyle = arc.color;
      // ctx.lineWidth = arc.lw;
      // ctx.stroke();
      // ctx.closePath();

      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(arc.x - 185, arc.y, 200, Math.PI * 1.9, Math.PI * 0.1);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#37474f";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(arc.x - 187, arc.y, 200, Math.PI * 1.9, Math.PI * 0.1);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#546e7a";
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(arc.x + 2, arc.y + 63, 5, 15);
      ctx.fillStyle = "#37474f";
      ctx.fill();

      ctx.beginPath();
      ctx.rect(arc.x + 2, arc.y - 78, 5, 15);
      ctx.fillStyle = "#37474f";
      ctx.fill();

      ctx.beginPath();
      ctx.rect(arc.x + 2, arc.y + 63, 1, 15);
      ctx.fillStyle = "#546e7a";
      ctx.fill();

      ctx.beginPath();
      ctx.rect(arc.x + 2, arc.y - 78, 1, 15);
      ctx.fillStyle = "#546e7a";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(arc.x + 5, arc.y - 78);
      // var Arrow = this.arrow.position.x - this.arrow.width / (2 * this.scale.x);

      // ctx.lineTo((arrowPosX < position.x + 5 ? arrowPosX : position.x + 5), (arrowPosX < position.x + 5 ? this.arrow.position.y : position.y));
      // ctx.lineTo(position.x + 5, position.y + 78);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#212121";
      ctx.stroke();
    }

    function drawRope() {
      ctx.beginPath();
      ctx.moveTo(arc.x, arc.y - arc.r);
      if (arrow1.vis && arrow2.vis) {
        ctx.lineTo(rope.x, arc.y);
      }
      ctx.lineTo(arc.x, arc.y + arc.r);
      ctx.lineWidth = rope.lw;
      ctx.strokeStyle = rope.color;
      ctx.stroke();
      ctx.closePath();
    }

    // Moving function...

    function move() {
      ctx.clearRect(0, 0, w, h);
      if (arc.y > h - 50 || arc.y < 50) {
        arc.dy *= -1;
      }
      arc.y += arc.dy;
    }

    function shoot() {
      if (arrow1.vis && arrow2.vis && arrows != -1) {
        moveArrowCheck = true;
        if (arrows % 2 === 0) {
          arrow1.status = true;
          arrow1.fy = arc.y;
          arrow2.status = false;
          arrow2.x = rope.x;
          arrow2.vis = false;
        }
        else {
          arrow1.status = false;
          arrow2.fy = arc.y;
          arrow2.status = true;
          arrow1.x = rope.x;
          arrow1.vis = false;
        }
        totalArr--;
        try {
          shootSound.play().catch(function (e) { });
        } catch (err) { }
      }
      arrows++;
    }

    document.getElementById("animCanvas").addEventListener("click", shoot);
    document.body.addEventListener("keydown", shoot);






    var intv = setInterval(function () {
      move();
      drawArc();
      drawRope();
      arrow1.drawArrow();
      arrow2.drawArrow();
      drawBoard();
    }, 15)
  }
}
//window.onload = setTimeout(loadGame,2000);
