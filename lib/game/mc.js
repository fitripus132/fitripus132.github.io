
class MCGame extends Phaser.Scene {
    constructor() {
        super('MCGame')
    }
    create() {
        
        if(gameInfo.type == 'development') console.log('MCGame created successfully')        
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.mc = true
        this.add.image(0, 0, 'MCTexture', 'bg.png').setOrigin(0)      
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.rewardBased = 'Percent'
        this.isCorrectFirst = true
        //group: menu button & reset button
        this.menuNResetButton = new MenuNResetButton(this)
        //level bar
        var levelBar = new LevelBar(this, 1200, 35)
        //bird progress animation
        var bird = new MCBird(this, 1110, 479)
        //quest progress
        this.add.bitmapText(160, 145, 'arial', gameInfo.currentQuest+1 + '/' + gameInfo.numQuest, 20).setTint('0x000000').setOrigin(0.5)
        //soal
        this.add.image(180, 130, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest_' + formatWithZero((gameInfo.currentQuest+1), 4) + '.png').setOrigin(0)
        //group option button
        this.optBtnGroup = this.add.group()
        var numOptBtn = 3
        var offsetY = 105
        var arrPos = []
        for (var i = 0; i < numOptBtn; i++) {
            var optBtn = new MCButton(this, 562, 477 + (offsetY * i) - (offsetY*(numOptBtn-1)/2), i)
            this.optBtnGroup.add(optBtn)
            arrPos[i] = {x: optBtn.x, y: optBtn.y}
        }
        this.optBtnGroup.shuffle()
        var children = this.optBtnGroup.getChildren()
        for (var i = 0; i < numOptBtn; i++) {
            children[i].x = arrPos[i].x
            children[i].y = arrPos[i].y
        }
        this.dialogMenu = new DialogMenu(this)
        this.resetMenu = new ResetMenu(this)
        this.rewardMenu = new RewardMenu(this)
    }

    check(obj) {
        // console.log('gameInfo.score before: ' + gameInfo.score)//
        
        if (obj.value == 0) {
            if (this.scene.isCorrectFirst) {
                gameInfo.score++
            }
            this.scene.sound.play('true')
            obj.onTrue()
            groupButtonSetEnabled(this.scene.optBtnGroup, false)    //----belum berhasil
            // console.log(this.scene.isCorrectFirst)//
            // console.log('benar! gameInfo.score after: ' + gameInfo.score)//
            this.scene.time.delayedCall(750, this.scene.next, [], this)
        }
        else {
            this.scene.isCorrectFirst = false
            this.scene.sound.play('false')
            obj.onFalse()
            groupButtonSetEnabled(this.scene.optBtnGroup, false)
            // console.log(this.scene.isCorrectFirst)//
            // console.log('salah! gameInfo.score after: ' + gameInfo.score)//
            this.scene.time.delayedCall(750, buttonInit, [this.scene.optBtnGroup], this)
        }
      }
    next() {
        gameInfo.currentQuest++
        if (gameInfo.currentQuest < gameInfo.numQuest) {
            this.scene.scene.start('RouteGame')
        } else {
            this.scene.rewardMenu.starWithPercent(gameInfo.score, gameInfo.numQuest, 50, 75)
            this.scene.rewardMenu.show()
        }
    }
    enabledOtherButton(_status){
        containerButtonSetEnabled(this.menuNResetButton, _status)
        groupButtonSetEnabled(this.optBtnGroup, _status)
    }
}


class MCButton extends Phaser.GameObjects.Container { //(0,0) di tengah option image pertama
    constructor(scene, x, y, value) {
      super(scene, x, y)
      if(gameInfo.type == 'development') console.log('MCButton created successfully')
      var size = {w: 725, h: 95}
      this.setSize(size.w, size.h)
      this.value = value
      this.lock = false
      this.bgOption = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 20, '0xffffff').setStrokeStyle(2, '0xFF9900')
      this.add(this.bgOption)
      this.option = scene.add.image(0, 0, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_opt_' + formatWithZero((gameInfo.currentQuest * 3)+value+1, 4) + '.png').setTint(0x000000)
      this.add(this.option)
      //jawaban benar: value = i
      this.correctImg = scene.add.image(size.w/2 - 10, -size.h/2 + 10, 'MCTexture', 'sign_0001.png')
      this.correctImg.visible = false
      this.add(this.correctImg)
      this.wrongImg = scene.add.image(size.w/2 - 10, -size.h/2 + 10, 'MCTexture', 'sign_0002.png')
      this.wrongImg.visible = false
      this.add(this.wrongImg)
      this.button = scene.plugins.get('rexbuttonplugin').add(this, {enable: true, mode: 1, clickInterval: 400})
      this.button.on('click', function (button, gameObject, pointer, event) {
        popButton(gameObject, {x:1.05 , y:1.1})
        gameObject.scene.time.delayedCall(300, gameObject.scene.check, [gameObject], gameObject)
      })
      scene.add.existing(this)
    }
    init() {
      this.wrongImg.visible = false
      this.bgOption.setFillStyle('0xffffff', 1)
      this.option.setTint(0x000000)
      this.button.enable = true
    }
    onTrue() {
      this.correctImg.visible = true
      this.bgOption.setFillStyle('0xFF9900', 1)
      this.option.setTint(0xffffff)
      this.button.enable = false
    }
    onFalse() {
      this.wrongImg.visible = true
      this.bgOption.setFillStyle('0xFF9900', 1)
      this.option.setTint(0xffffff)
      this.button.enable = false
    }
  }
  
  class MCBird extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
      super(scene, x, y)
      if (gameInfo.type == 'development') console.log('MCBird created successfully')
      if (gameInfo.numQuest == 10) {
        this.add(scene.add.image(0, 0, 'BirdBuildingTexture', 'bird_building_' + formatWithZero(gameInfo.currentQuest+1, 4) + '.png'))
      } else {
        this.add(scene.add.image(0, 0, 'BirdBuildingTexture', 'bird_building_' + formatWithZero(gameInfo.currentQuest+11, 4) + '.png'))
      }
      scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNames('BirdTexture', {
          prefix: 'BirdAnim_',
          start: 1,
          end: 50,
          suffix: '.png',
          zeroPad: 4
        }),
        repeat: -1
      })
      scene.anims.create({
        key: 'peck',
        frames: scene.anims.generateFrameNames('BirdTexture', {
          prefix: 'BirdAnim_',
          start: 51,
          end: 70,
          suffix: '.png',
          zeroPad: 4
        }),
        repeat: -1
      })
      this.bird = scene.add.sprite(50, 30 - ((gameInfo.currentQuest) * 30)).setOrigin(0.5, 0,5)
      this.add(this.bird)
      if (gameInfo.currentQuest+1 < gameInfo.numQuest) {
        this.bird.play('idle')
      } else {
        this.bird.play('peck')
      }
      scene.add.existing(this)
    }
  }