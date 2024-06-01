function resizeGame() {
  var canvas = document.querySelector("canvas")
  var windowWidth = window.innerWidth
  var windowHeight = window.innerHeight
  var windowRatio = windowWidth / windowHeight
  var gameRatio = game.config.width / game.config.height
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px"
    canvas.style.height = (windowWidth / gameRatio) + "px"
  } else {
    canvas.style.width = (windowHeight * gameRatio) + "px"
    canvas.style.height = windowHeight + "px"
  }
}

function popButton(gameObject, popScale) {
  gameObject.scene.sound.play('pop')
  if(popScale == undefined) {
    popScale = {x:1.1, y:1.1}
  }
  gameObject.scene.tweens.add({
    targets: gameObject,
    scaleX: popScale.x,
    scaleY: popScale.y,
    duration: 50,
    ease: 'Power2',
    yoyo: true
  })
}

function goTo(scene, target) {
  scene.cameras.main.fadeOut(250, 0, 0, 0)
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
    scene.scene.start(target)
	})
}

function formatWithZero(value, numDigit) {
  const numZero = numDigit-value.toString().length
  var str = ''
  for (var i = 0; i < numZero; i++) {
      str += '0'
  }
  str += value.toString()
  return str
}

function hideDialog(object) {
  object.visible = false
  object.scene.enabledOtherButton(true)
}

function buttonInit(group){
  var children = group.getChildren()
  for (var i = 0; i < children.length; i++){
    children[i].init()
  }
}

function groupButtonSetEnabled(group, enabled){
  var children = group.getChildren()
  for(var i = 0; i < children.length; i++){
    if(!children[i].lock){
      children[i].button.setEnable(enabled)
    }
  }
}

function containerButtonSetEnabled(group, enabled){
  for(var i = 0; i < group.list.length; i++){
    if(!group.list[i].lock){
      group.list[i].button.setEnable(enabled)
    }
  }
}

function groupDragSetEnabled(group, enabled) {
  for(var i = 0; i < group.length; i++){
    if(!group.list[i].lock){
      group.list[i].drag.setEnable(enabled)
    }
  }
}

function sumArray(array) {
  var sum = 0
  for(var i = 0; i < array.length; i++) {
    sum = sum += array[i]
  }
  return sum
}

function sumArrayBefore(array, indexPoint) {
  var sum = 0
  for(var i = 0; i < indexPoint; i++) {
    sum = sum += array[i]
  }
  return sum
}

function isArraySame(array1, array2) {
  var bool = false
  if(array1.length == array2.length) {
    for (var i = 0; i < array1.length; i++) {
      if(array1[i] == array2[i]) {
        bool = true
      } else {
        bool = false
        break;
      }
    }
  }
  return bool
}

function fadeIn(_scene, _target, _duration) {
  _scene.tweens.add({
    targets: _target,
    duration: _duration,
    alpha: 1
  });
}

function fadeOut(_scene, _target, _duration) {
  _scene.tweens.add({
    targets: _target,
    duration: _duration,
    alpha: 0
  });
}


