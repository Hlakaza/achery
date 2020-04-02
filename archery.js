window.onload = function () {
  var canvas = document.getElementById("archery"),
    ctx = canvas.getContext("2d"),
    targetObject,
    bowObject,
    pointsTally = 0;
  givenArrows = 10
  targetPosition = 220;
  bowArrow = 200;
  bowArrowX = 90;
  function addPoints(points) {
    pointsTally += points;
    var pointsEl = document.getElementById('points');
    var progressEl = document.getElementById('progress');
    var arrowsLeftEl = document.getElementById('arrowsLeft');
    pointsEl.innerHTML = pointsTally;
    progressEl.style.width = pointsTally + '%'
    arrowsLeftEl.style.width = givenArrows * 10 + '%'
  }

  function caculateArrows() {
    if (!givenArrows) {
      alert('Game over')
      location.reload()
    }
  }
  calculateCanvasWidth();
  setPositions()

  var Controller = {
    objects: [],
    render: function () {
      Controller.clearCanvas();
      var i = 0,
        l = Controller.objects.length,
        object;
      for (i = 0; i < l; ++i) {
        object = Controller.objects[i];
        object.update();
        object.render();
      }
      requestAnimationFrame(Controller.render);
    },
    clearCanvas: function () {
      canvas.width = canvas.width;
    }
  }

  var BaseObject = function (opts) {
    var defaultOpts = {
      position: new Vector(bowArrowX, bowArrow),
      angle: 0,
      scale: new Vector(1, 1),
      width: 40,
      height: 40,
      update: function () {

      },
      render: function () {
        ctx.save();
        this.applyTransformations();
        this.draw();
        ctx.restore();
      },
      applyTransformations: function () {
        ctx.translate(+this.position.x, +this.position.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.translate(-this.position.x, -this.position.y);

      },
      draw: function () {
        ctx.rect(this.position.x + -this.width / 2, this.position.y + -this.height / 2, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
    }

    var obj = Object.assign(defaultOpts, opts);
    Controller.objects.push(obj);
    return obj;
  }

  var Arrow = function (opts) {
    var defaultOpts = new BaseObject({
      height: 6,
      speed: 40,
      angle: -20,
      gravity: 34,
      flying: false,
      dead: false,
      width: 120,
      direction: 1,
      update: function () {
        if (this.flying) {
          this.applyMotion();
          if (this.position.y > 1000 || (targetObject && this.position.x + this.width / 2 >= targetObject.position.x)) {
            this.position.x = targetObject.position.x - this.width / 2 + Math.random() * 20;
            var distanceFromCentre = Math.abs((this.position.y + Math.sin(this.angle * Math.PI / 180) * 1.1 * this.width / 2 - targetObject.position.y) / 100);
            distanceFromCentre *= 1 / (targetObject.height / 100);
            distanceFromCentre *= 5;
            distanceFromCentre = Math.floor(distanceFromCentre);
            distanceFromCentre *= 2;
            var points = 10 - distanceFromCentre;
            if (points < 0)
              points = 0;
            givenArrows--
            addPoints(points);
            console.log(points, distanceFromCentre);
            this.flying = false;
            this.dead = true;
            caculateArrows()
          }
        } else if (!this.dead) {
          if (this.direction > 0) {
            this.angle++;
            if (this.angle > 45)
              this.direction = -1;
          } else if (this.direction < 0) {
            this.angle--;
            if (this.angle < -45)
              this.direction = 1;
          }
          bowObject.angle = this.angle;
        }
      },
      applyMotion: function () {
        this.angle++;
        var xMotion = Math.cos(this.angle * Math.PI / 180),
          yMotion = Math.sin(this.angle * Math.PI / 180);
        this.position.x += this.speed * (xMotion > 0 ? xMotion : 0);
        this.position.y += yMotion > -1 && yMotion < 1 ? yMotion * this.gravity : 0;
      },
      draw: function () {
        ctx.beginPath();
        ctx.rect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = '#c57f43';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.position.x + -this.width / 2, this.position.y - this.height / 2, this.width, this.height / 2);
        ctx.fillStyle = '#f8c06b';
        ctx.fill();
        if (!this.dead) {
          ctx.beginPath();
          ctx.moveTo(this.position.x + this.width / 2, this.position.y);
          ctx.lineTo(this.position.x + this.width / 2, this.position.y - this.height);
          ctx.lineTo(this.position.x + this.width / 2 + this.height * 2, this.position.y);
          ctx.fillStyle = '#605448';
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(this.position.x + this.width / 2, this.position.y);
          ctx.lineTo(this.position.x + this.width / 2, this.position.y + this.height);
          ctx.lineTo(this.position.x + this.width / 2 + this.height * 2, this.position.y);
          ctx.fillStyle = '#42382e';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(this.position.x - this.width / 2 + this.height * 3, this.position.y + this.height / 2);
        ctx.lineTo(this.position.x - this.width / 1.75 + this.height * 3, this.position.y + this.height);
        ctx.lineTo(this.position.x - this.width / 1.75, this.position.y + this.height);
        ctx.lineTo(this.position.x - this.width / 2, this.position.y + this.height / 2);
        ctx.fillStyle = '#8c401e';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.position.x - this.width / 2 + this.height * 3, this.position.y - this.height / 2);
        ctx.lineTo(this.position.x - this.width / 1.75 + this.height * 3, this.position.y - this.height);
        ctx.lineTo(this.position.x - this.width / 1.75, this.position.y - this.height);
        ctx.lineTo(this.position.x - this.width / 2, this.position.y - this.height / 2);
        ctx.fillStyle = '#ac5e2e';
        ctx.fill();
      }
    });

    var obj = Object.assign(defaultOpts, opts);
    return obj;
  }

  var Vector = function (x, y) {
    return {
      x: x,
      y: y
    }
  }

  var Target = function (opts) {
    var defaultOpts = new BaseObject({
      position: new Vector(canvas.width - 100, targetPosition),
      height: 150,
      scale: new Vector(0.5, 1),
      draw: function () {

        ctx.rect(this.position.x - 10, 0, 350, canvas.height);
        ctx.fillStyle = '#ba631c';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.position.x - 20, 0, 100, canvas.height);
        ctx.fillStyle = '#934c0c';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.position.x + 200, 0, 100, canvas.height);
        ctx.fillStyle = '#3e2723';
        ctx.fill();

        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(this.position.x + 40, this.position.y, this.height, 0, Math.PI * 2);
        ctx.fillStyle = "#bf360c";
        ctx.fill();

        ctx.beginPath();
        ctx.globalAlpha = 0.125;
        ctx.arc(this.position.x + 40, this.position.y, this.height, 0, Math.PI);
        ctx.fillStyle = "#212121";
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.height, 0, Math.PI * 2);
        ctx.fillStyle = "#eeeeee";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.height * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = "#424242";
        ctx.fill();
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.height * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = "#42a5f5";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.height * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#f44336";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.height * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffca28";
        ctx.fill();

        ctx.beginPath();
        ctx.globalAlpha = 0.125;
        ctx.arc(this.position.x, this.position.y, this.height, Math.PI * 0.5, Math.PI * 1.5);
        ctx.fillStyle = "#212121";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.height, 0, Math.PI);
        ctx.fillStyle = "#212121";
        ctx.fill();
      }
    });

    return Object.assign(defaultOpts, opts);
  }
  targetObject = new Target();

  var Bow = function (opts) {
    var defaultOpts = new BaseObject({
      position: new Vector(bowArrowX, bowArrow),
      angle: 0,
      scale: new Vector(2, 1),
      draw: function () {

        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(this.position.x - 185, this.position.y, 200, Math.PI * 1.9, Math.PI * 0.1);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#fbc36d";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.position.x - 187, this.position.y, 200, Math.PI * 1.9, Math.PI * 0.1);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#af6130";
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(this.position.x + 2, this.position.y + 63, 5, 15);
        ctx.fillStyle = "#f1b762";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.position.x + 2, this.position.y - 78, 5, 15);
        ctx.fillStyle = "#f1b762";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.position.x + 2, this.position.y + 63, 1, 15);
        ctx.fillStyle = "#af6130";
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.position.x + 2, this.position.y - 78, 1, 15);
        ctx.fillStyle = "#af6130";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.position.x + 5, this.position.y - 78);
        var arrowPosX = this.arrow.position.x - this.arrow.width / (2 * this.scale.x);

        ctx.lineTo((arrowPosX < this.position.x + 5 ? arrowPosX : this.position.x + 5), (arrowPosX < this.position.x + 5 ? this.arrow.position.y : this.position.y));
        ctx.lineTo(this.position.x + 5, this.position.y + 80);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#7b3015";
        ctx.stroke();

      }
    });

    return Object.assign(defaultOpts, opts);
  }

  bowObject = new Bow();
  //obj.render()

  var obj = new Arrow({});
  bowObject.arrow = obj;
  canvas.addEventListener('click', function (e) {
    if (!obj.flying) {
      obj.flying = true;
      setTimeout(function () {
        obj = new Arrow({ angle: bowObject.angle });
        bowObject.arrow = obj;
      }, 300);
    }
  });

  requestAnimationFrame(Controller.render);

  // window.addEventListener('resize', calculateCanvasWidth());

  function calculateCanvasWidth() {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    canvas.width = 1024;
    canvas.height = 600;
  }
  function setPositions() {
    if (canvas.width > 812) {
      targetPosition = 300;
      bowArrow = 350;
    }
    // else if (canvas.height > canvas.width) {
    //   alert('Please set your device to land scape mode')
    //   location.reload();
    // }
  }
}

// canvas.width = 1024;
// canvas.height = 600;