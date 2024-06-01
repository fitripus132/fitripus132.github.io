class TFGame extends Phaser.Scene {
    constructor() {
        super('TFGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('TFGame created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.tf = true
        this.add.image(0, 0, 'TFTexture', 'bg.png').setOrigin(0,0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.rewardBased = 'Percent'
        gameInfo.numQuest = gameJson.answers.length
        this.isCorrectFirst = true
        this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
        //quest progress
        this.add.bitmapText(160, 143, 'arial', gameInfo.currentQuest+1 + '/' + gameInfo.numQuest, 20).setTint('0x000000').setOrigin(0.5)
        //quest image (arabic)
        this.add.image(566, 281, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest_' + formatWithZero(gameInfo.currentQuest+1, 4) + '.png'). setTint(0x000000)
        //menu button & reset button
        this.menuNResetButton = new MenuNResetButton(this)
        //level bar
        var levelBar = new LevelBar(this, 1200, 35)
        //bird progress animation
        var bird = new TFBird(this, 1110, 479)
        //true false button
        var offsetX = 381
        this.TFButtonGroup = this.add.group()
        for (var i = 0; i < 2; i++) {
            var trueFalseButton = new TFButton(this, 757 - (i*offsetX), 507, i)   //(this, 376, 507, 0)
            this.TFButtonGroup.add(trueFalseButton)
        }
        //pop up
        this.dialogMenu = new DialogMenu(this)
        this.resetMenu = new ResetMenu(this)
        this.rewardMenu = new RewardMenu(this)
    }
    enabledOtherButton(_status){
        containerButtonSetEnabled(this.menuNResetButton, _status)
        groupButtonSetEnabled(this.TFButtonGroup, _status)
    }
    check(obj) {
        if (obj.value == gameJson.answers[gameInfo.currentQuest]) {
            if (this.scene.isCorrectFirst) {
                gameInfo.score++
            }
            obj.onTrue()
            this.scene.sound.play('true')
            this.scene.time.delayedCall(750, this.scene.next, [], this)
        } else {
            this.scene.isCorrectFirst = false
            obj.onFalse()
            this.scene.sound.play('false')
            this.scene.time.delayedCall(750, obj.init, [], this)
        }
        // console.log('gameInfo.currentQuest = ' + gameInfo.currentQuest)
        // console.log('gameInfo.score = ' + gameInfo.score)
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
}

class TFButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value) {
        super(scene, x, y)
        if(gameInfo.type == 'development') console.log('TFButton created successfully')
        var size = {w: 344, h: 188}
        this.setSize(size.w, size.h)
        this.value = value
        this.bgText = scene.add.rexRoundRectangle(0, 0, size.w, size.h, 20, '0xFFFF99')
        this.bgText.setStrokeStyle(1, 0xFF9900, 1)
        this.add(this.bgText)
        //text based value
        var text_1 = (value == 0) ? 'S' : 'B'
        this.text1 = scene.add.bitmapText(0, -5, 'arial', text_1, 55).setTint(0x000000).setOrigin(0.5, 0.5)
        this.add(this.text1)
        var text_2 = (value == 0) ? 'Salah' : 'Benar'
        this.text2 = scene.add.bitmapText(0, 35, 'arial', text_2, 22).setTint(0x000000).setOrigin(0.5, 0.5)
        this.add(this.text2)
        //sign
        this.sign = scene.add.image(142, -66, 'TFTexture', 'tf_sign_0001.png').setVisible(false)
        this.add(this.sign)

        this.button = scene.plugins.get('rexbuttonplugin').add(this, {enable: true, mode: 1, clickInterval: 400})
        this.button.on('click', function (button, gameObject, pointer, event) {
            popButton(gameObject, {x:1.05 , y:1.1})
            gameObject.scene.time.delayedCall(300, gameObject.scene.check, [gameObject], gameObject)
        })

        scene.add.existing(this)
    }
    init() {
        this.bgText.setFillStyle('0xFFFF99', 1)
        this.bgText.setStrokeStyle(1, '0xFF9900', 1)    
        this.sign.visible = false
    }
    onTrue() {
        this.bgText.setFillStyle('0xB6FFDA', 1)
        this.bgText.setStrokeStyle(1, '0x69E269', 1)
        this.sign.visible = true
        this.sign.setTexture('TFTexture', 'tf_sign_0002.png')
    }
    onFalse() {
        this.bgText.setFillStyle('0xFFB8B8', 1)
        this.bgText.setStrokeStyle(1, '0xFF9900', 1)    //sama dengan init---???
        this.sign.visible = true

    }
}

class TFBird extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y)
        if (gameInfo.type == 'development') console.log('TFBird created successfully')
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
            key: 'eat',
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
            this.bird.play('eat')
        }
        scene.add.existing(this)
    }
}