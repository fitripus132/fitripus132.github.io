
class WFGame extends Phaser.Scene {
    constructor() {
        super('WFGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('WFGame created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.wf = true
        this.add.image(0, 0, 'WFTexture', 'bg.png').setOrigin(0, 0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
        this.menuNResetButton = new MenuNResetButton(this)
        this.rewardBased = 'NumWrong'
        //level bar
        var levelBar = new LevelBar(this, 1200, 35)
        //word button group
        this.optBtnGroup = this.add.group()
        var numOptBtn = 20
        var offsetX = 219   //-----enggak apa2 ada 2 key berbeda dalam satu scene?
        var offsetY = 94
        var counter = {x:0, y:0}
        var arrPos = []
        for (var i = 0; i < numOptBtn; i++) {
            counter.x = i % 4
            if((i > 0) && (i % 4 == 0)) {
                counter.y++
            }
            var optBtn = new WFButton (this, 312 + (counter.x*offsetX), 159 + (counter.y*offsetY), i)
            this.optBtnGroup.add(optBtn)
            arrPos[i] = {x: optBtn.x, y: optBtn.y}
        }
        this.optBtnGroup.shuffle()
        var children = this.optBtnGroup.getChildren()
        for (var i = 0; i < numOptBtn; i++) {
            children[i].x = arrPos[i].x
            children[i].y = arrPos[i].y
        }
        var offsetX = 35.5
        var numSign = gameJson.num_true
        /*
        this.correctSignGroup = this.add.group()
        this.add.rexRoundRectangle(gameInfo.center.x, 638, 20 + (numSign*offsetX), 48, 10, '0xFFB642').setOrigin(0.5, 0.5)
        for (var i = 0; i < numSign; i++) {
            this.add.image(gameInfo.center.x + (i*offsetX) - (offsetX*(numSign-1)/2), 638, 'WFTexture', 'wf_sign_0001.png')
            var correctSign = this.add.image(gameInfo.center.x + (i*offsetX) - (offsetX*(numSign-1)/2), 638, 'WFTexture', 'wf_sign_0002.png')
            correctSign.visible = false
            this.correctSignGroup.add(correctSign)
        }
        */
        this.signGroup = this.add.group()
        this.add.rexRoundRectangle(gameInfo.center.x, 638, 20 + (numSign*offsetX), 48, 10, '0xFFB642').setOrigin(0.5, 0.5)
        for (var i = 0; i < numSign; i++) {
          var sign = this.add.image(gameInfo.center.x + (i*offsetX) - (offsetX*(numSign-1)/2), 638, 'WFTexture', 'wf_sign_0001.png')
          this.signGroup.add(sign)
        }

        this.dialogMenu = new DialogMenu(this)
        this.resetMenu = new ResetMenu(this)
        this.rewardMenu = new RewardMenu(this)
    }
    enabledOtherButton(_status){
        containerButtonSetEnabled(this.menuNResetButton, _status)
        groupButtonSetEnabled(this.optBtnGroup, _status)
    }
    check(obj) {
        if (obj.value < gameJson.num_true) {
            // console.log('benar')
            obj.onTrue()
            this.scene.sound.play('true')
            gameInfo.currentCorrect++
            this.scene.correctProgress()
            // console.log('benar! gameInfo.currentCorrect after: ' + gameInfo.currentCorrect)
            
        }
        else {
            // console.log('salah')
            obj.onFalse()
            this.scene.sound.play('false')
            gameInfo.currentWrong++
            // console.log('salah! gameInfo.currentWrong after: ' + gameInfo.currentWrong)//
            this.scene.time.delayedCall(750, obj.init, [], this)
        }
      }
    correctProgress() {
      this.signGroup.children.entries[gameInfo.currentCorrect-1].setTexture('WFTexture', 'wf_sign_0002.png')
        if (gameInfo.currentCorrect == gameJson.num_true) {
            this.scene.scene.rewardMenu.starWithNumWrong(1, 5, 9)
            this.scene.scene.rewardMenu.show()
        }
    }
}


class WFButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value) {
      super(scene, x, y)
      if(gameInfo.type == 'development') console.log('WFButton created successfully')
      var size = {w: 210, h: 83}
      this.setSize(size.w, size.h)
      this.lock = false
      this.value = value
      this.bgWord = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 10, '0xFFFF99')
      this.add(this.bgWord)
      this.word = scene.add.image(0, 0, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_opt_' + formatWithZero((gameInfo.currentQuest * 3)+value+1, 4) + '.png').setTint(0x000000)
      this.add(this.word)
      this.button = scene.plugins.get('rexbuttonplugin').add(this, {enable: true, mode: 1, clickInterval: 400})
      this.button.on('click', function (button, gameObject, pointer, event) {
        popButton(gameObject, {x:1.05 , y:1.1})
        // console.log(button.parent.value)
        gameObject.scene.time.delayedCall(300, gameObject.scene.check, [gameObject], gameObject)
      })
  
      
      scene.add.existing(this)
    }
    init() {
      
      this.bgWord.setFillStyle('0xFFFF99', 1)
      this.button.enable = true
      
    }
    onTrue() {
      this.lock = true
      this.bgWord.setFillStyle('0x99FF66', 1)
      this.button.enable = false
    }
    onFalse() {
      
      this.bgWord.setFillStyle('0xFFAD85', 1)
      
    }
  }