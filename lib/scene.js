//MenuGame
class MenuGame extends Phaser.Scene {
    constructor() {
        super('MenuGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('MenuGame created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        this.add.image(0, 0, 'MenuTexture', 'bg_menu.png').setOrigin(0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.add.bitmapText(90, 110, 'arial', infoJson.title, 30).setTint(0x000000)
        this.anims.create({
            key: 'AnimOwlMenu',
            frames: this.anims.generateFrameNames("OwlMenuAnim",
              {
                  prefix: 'OwlMenuAnim_',
                  start: 1,
                  end: 100,
                  suffix: '.png',
                  zeroPad: 4
              }),
            repeat: -1
          })
        this.add.sprite(260, gameInfo.size.h).setOrigin(0.5,1).play('AnimOwlMenu')
        var button = this.plugins.get('rexbuttonplugin').add(this.add.image(270, 305, 'MenuTexture', 'mulai_btn.png'), {enable: true, mode: 0, clickInterval: 400})
        button.on('click', function (button, gameObject, pointer, event) {
            popButton(gameObject)
            button.scene.time.delayedCall(300, goTo, [button.scene, 'BootGame'], this)
        })
    }
}