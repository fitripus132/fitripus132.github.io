class WPGame extends Phaser.Scene {
    constructor() {
        super('WPGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('WPGame created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.wp = true
        this.add.image(0, 0, 'WPTexture', 'bg.png').setOrigin(0, 0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
        this.menuNResetButton = new MenuNResetButton(this)
        this.rewardBased = 'Percent'
        //level bar
        var levelBar = new LevelBar(this, 1200, 35)
        //drop image
        this.numDrop = gameJson.num_drop //4, 6, 8, atau 10
        this.drop = new WPDrop(this)
        //drag image
        
        this.numDrag = gameJson.num_drag    //4, 6, 8, atau 10
        this.posTarget = null
        var offset = {x: 208, y: 97}
        var counter = {x: 0, y: 0}
        this.initPos = []
        for (var i = 0; i < this.numDrag; i++) {
            this.initPos[i] =
            {x: gameInfo.center.x + (counter.x*offset.x) - (offset.x*((this.numDrag/2)-1)/2),
              y: 524 + (counter.y*offset.y)}

            counter.x++
            if(counter.x == this.numDrag/2) {
                counter.x = 0
                counter.y++
            }
        }
        this.initPos = Phaser.Utils.Array.Shuffle(this.initPos)

        //drag
        this.dragContainer = this.add.container()
        for (var i = 0; i < this.numDrag; i++) {
            var drag = new WPDrag(this, this.initPos[i].x, this.initPos[i].y, i)
            this.dragContainer.add(drag)
        }

        //sign
        this.signGroup = this.add.group()
        for (var i = 0; i < this.numDrop; i++) {
            var sign = this.add.image(this.drop.posDrop[i].x + 94, this.drop.posDrop[i].y - 41, 'WPTexture', 'wp_sign_0002.png')
            
            sign.value = i
            sign.visible = false
            this.signGroup.add(sign)
        }

        //pop up
        this.dialogMenu = new DialogMenu(this)
        this.resetMenu = new ResetMenu(this)
        this.rewardMenu = new RewardMenu(this)
    }
    enabledOtherButton(_status){
        containerButtonSetEnabled(this.menuNResetButton, _status)
        groupDragSetEnabled(this.dragContainer, _status)
    }
    check(obj) {
        if(obj.value == this.posTarget.value) {
            // console.log('benar')
            if (obj.isCorrectFirst) {
                gameInfo.score++
            }
            obj.onTrue()
            this.sound.play('true')
            //correct sign appear
            this.signGroup.children.entries[this.posTarget.value].setTexture('WPTexture', 'wp_sign_0002.png')
            this.signGroup.children.entries[this.posTarget.value].visible = true
            gameInfo.currentCorrect++
            if (gameInfo.currentCorrect == this.numDrop) {
                this.time.delayedCall(750, this.next, [], this)
            }
        } else {
            // console.log('salah')
            obj.isCorrectFirst = false
            obj.onFalse()
            this.sound.play('false')
            this.signGroup.children.entries[this.posTarget.value].setTexture('WPTexture', 'wp_sign_0001.png')
            this.signGroup.children.entries[this.posTarget.value].visible = true
            this.time.delayedCall(750, this.signWrong, [], this)
        }
        // console.log('gameInfo.score = ' + gameInfo.score)
    }
    signWrong() {
        this.signGroup.children.entries[this.posTarget.value].visible = false
    }
    next() {
        this.rewardMenu.starWithPercent(gameInfo.score, this.numDrop, 50, 75)
        this.rewardMenu.show()
    }
}

class WPDrop extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0)
        if(gameInfo.type == 'development') console.log('WPDrop created successfully')
        this.dropGroup = scene.add.group()
        var offset = (this.scene.numDrop > 8) ? {x: 208, y: 156} : {x: 256, y: 156}
        var counter = {x: 0, y: 0}
        this.posDrop = []
        for(var i = 0; i < this.scene.numDrop; i ++) {
            //position drop
            this.posDrop[i] = {x: gameInfo.center.x + (counter.x*offset.x) - (offset.x*((this.scene.numDrop/2)-1)/2), y: 229 + (counter.y*offset.y)}
            this.posDrop[i].lock = false
            this.posDrop[i].value = i
            //arabic(drag quest) image
            this.add(scene.add.image(this.posDrop[i].x, this.posDrop[i].y - 81, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_drop_' + formatWithZero(i+1, 4) + '.png').setTint(0x000000))
            //drop image
            var drop = scene.add.image(this.posDrop[i].x, this.posDrop[i].y, 'WPTexture', 'drop.png')
            this.add(drop)
            this.dropGroup.add(drop)

            counter.x++
            if(counter.x == this.scene.numDrop/2) {
                counter.x = 0
                counter.y++
            }
        }
        scene.add.existing(this)
    }
}

class WPDrag extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value) {
        super(scene, x, y)
        if(gameInfo.type == 'development') console.log('WPDrag created successfully')
        this.value = value
        this.lock = false
        this.isCorrectFirst = true
        var size = {w: 188, h: 84}
        this.setSize(size.w, size.h)
        this.bgWord = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 10, '0xFFFFCC')
        this.add(this.bgWord)
        this.word = scene.add.image(0, 0, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_drag_' + formatWithZero(value+1, 4) + '.png').setTint(0x000000)
        this.add(this.word)
        this.drag = scene.plugins.get('rexdragplugin').add(this)
        this.on('dragstart', function(pointer, dragX, dragY) {
            this.parentContainer.bringToTop(this)
            this.scene.dragContainer.remove(this)
        })
        this.on('dragend', function(pointer, dragX, dragY, dropped) {
            this.scene.dragContainer.add(this)
            var isBack = true
            for (var i = 0; i < this.scene.numDrop; i++) {
                var dist = {
                    x: Phaser.Math.Distance.Between(this.x, 0, this.scene.drop.posDrop[i].x, 0),
                    y: Phaser.Math.Distance.Between(0, this.y, 0,this.scene.drop.posDrop[i].y)}
                if(dist.x <= 65 && dist.y <= 60) {  //tidak perlu dibuat grup drop?
                    // console.log('masuk')
                    // console.log(this.scene.drop.posDrop[i].value)
                    // this.scene.dropTarget = this.scene.drop.dropGroup.children.entries[i]   //-----------perlu?
                    this.scene.posTarget = this.scene.drop.posDrop[i]
                    if (this.scene.posTarget.lock) {
                        this.resetPos()
                        // console.log('balik')
                      }else {
                        this.scene.check(this)
                        isBack = false
                        // console.log('lanjut')
                      }
                    break;
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