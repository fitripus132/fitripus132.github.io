class WL1Game extends Phaser.Scene {
    constructor() {
        super('WL1Game')
    }
    create() {
        if(gameInfo.type == 'development') console.log('WL1Game created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.wl1 = true
        this.add.image(0, 0, 'WLTexture', 'bg1.png').setOrigin(0,0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
        this.menuNResetButton = new MenuNResetButton(this)
        this.rewardBased = 'NumWrong'
        // var bird = new WLBird(this)
        var leverBar = new LevelBar(this, 1200, 35)
        //quest progress
        this.add.rexRoundRectangle(51, 238, 60, 60, 20, '0xFFFFCC', 1).setStrokeStyle(1, '0x999999', 1)
        this.add.bitmapText(51, 242, 'arial', (gameInfo.currentQuest+1) + '/' + gameJson.answers.length, 20).setTint('0x000000').setOrigin(0.5)
        //quest image
        this.add.image(463, 282, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest1_' + formatWithZero(gameInfo.currentQuest+1, 4) + '.png')
        this.add.image(753, 282, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest2_' + formatWithZero(gameInfo.currentQuest+1, 4) + '.png').setTint(0x000000)
        this.numDrop = gameJson.answers[gameInfo.currentQuest].length // 1, 2, 3 ------------set biar bisa 1!!!
        this.numDrag = gameJson.num_drag //4, 6, 8
        this.posTarget = null
        //drop image
        this.drop = new WL1Drop(this)
        //drag image
        this.dragContainer = this.add.container()
        var offset = {x:221, y:96}
        var counter = {x: 0, y: 0}
        this.initPos = []
        for (var i = 0; i < this.numDrag; i++) {
            this.initPos[i] =
            {x: gameInfo.center.x + (counter.x*offset.x) - (offset.x*((this.numDrag/2)-1)/2),
              y: 523 + (counter.y*offset.y)}

            counter.x++
            if(i == (this.numDrag/2)-1) {
                counter.x = 0
                counter.y++
            }
        }
        this.initPos = Phaser.Utils.Array.Shuffle(this.initPos)
        for (var i = 0; i < this.numDrag; i++) {
            var drag = new WL1Drag(this, this.initPos[i].x, this.initPos[i].y, i)
            this.dragContainer.add(drag)

            counter.x++
            if(i == (this.numDrag/2)-1) {
                counter.x = 0
                counter.y++
            }
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
        var isCorrect = false
        for (var i = 0; i < this.numDrop; i++) {
            if (obj.value+1 == gameJson.answers[gameInfo.currentQuest][i]) {
                isCorrect = true
                break;
            }
        }
        if (isCorrect) {
            obj.onTrue()
            this.sound.play('true')
            gameInfo.currentCorrect++
            if (gameInfo.currentCorrect == this.numDrop) {
                this.time.delayedCall(750, this.next, [], this)
            }
        } else {
            gameInfo.currentWrong++
            obj.onFalse()
            this.sound.play('false')
        }
        // console.log('gameInfo.currentWrong = ' + gameInfo.currentWrong)
    }
    next() {
        gameInfo.currentCorrect = 0
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

class WL1Drop extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0)
        if(gameInfo.type == 'development') console.log('WL1Drop created successfully')
        var offsetY = 93
        this.add(scene.add.rexRoundRectangle(1015, 281, 241, 25 + (this.scene.numDrop*offsetY), 10, '0x3399CC'))  //0xFFCC66 //0xFF9900
        this.dropGroup = scene.add.group()
        this.posDrop = []
        for (var i = 0; i < this.scene.numDrop; i++) {
            this.posDrop[i] = {x: 1015, y: 281 + (i*offsetY) - (offsetY*(this.scene.numDrop-1)/2)}
            this.posDrop[i].lock = false

            var drop = scene.add.image(this.posDrop[i].x, this.posDrop[i].y, 'WLTexture', 'drop.png')
            this.add(drop)
            this.dropGroup.add(drop)
        }
        scene.add.existing(this)
    }
}

class WL1Drag extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value) {
        super(scene, x, y)
        if(gameInfo.type == 'development') console.log('WL1Drag created successfully')
        this.value = value
        // this.isCorrectFirst = true
        var size = {w: 211, h: 84}
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
            var isBack = true
            for (var i = 0; i < this.scene.numDrop; i++) {
                var dist = {
                    x: Phaser.Math.Distance.Between(this.x, 0, this.scene.drop.posDrop[i].x, 0),
                    y: Phaser.Math.Distance.Between(0, this.y, 0,this.scene.drop.posDrop[i].y)}
                if(dist.x <= 65 && dist.y <= 35) {
                    this.scene.posTarget = this.scene.drop.posDrop[i]
                    if (this.scene.posTarget.lock) {
                        this.resetPos()
                      }else {
                        this.scene.check(this)
                        isBack = false
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
        this.bgWord.setFillStyle('0xFFFF99', 1)
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