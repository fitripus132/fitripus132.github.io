class LoadingScreen extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    if(gameInfo.type == 'development') console.log('LoadingScreen created successfully')
    this.add(scene.add.image(0, 0, 'LoadingAnim', 'bg_loading.png').setOrigin(0))
    scene.anims.create({
      key: 'Loading',
      frames: scene.anims.generateFrameNames("LoadingAnim",
        {
          prefix: 'loading_anim_',
          start: 1,
          end: 10,
          suffix: '.png',
          zeroPad: 4
        }),
      repeat: -1
    })
    this.add(scene.add.sprite(gameInfo.center.x, gameInfo.center.y).play('Loading'))
    scene.add.existing(this)
  }
}

class LevelBar extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('LevelBar created successfully')
    var offsetY = 60
    this.add(scene.add.rexRoundRectangle(0, 0, 100, 60 + (gameInfo.numLevel * offsetY), 10, '0x99E0E0').setOrigin(0)) //Level Dasar: 0xF8B535 //Level 1: 0x99E0E0 //Level 2: 0xE7E773
    this.add(scene.add.bitmapText(15, 12, 'arial', 'Level', 20).setTint(0x000000))
    for (var i = 0; i < gameInfo.numLevel; i++) {
      if (i <= gameInfo.level) {
        this.add(scene.add.image(42, 80 + (i * offsetY), 'texture', 'dot_sm_level_' + formatWithZero(i+6, 4) + '.png'))  
      } else {
        this.add(scene.add.image(42, 80 + (i * offsetY), 'texture', 'dot_sm_level_' + formatWithZero(i+1, 4) + '.png'))
      }
    }
    scene.add.existing(this)
  }
}



class MenuNResetButton extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    if(gameInfo.type == 'development') console.log('MenuNResetButton created successfully')
    var menuBtn = scene.add.image(50, 70, 'texture', 'btn_sm_0001.png')
    if(gameJson.scene == 'IrGame') menuBtn.setPosition(65, 50)
    this.add(menuBtn)
    menuBtn.button = scene.plugins.get('rexbuttonplugin').add(menuBtn, {mode: 1,clickInterval: 200});
    menuBtn.button.on('click', function (button, gameObject, pointer, event) {
        popButton(gameObject)
        this.scene.dialogMenu.visible = true
        this.scene.enabledOtherButton(false)
    }, this)
    var resetBtn = scene.add.image(50, 155, 'texture', 'btn_sm_0002.png')
    if(gameJson.scene == 'IrGame') resetBtn.setPosition(1200, 50)
    this.add(resetBtn)
    resetBtn.button = scene.plugins.get('rexbuttonplugin').add(resetBtn, {mode: 1,clickInterval: 200});
    resetBtn.button.on('click', function (button, gameObject, pointer, event) {
        popButton(gameObject)
        this.scene.resetMenu.visible = true
        this.scene.enabledOtherButton(false)
    }, this)
    scene.add.existing(this)
  }
}

class DialogMenu extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    if(gameInfo.type == 'development') console.log('DialogMenu created successfully')
    this.add(scene.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setFillStyle('0xffffff', 0.5).setOrigin(0))
    this.add(scene.add.image(gameInfo.center.x, gameInfo.center.y, 'texture', 'panel_dialog.png'))
    this.add(scene.add.bitmapText(gameInfo.center.x,gameInfo.center.y - 50, 'arial', 'Kembali ke Menu?', 35).setTint(0x000000).setOrigin(0.5, 0.5))
    var yesImg = scene.add.image(gameInfo.center.x - 120,gameInfo.center.y + 40, 'texture', 'btn_dialog_0001.png')
    this.add(yesImg)
    yesImg.button = scene.plugins.get('rexbuttonplugin').add(yesImg, {enable: true, mode:0, clickInterval: 400})
    yesImg.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      button.scene.time.delayedCall(300, goTo, [button.scene, 'ChoiceGame'], this)
    })
    var noImg = scene.add.image(gameInfo.center.x + 120,gameInfo.center.y + 40, 'texture', 'btn_dialog_0002.png')
    this.add(noImg)
    noImg.button = scene.plugins.get('rexbuttonplugin').add(noImg, {enable: true, mode:0, clickInterval: 400})
    noImg.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      button.scene.time.delayedCall(300, hideDialog, [gameObject.parentContainer, false], this)
    })
    this.visible = false
    scene.add.existing(this)
  }
}

