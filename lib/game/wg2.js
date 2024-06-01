class WG2Game extends Phaser.Scene {
  constructor() {
      super('WG2Game')
  }
  create() {
    if(gameInfo.type == 'development') console.log('WG2Game created successfully')
    this.cameras.main.fadeIn(250, 0, 0, 0)
    isLoaded.wg2 = true
    gameInfo.score = 0
    gameInfo.numQuest = sumArray(gameJson.word_in_folder)
    this.rewardBased = 'Percent'
    this.add.image(0, 0, 'WGTexture', 'bg2.png').setOrigin(0,0)
    this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
    this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
    this.menuNResetButton = new MenuNResetButton(this)
    var leverBar = new LevelBar(this, 1200, 35)
    //quest image
    this.add.image(295, 124, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest_0001.png').setOrigin(0,0).setTint(0x000000)
    this.add.image(766, 124, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest_0002.png').setOrigin(0,0).setTint(0x000000)
    //drop area
    this.dropGroup = this.add.group()
    for (var i = 0; i < 2; i++) {
      var drop = new WG2Drop(this, 0, 0, i)
      this.dropGroup.add(drop)
    }
    //word drag
    this.wordDragContainer = this.add.container()
    var numWordDrag = sumArray(gameJson.word_in_folder)
    var offsetX = 219.5
    var offsetY = 94
    var counter = {x:0, y:0}
    var numColumn = numWordDrag/2
    this.initPos = []
    for (var i = 0; i < numWordDrag; i++) {
      counter.x = i % numColumn
      if((i > 0) && (i % numColumn == 0)) {
        counter.y++
      }
      this.initPos[i] =
        {x: gameInfo.center.x + (counter.x*offsetX) - (offsetX*(numColumn-1)/2),
          y: 545.5 + (counter.y*offsetY)}
    }
    this.initPos = Phaser.Utils.Array.Shuffle(this.initPos)
    //option/word button
    var idxFoldGroup = 0
    var idxTrueVal = 0
    this.dropTarget = null
    this.posTarget = null
    for (var i = 0; i < numWordDrag; i++) {
      counter.x = i % numColumn
      if((i > 0) && (i % numColumn == 0)) {
        counter.y++
      }
      var wordDrag = new WG2Drag (this, this.initPos[i].x, this.initPos[i].y, i)
      this.wordDragContainer.add(wordDrag)
      // create trueValue for folder
      this.dropGroup.children.entries[idxFoldGroup].trueValue[idxTrueVal] = i
      idxTrueVal ++
      if (this.dropGroup.children.entries[idxFoldGroup].trueValue.length == gameJson.word_in_folder[idxFoldGroup]) {
        idxFoldGroup ++
        idxTrueVal = 0
      }
    }
    this.dialogMenu = new DialogMenu(this)
    this.resetMenu = new ResetMenu(this)
    this.rewardMenu = new RewardMenu(this)
  }
  enabledOtherButton(_status){
    containerButtonSetEnabled(this.menuNResetButton, _status)
    groupDragSetEnabled(this.wordDragContainer, _status)
  }
  check(obj) {
    for (var i = 0; i < this.dropTarget.trueValue.length; i ++) {
      if (obj.value == this.dropTarget.trueValue[i]) {
        if (obj.isCorrectFirst) {
          gameInfo.score++
        }
        this.isCorrect = true
        obj.onTrue()
        this.dropTarget.onTrue()
        this.sound.play('true')
        gameInfo.currentCorrect++
        this.correctProgress()
        break;
      } else {
        this.isCorrect = false
      }
    }
    if (this.isCorrect == false) {
      obj.isCorrectFirst = false
      obj.onFalse()
      this.sound.play('false')
    }
    // console.log('obj.isCorrectFirst = ' + obj.isCorrectFirst)
    // console.log(obj.isCorrectFirst)
    // console.log('gameInfo.score after:')
    // console.log(gameInfo.score)
  }
  correctProgress() {
    if (gameInfo.currentCorrect == sumArray(gameJson.word_in_folder)) {
      // console.log('berhasil')
      // console.log(gameInfo.currentCorrect)
      this.rewardMenu.starWithPercent(gameInfo.score, gameInfo.numQuest, 60, 80)
      this.rewardMenu.show()
    }
  }
}

class WG2Drag extends Phaser.GameObjects.Container {
  constructor(scene, x, y, value) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('WGDrag2 created successfully')
    var size = {w: 211, h: 84}
    this.setSize(size.w, size.h)
    this.value = value
    this.lock = false
    this.isCorrectFirst = true
    this.bgWord = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 10, '0xFFFFCC')
    this.add(this.bgWord)
    this.word = scene.add.image(0, 0, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_drag_' + formatWithZero(value+1, 4) + '.png').setTint(0x000000)
    this.add(this.word)
    this.drag = scene.plugins.get('rexdragplugin').add(this)
    // this.drag.value = value
    // this.drag = drag
    this.on('dragstart', function(pointer, dragX, dragY) {
      this.parentContainer.bringToTop(this)
    })
    this.on('dragend', function(pointer, dragX, dragY, dropped) {
      var isBack = true
      for(var i = 0; i < 2; i++) {
        for(var j = 0; j < gameJson.word_in_folder[i]; j++) {
          var dist = {
            x: Phaser.Math.Distance.Between(this.x, 0, this.scene.dropGroup.children.entries[i].posDrop[j].x, 0),
            y: Phaser.Math.Distance.Between(0, this.y, 0,this.scene.dropGroup.children.entries[i].posDrop[j].y)}
          // var distX = Phaser.Math.Distance.Between(this.x, 0, this.scene.dropGroup.children.entries[i].posDrop[j].x, 0)
          // var distY = Phaser.Math.Distance.Between(0, this.y, 0,this.scene.dropGroup.children.entries[i].posDrop[j].y)
          if(dist.x <= 65 && dist.y <= 35) {
            this.scene.dropTarget = this.scene.dropGroup.children.entries[i]
            this.scene.posTarget = this.scene.dropGroup.children.entries[i].posDrop[j]
            if (this.scene.posTarget.lock) {
              this.resetPos()
            }else {
              this.scene.check(this)
              isBack = false
            }
            break;
          }
        }
      }
      if(isBack) this.resetPos()
    })
    
    scene.add.existing(this)
  }
  resetPos() {
    this.x = this.scene.initPos[this.value].x
    this.y = this.scene.initPos[this.value].y
  }
  posInTarget() {
    this.x = this.scene.posTarget.x
    this.y = this.scene.posTarget.y
    
  }
  init() {
    this.resetPos()
    this.bgWord.setFillStyle('0xFFFFCC', 1)
  }
  onTrue() {
    this.lock = true
    this.scene.posTarget.lock = true
    this.posInTarget()
    this.bgWord.setFillStyle('0x99FF66', 1)
    this.drag.setEnable(false)
  }
  onFalse() {
    this.posInTarget()
    this.bgWord.setFillStyle('0xFFAD85', 1)
    this.scene.time.delayedCall(750, this.init, [], this)
  }    
}
  
class WG2Drop extends Phaser.GameObjects.Container {
  constructor(scene, x, y, value) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('WG2Drop created successfully')
    this.value = value
    this.counter = 0
    this.trueValue = []
    //setting position drop
    var initX = (value == 0) ? 291 : 765
    var initY = (gameJson.word_in_folder[value] == 2) ? 361 : 314
    var offsetX = 220
    var offsetY = 93
    var counter = {x: 0, y: 0}
    this.posDrop = []
    //setting signs
    var signX = (value == 0) ? 138 : 1139
    var offSignY = 35
    this.correctGroup = scene.add.group()
    //create position drop & signs
    for (var i = 0; i < gameJson.word_in_folder[value]; i++) {
      counter.x =  i % 2
      if (i == 2) {
        counter.y++
      }
      this.posDrop[i] = {x: (initX + (counter.x*offsetX)),y: (initY + (counter.y*offsetY))}
      this.posDrop[i].lock = false
      //drop area
      this.add(scene.add.image(this.posDrop[i].x, this.posDrop[i].y, 'WGTexture', 'drop.png'))
      var sign = scene.add.image(signX, 315 + (i*offSignY), 'WGTexture', 'wg_sign_0001.png')
      this.add(sign)
      this.correctGroup.add(sign)
    }
    this.updateSign
    scene.add.existing(this)
  }
  updateSign() {
    for(var i = 0; i < this.correctGroup.getLength(); i++){
      if(i < this.counter){
        this.correctGroup.children.entries[i].setTexture('WGTexture', 'wf_sign_0002.png')
      }else{
        this.correctGroup.children.entries[i].setTexture('WGTexture', 'wf_sign_0001.png')
      }
    }
  }
  onTrue() {
    this.counter++
    this.updateSign()
  }
}