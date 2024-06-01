//-----------------true value???
class WG1Game extends Phaser.Scene {
  constructor() {
    super('WG1Game')
  }
  create() {
    if(gameInfo.type == 'development') console.log('WGGame created successfully')
    this.cameras.main.fadeIn(250, 0, 0, 0)
    isLoaded.wg1 = true
    this.add.image(0, 0, 'WGTexture', 'bg.png').setOrigin(0,0)
    this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
    this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
    this.menuNResetButton = new MenuNResetButton(this)
    this.rewardBased = 'NumWrong'
    //level bar
    var levelBar = new LevelBar(this, 1200, 35)
    //folders progress
    var offsetX = 233
    this.numFolder = gameJson.word_in_folder.length
    this.folderGroup = this.add.group()
    for (var i = 0; i < this.numFolder; i++) {
      var folder = new WG1Folder (this, gameInfo.center.x + (i*offsetX) - (offsetX*(this.numFolder-1)/2), 600, i)
      this.folderGroup.add(folder)
    }
    //setting word button group
    this.wordDragContainer = this.add.container()
    var numWordDrag = sumArray(gameJson.word_in_folder)
    var offsetX = 219.5
    var offsetY = 92
    var counter = {x:0, y:0}
    var numColumn = numWordDrag/4
    this.initPos = []
    for (var i = 0; i < numWordDrag; i++) {
      counter.x = i % numColumn
      if((i > 0) && (i % numColumn == 0)) {
        counter.y++
      }
      this.initPos[i] =
        {x: gameInfo.center.x + (counter.x*offsetX) - (offsetX*(numColumn-1)/2),
          y: 161 + (counter.y*offsetY)}
    }
    this.initPos = Phaser.Utils.Array.Shuffle(this.initPos)
    //option/word button
    var idxFoldGroup = 0
    var idxTrueVal = 0
    this.dropTarget = null
    this.isCorrect = false
    for (var i = 0; i < numWordDrag; i++) {
      counter.x = i % numColumn
      if((i > 0) && (i % numColumn == 0)) {
        counter.y++
      }
      var wordDrag = new WG1Drag (this, this.initPos[i].x, this.initPos[i].y, i)
      this.wordDragContainer.add(wordDrag)
      //create trueValue for folder (value word drag untuk setiap folder)
      this.folderGroup.children.entries[idxFoldGroup].trueValue[idxTrueVal] = i
      idxTrueVal ++
      if (this.folderGroup.children.entries[idxFoldGroup].trueValue.length == gameJson.word_in_folder[idxFoldGroup]) {
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
        this.isCorrect = true
        obj.onTrue()
        this.dropTarget.insert()
        this.sound.play('true')
        gameInfo.currentCorrect++
        this.correctProgress()
        break;
      } else {
        this.isCorrect = false
      }
    }
    if (this.isCorrect == false) {
      obj.onFalse()
      this.sound.play('false')
      gameInfo.currentWrong++
    }
  }
  correctProgress() {
    if (gameInfo.currentCorrect == sumArray(gameJson.word_in_folder)) {
      // console.log('berhasil')
      // console.log(gameInfo.currentCorrect)
      // console.log(gameInfo.currentWrong)
      this.rewardMenu.starWithNumWrong(1, 5, 9)
      this.rewardMenu.show()
    }
  }
}


class WG1Drag extends Phaser.GameObjects.Container {
  constructor(scene, x, y, value) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('WG1Drag created successfully')
    var size = {w: 210, h: 83}
    this.setSize(size.w, size.h)
    this.value = value
    this.lock = false
    this.bgWord = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 10, '0xFFFFCC')
    this.add(this.bgWord)
    this.word = scene.add.image(0, 0, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_drag_' + formatWithZero(value+1, 4) + '.png').setTint(0x000000)
    this.add(this.word)
    this.drag = scene.plugins.get('rexdragplugin').add(this)
    // this.drag.value = value
    // this.drag = drag
    this.on('dragstart', function(pointer, dragX, dragY) {
      this.parentContainer.bringToTop(this)
      this.bgWord.fillColor = 0x99FF66
    })
    this.on('dragend', function(pointer, dragX, dragY, dropped) {
      for(var i = 0; i < this.scene.numFolder; i++) {
        var distX = Phaser.Math.Distance.Between(this.x, 0, this.scene.folderGroup.children.entries[i].x, 0)
        var distY = Phaser.Math.Distance.Between(0, this.y, 0,this.scene.folderGroup.children.entries[i].y)
        if(distX <= 80 && distY <= 95) {
          this.scene.dropTarget = this.scene.folderGroup.children.entries[i]
          this.scene.check(this)
          break;
        }
      }
      this.init()    
      this.resetPos()
    })
    scene.add.existing(this)
  }
  resetPos() {
    this.x = this.scene.initPos[this.value].x
    this.y = this.scene.initPos[this.value].y
  }
  init() {
    this.bgWord.setFillStyle('0xFFFFCC', 1)
  }
  onTrue() {
    this.visible = false
  }
  onFalse() {
    // console.log('false')
    // console.log(this.bgWord)
    // this.bgWord.fillColor = 0xFFAD85
    this.bgWord.setFillStyle('0xFFAD85', 1) //--------tidak berfungsi lagi
    this.scene.time.delayedCall(750, this.init, [], this)
  }
}
  
class WG1Folder extends Phaser.GameObjects.Container {
  constructor(scene, x, y, value) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('WG1Folder created successfully')
    this.value = value
    this.counter = 0
    this.trueValue = []
    scene.anims.create({
      key: 'init',
      frames: scene.anims.generateFrameNames('WGTexture', {
        prefix: 'folder_anim_',
        start: 1,
        end: 1,
        suffix: '.png',
        zeroPad: 4
      }),
      repeat: 0
    })
    scene.anims.create({
      key: 'insert',
      frames: scene.anims.generateFrameNames('WGTexture', {
        prefix: 'folder_anim_',
        start: 1,
        end: 10,
        suffix: '.png',
        zeroPad: 4
      }),
      repeat: 0
    })
    this.folder = scene.add.sprite(0, 0).setOrigin(0.5, 0.5)
    this.folder.play('init')
    this.add(this.folder)
    this.add(scene.add.image(0, -12, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_drop_' + formatWithZero(value+1, 4) + '.png').setTint(0x000000))
    //progress bar
    var offsetX = 35
    var numSign = gameJson.word_in_folder[value]
    this.correctGroup = this.scene.add.group()
    this.add(scene.add.rexRoundRectangle(0, 35.6, (numSign*offsetX), 36.55, 10, '0xFFD072'))  //0xFFA725  //FFD072
    for (var i = 0; i < numSign; i++) {
      var sign = scene.add.image((i*offsetX) - (offsetX*(numSign-1)/2), 35.6,"WGTexture","wf_sign_0001.png")
      this.add(sign)
      this.correctGroup.add(sign)
    }
    this.updateSign()
    scene.add.existing(this)
  }
  updateSign(){
    for(var i = 0; i < this.correctGroup.getLength(); i++){
      if(i < this.counter){
        this.correctGroup.children.entries[i].setTexture('WGTexture', 'wg_sign_0002.png')
      }else{
        this.correctGroup.children.entries[i].setTexture('WGTexture', 'wg_sign_0001.png')
      }
    }
  }
  insert() {
    this.folder.play('insert')
    this.counter++
    this.updateSign()
  }
}