class ResetMenu extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    if(gameInfo.type == 'development') console.log('ResetMenu created successfully')
    this.add(scene.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setFillStyle('0xffffff', 0.5).setOrigin(0))
    this.add(scene.add.image(gameInfo.center.x, gameInfo.center.y, 'texture', 'panel_dialog.png'))
    this.add(scene.add.bitmapText(gameInfo.center.x,gameInfo.center.y - 50, 'arial', 'Ulangi permainan?', 35).setTint(0x000000).setOrigin(0.5, 0.5))
    var yesImg = scene.add.image(gameInfo.center.x - 120,gameInfo.center.y + 40, 'texture', 'btn_dialog_0001.png')
    this.add(yesImg)
    yesImg.button = scene.plugins.get('rexbuttonplugin').add(yesImg, {enable: true, mode:0, clickInterval: 400})
    yesImg.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      gameInfo.currentQuest = 0
      gameInfo.currentCorrect = 0
      gameInfo.currentWrong = 0
      gameInfo.score = 0
      button.scene.time.delayedCall(300, goTo, [button.scene, 'RouteGame'], this)
    })
    var noImg = scene.add.image(gameInfo.center.x + 120,gameInfo.center.y + 40, 'texture', 'btn_dialog_0002.png')
    this.add(noImg)
    noImg.button = scene.plugins.get('rexbuttonplugin').add(noImg, {enable: true, mode:0, clickInterval: 400})
    noImg.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      button.scene.time.delayedCall(300, hideDialog, [gameObject.parentContainer], this)
    })
    this.visible = false
    scene.add.existing(this)
  }
}

