class WL2Game extends Phaser.Scene {
    constructor() {
        super('WL2Game')
    }
    create() {
        if(gameInfo.type == 'development') console.log('WL2Game created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.wl2 = true
        this.add.image(0, 0, 'WLTexture', 'bg2.png').setOrigin(0,0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
        this.menuNResetButton = new MenuNResetButton(this)
        this.rewardBased = 'NumWrong'
        var leverBar = new LevelBar(this, 1200, 35)
        //quest progress
        this.add.rexRoundRectangle(51, 238, 60, 60, 20, '0xFFFFCC', 1).setStrokeStyle(1, '0x999999', 1)
        this.add.bitmapText(51, 242, 'arial', gameInfo.currentQuest+1 + '/' + gameJson.answers.length, 20).setTint('0x000000').setOrigin(0.5) //-----revisi
        //quest
        this.add.image(gameInfo.center.x, 225, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest_' + formatWithZero(gameInfo.currentQuest+1,4) + '.png')
        //drop image
        this.dropX = 633
        this.dropY = 434
        this.add.image(this.dropX-132, this.dropY, 'WLTexture', 'questSymbol.png')
        this.add.image(this.dropX, this.dropY, 'WLTexture', 'drop.png')
        //drag image
        this.dragContainer = this.add.container()
        this.numDrag = gameJson.num_drag
        var offsetX = 256
        this.initPos = []
        for (var i = 0; i < this.numDrag; i++) {
            this.initPos[i] = {x: gameInfo.center.x + (i*offsetX) - (offsetX*(this.numDrag-1)/2), y: 608}
        }
        this.initPos = Phaser.Utils.Array.Shuffle(this.initPos)
        for (var i = 0; i < this.numDrag; i++) {
            var drag = new WL2Drag(this, this.initPos[i].x, this.initPos[i].y, i)
            this.dragContainer.add(drag)
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
        if(obj.value+1 == gameJson.answers[gameInfo.currentQuest]) {
            obj.onTrue()
            this.sound.play('true')
            this.time.delayedCall(750, this.next, [], this)

        } else {
            gameInfo.currentWrong++
            obj.onFalse()
            this.sound.play('false')
        }
        // console.log(gameInfo.currentWrong)
    }
    next() {
        gameInfo.currentQuest++
        if (gameInfo.currentQuest < gameJson.answers.length) {
            this.scene.start('RouteGame')
            
        } else {
            this.time.delayedCall(750, this.showReward, [], this)
        }
    }
    showReward() {
        // console.log('showReward')
        // console.log(gameInfo.currentQuest)
        // console.log(gameInfo.currentWrong)
        this.rewardMenu.starWithNumWrong(1, 5, 9)
        this.rewardMenu.show()
    }
}

class WL2Drag extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value) {
        super(scene, x, y)
        if(gameInfo.type == 'development') console.log('WL2Drag created successfully')
        this.value = value
        this.lock = false
    //     this.isCorrectFirst = true
        var size = {w: 210, h: 83}
        this.setSize(size.w, size.h)
        this.bgWord = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 10, '0xFFFF99')
        this.add(this.bgWord)
        this.word = scene.add.image(0, 0, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_drag_' + formatWithZero(value+1, 4) + '.png').setTint(0x000000)
        this.add(this.word)
        this.drag = scene.plugins.get('rexdragplugin').add(this)
        this.on('dragstart', function(pointer, dragX, dragY) {
            this.parentContainer.bringToTop(this)
        })
        this.on('dragend', function(pointer, dragX, dragY, dropped) {
            var dist = {
                x: Phaser.Math.Distance.Between(this.x, 0, this.scene.dropX, 0),
                y: Phaser.Math.Distance.Between(0, this.y, 0,this.scene.dropY)}
            // console.log(dist.x)
            // console.log(dist.y)
            if(dist.x <= 190 && dist.y <= 77) {
                this.scene.check(this)
            } else {
                this.resetPos()
            }
        })
        scene.add.existing(this)
    }
    resetPos() {
        this.x = this.scene.initPos[this.value].x
        this.y = this.scene.initPos[this.value].y
    }
    posInTarget() {
        this.x = this.scene.dropX
        this.y = this.scene.dropY
    }
    init() {
        this.resetPos()
        this.bgWord.setFillStyle('0xFFFF99', 1)
    }
    onTrue() {
        this.lock = true
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