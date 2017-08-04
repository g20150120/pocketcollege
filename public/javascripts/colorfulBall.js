
    var max = 100
    var canvas, ctx
    window.onload = function () {
      canvas = document.getElementById('tutorial')
      ctx = canvas.getContext('2d')
      var rangeXaxis = [0, canvas.width / 3]
      var rangeYaxis = [canvas.height * 2 / 3, canvas.height]
      var balls = []
      for (var i = 0; i < max; i++) {
        var x = random(rangeXaxis[0], rangeXaxis[1])
        var y = random(rangeYaxis[0], rangeYaxis[1])
        var endY = random(0, canvas.height / 4)
        var endX = random(canvas.width * 3 / 4, canvas.width)
        var ball = new Ball(
          x,
          y,
          endX - x,
          endY - y,
          random(1, 8),
          randomColor()
        )
        balls.push(ball)
      }
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.fillStyle = "rgba(255,255,255,0.2)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.restore()
        var t = function (x) {
          return canvas.width / x / 100 / 1000
        }(7) // 如果 5秒走完，则 输入5
        balls.forEach(function (b) {
          b.run(t)
        })
        if ("requestAnimationFrame" in window) {
          requestAnimationFrame(animate)
        } else if ("webkitRequestAnimationFrame" in window) {
          webkitRequestAnimationFrame(animate)
        } else if ("msRequestAnimationFrame" in window) {
          msRequestAnimationFrame(animate)
        } else if ("mozRequestAnimationFrame" in window) {
          mozRequestAnimationFrame(animate)
        }
      }
      animate()
      function random(min, max) {
        return Math.random() * (max - min) + min
      }
      function randomColor() {
        return (function (m, s, c) {
          return (c ? arguments.callee(m, s, c - 1) : '#') +
            s[m.floor(m.random() * 16)]
        })(Math, '0123456789abcdef', 5)
      }
    }
    //constructor here
    var Ball = function (x, y, vx, vy, radius, color) {
      this._x = x
      this._y = y
      this.x = x
      this.y = y
      this.vx = vx
      this.vy = vy
      this.radius = radius
      this.color = color
    }
    // ball position
    Ball.prototype.draw = function () {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
    }
    // ball move
    Ball.prototype.run = function (t) {
      if (this.x > canvas.width || this.y < 0) {
        this.x = this._x
        this.y = this._y
      }
      this.x += t * this.vx
      this.y += t * this.vy
      this.draw()
    }