class RewardMenu extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    if(gameInfo.type == 'development') console.log('RewardMenu created successfully')
    this.visible = false
    this.add(scene.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setFillStyle('0xffffff', 0.5).setOrigin(0))
    if (scene.rewardBased == 'Percent') {
      this.add(scene.add.image(gameInfo.center.x, gameInfo.center.y, 'texture', 'panel_reward_0001.png'))
    } else if (scene.rewardBased == 'NumWrong') {
      this.add(scene.add.image(gameInfo.center.x, gameInfo.center.y, 'texture', 'panel_reward_0002.png'))
    }
    this.add(scene.add.image(gameInfo.center.x-250, gameInfo.center.y-200, 'texture', 'dot_md_level_' + formatWithZero(gameInfo.level+1, 4) + '.png'))
    //reset button
    var resetBtnX = (gameInfo.level < gameInfo.numLevel-1) ? (gameInfo.center.x-125):538
    var resetBtn = scene.add.image(resetBtnX, gameInfo.center.y+170, 'texture', 'btn_reward_0002.png')
    resetBtn.button = scene.plugins.get('rexbuttonplugin').add(resetBtn, {mode: 1,clickInterval: 200});
    resetBtn.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      gameInfo.currentQuest = 0
      gameInfo.currentCorrect = 0
      gameInfo.currentWrong = 0
      gameInfo.score = 0
      button.scene.time.delayedCall(300, goTo, [button.scene, 'RouteGame'])
    }, this)
    this.add(resetBtn)
    //menu button
    var menuBtnX = (gameInfo.level < gameInfo.numLevel-1) ? (gameInfo.center.x):757
    var menuBtn = scene.add.image(menuBtnX, gameInfo.center.y+170, 'texture', 'btn_reward_0001.png')
    menuBtn.button = scene.plugins.get('rexbuttonplugin').add(menuBtn, {mode: 1,clickInterval: 200});
    menuBtn.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      button.scene.time.delayedCall(300, goTo, [button.scene, 'ChoiceGame'])
    }, this)
    this.add(menuBtn)
    //next button
    if (gameInfo.level < gameInfo.numLevel-1) {
      var nextBtn = scene.add.image(gameInfo.center.x+125, gameInfo.center.y+170, 'texture', 'btn_reward_0003.png')
      nextBtn.button = scene.plugins.get('rexbuttonplugin').add(nextBtn, {mode: 1,clickInterval: 200});
      nextBtn.button.on('click', function (button, gameObject, pointer, event) {
        popButton(gameObject)
        gameInfo.currentQuest = 0
        gameInfo.currentCorrect = 0
        gameInfo.currentWrong = 0
        gameInfo.score = 0
        gameInfo.level++
        button.scene.time.delayedCall(300, goTo, [button.scene, 'RouteGame'])
      }, this)
      this.add(nextBtn)
    }
    
    //rasio soal yang benar & persentase
    if (scene.rewardBased == 'Percent') {
      this.ratioTrue = scene.add.bitmapText(gameInfo.center.x-60, gameInfo.center.y+50, 'arial', '10/10', 40).setTint(0x000000).setOrigin(0.5, 0.5)
      this.add(this.ratioTrue)
      this.percentTrue = scene.add.bitmapText(gameInfo.center.x+100, gameInfo.center.y+50, 'arial', '100%', 40).setTint(0x000000).setOrigin(0.5, 0.5)
      this.add(this.percentTrue)
    }
    // add star animation
    scene.anims.create({
      key: 'star_0',
      frames: scene.anims.generateFrameNames('StarTexture', {
        prefix: 'anim_star_',
        start: 1,
        end: 1,
        suffix: '.png',
        zeroPad: 4
      }),
      repeat: 0
    })
    scene.anims.create({
      key: 'star_1',
      frames: scene.anims.generateFrameNames('StarTexture', {
        prefix: 'anim_star_',
        start: 1,
        end: 6,
        suffix: '.png',
        zeroPad: 4
      }),
      repeat: 0
    })
    scene.anims.create({
      key: 'star_2',
      frames: scene.anims.generateFrameNames('StarTexture', {
        prefix: 'anim_star_',
        start: 1,
        end: 13,
        suffix: '.png',
        zeroPad: 4
      }),
      repeat: 0
    })
    scene.anims.create({
      key: 'star_3',
      frames: scene.anims.generateFrameNames('StarTexture', {
        prefix: 'anim_star_',
        start: 1,
        end: 21,
        suffix: '.png',
        zeroPad: 4
      }),
      repeat: 0
    })
    this.star = scene.add.sprite(gameInfo.center.x, gameInfo.center.y-125).setOrigin(0.5, 0.5)
    this.add(this.star)
    scene.add.existing(this)
  }
  starWithPercent(score, numScore, margin1, margin2) {
    var percentageTrue = (score / numScore) * 100
    this.ratioTrue.text = score + '/' + numScore
    this.percentTrue.text = percentageTrue.toFixed(0) + '%'
    this.isnumStar0 = percentageTrue < margin1
    this.isnumStar1 = margin1 <= percentageTrue && percentageTrue < margin2
    this.isnumStar2 = margin2 <= percentageTrue && percentageTrue < 100
    this.isnumStar3 = percentageTrue == 100
  }
  starWithNumWrong(margin1, margin2, margin3) {
    this.isnumStar0 = gameInfo.currentWrong >= margin3
    this.isnumStar1 = margin2 <= gameInfo.currentWrong && gameInfo.currentWrong < margin3
    this.isnumStar2 = margin1 <= gameInfo.currentWrong && gameInfo.currentWrong < margin2
    this.isnumStar3 = gameInfo.currentWrong < margin1
  }
  show() {
    if (gameInfo.level == gameInfo.numLevel-1) isComplete[gameInfo.game] = true
    this.visible = true
    this.scene.enabledOtherButton(false)
    var numStar = null
    if (this.isnumStar0) {
      numStar = 0
    } else if (this.isnumStar1) {
      numStar = 1
    } else if (this.isnumStar2) {
      numStar = 2
    } else if (this.isnumStar3) {
      numStar = 3
    }
    this.star.play('star_' + numStar)
    for(var i = 0; i < numStar; i++) {
      this.scene.time.delayedCall((200*2*i)+i, this.playSound, ['pop'], this)
    }
    this.scene.time.delayedCall((200*2*numStar)+numStar+80, this.playSound, ['win'], this)
  }
  playSound(_sound) {
    this.scene.sound.play(_sound)
  }

}

//-----------------I'rob-----------------

class IrButton extends Phaser.GameObjects.Container {
  constructor(scene, index, value, x, y, width, height, texture, colorPop, parentGroup) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('IrButton created successfully')              
    // this.scene = scene
    this.index = index
    this.value = value
    this.colorPop = colorPop
    this.setSize(width, height)
    this.bgButton = scene.add.rexRoundRectangle(0, 0, width, height, 20, '0x000000').setStrokeStyle(1, '0x000000', 1)
    this.add(this.bgButton)
    this.arabicImg = scene.add.image(0, 0, 'IrTexture', texture)
    this.add(this.arabicImg)
    this.button = scene.plugins.get('rexbuttonplugin').add(this,{enable: true, mode:0, clickInterval: 400})
    this.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject,{x:1.05,y:1.1})
      gameObject.scene.answer[gameObject.index] = value
      //gameObject yang ditekan saja yang berubah warna
      for(var i = 0;i < parentGroup.getLength(); i++){
        var children = parentGroup.getChildren()
        children[i].init()
      }
      gameObject.pop()
      //aturan lain yang diatus di scene
      gameObject.scene.updateOption()
      //update tampilan resultCard
      gameObject.scene.resultCardGroup.updateCard(gameObject.index, value)
    })
    this.init()
    scene.optGroup.add(this)
  }
  init() {
    this.bgButton.setFillStyle('0xffffff', 1)
    this.arabicImg.setTint('0x000000')
    this.button.enable = true
  }
  pop() {
    this.bgButton.setFillStyle(this.colorPop, 1)
    this.arabicImg.setTint('0xffffff')
    this.button.enable = false
  }
}

class IrSubmitButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y)
    if (gameInfo.type == 'development') console.log('IrSubmitButton created successfully')
    this.scene = scene
    this.visible = false
    var answerKeyArr = (scene.isPersiapan) ? gameJson.answer_persiapan : gameJson.answer_irab
    var submitImg = scene.add.image(0, 0, 'IrTexture', 'SubmitBtn.png')
    this.add(submitImg)
    this.button = scene.plugins.get('rexbuttonplugin').add(submitImg, {mode: 1,clickInterval: 200});
    this.button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      gameObject.scene.enabledOtherButton(false)
      gameObject.scene.resultCardGroup.response()
      if (isArraySame(gameObject.scene.answer, answerKeyArr)){
        gameObject.scene.sound.play('true')
        if (scene.isPersiapan) {
          if (gameJson.jenis == "lafzhi") {
            gameObject.scene.time.delayedCall(2000, goTo, [gameObject.scene, "IrLafzhiGame"], this)
          } //tambah jenis i'rob lain di sini
        } else {
          gameObject.scene.time.delayedCall(2000, gameObject.scene.showReward, [], this)
        }
      } else {
        gameObject.scene.sound.play('false')
        button.scene.time.delayedCall(2000, gameObject.scene.resetStage, [], this)
      }
    }, this)
    scene.add.existing(this)
  }
}