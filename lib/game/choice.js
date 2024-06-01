class ChoiceGame extends Phaser.Scene {
    constructor() {
        super('ChoiceGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('ChoiceGame created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        this.add.image(0, 0, 'texture', 'bg_choice.png').setOrigin(0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        var cc = new ChoiceCardGroup(this)
    }
}

class ChoiceCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, value) {
    super(scene, x, y)
    if(gameInfo.type == 'development') console.log('ChoiceCard created successfully')
    var choiceCardImg = scene.add.image(0, 0, 'texture',  'choice_card_' + formatWithZero(value+1, 4) + '.png')
    this.add(choiceCardImg)
    var text = scene.add.bitmapText(0, 122.5, 'arial', infoJson.game[value], 24, 1).setTint(0x000000).setOrigin(0.5, 0)
    this.add(text)
    if (isComplete[value]) {
      this.sign = scene.add.image(-70, -70, 'texture',  'check_sign_0002.png')  
    } else {
      this.sign = scene.add.image(-70, -70, 'texture',  'check_sign_0001.png')
    }
    this.add(this.sign)
    // var buttonImage = scene.add.image(0, 100, 'texture', 'mulai_sm_btn.png')
    // this.add(buttonImage)
    var button = scene.plugins.get('rexbuttonplugin').add(choiceCardImg,{enable: true, mode:0, clickInterval: 400})
    button.on('click', function (button, gameObject, pointer, event) {
      popButton(gameObject)
      gameInfo.game = value
      gameInfo.level = 0
      gameInfo.currentQuest = 0
      gameInfo.currentCorrect = 0,
      gameInfo.currentWrong = 0,
      gameInfo.score = 0 
      button.scene.time.delayedCall(300, goTo, [button.scene, 'RouteGame'], button.scene)
    })
    
    scene.add.existing(this)
  }
}
  
class ChoiceCardGroup {
  constructor(scene) {
    if(gameInfo.type == 'development') console.log('ChoiceCardGroup created successfully')
    var numCard = infoJson.game.length
    var offset = {x:220, y:320}
    var composition = [
      {n: [1,0], spawn: {x:gameInfo.center.x, y:gameInfo.center.y}},
      {n: [2,0], spawn: {x:gameInfo.center.x, y:gameInfo.center.y}},
      {n: [3,0], spawn: {x:gameInfo.center.x, y:gameInfo.center.y}},
      {n: [4,0], spawn: {x:gameInfo.center.x, y:gameInfo.center.y}},
      {n: [5,0], spawn: {x:gameInfo.center.x, y:gameInfo.center.y}},
      {n: [3,3], spawn: {x:gameInfo.center.x, y:gameInfo.center.y - (160)}},
      {n: [4,3], spawn: {x:gameInfo.center.x, y:gameInfo.center.y - (160)}},
      {n: [4,4], spawn: {x:gameInfo.center.x, y:gameInfo.center.y - (160)}},
      {n: [5,4], spawn: {x:gameInfo.center.x, y:gameInfo.center.y - (160)}},
      {n: [5,5], spawn: {x:gameInfo.center.x, y:gameInfo.center.y - (160)}},
    ]
    
    //jumlah maksimal baris text pada choice card barisan bawah
    var numCCBtm = (numCard < 6) ? numCard : composition[numCard-1].n[1]
    var maxRow = 0
    for(var i = 0; i < numCCBtm; i++) {
      var indexCC = (numCard < 6) ? i : (i+5)
      var numRow = infoJson.game[indexCC].split('\n').length
      if(numRow > maxRow) {
        maxRow = numRow
      }
    }
    
    var counter = {x:0, y:0,}
    var otherOffsetY
    if(maxRow == 1) {
      otherOffsetY = 25
    }else if(maxRow == 2) {
      otherOffsetY = 40
    }else if(maxRow == 3) {
      otherOffsetY = 55
    }

    for(var i = 0;i < numCard; i++){
      var choiceCard = new ChoiceCard(scene,
        composition[numCard-1].spawn.x - (offset.x * ((composition[numCard-1].n[counter.y] - 1) / 2)) + (offset.x * counter.x),
        composition[numCard-1].spawn.y + (offset.y * counter.y) - otherOffsetY,
        i)
      counter.x++
      if(counter.x == composition[numCard-1].n[counter.y]) {
        counter.x = 0
        counter.y++
      }
    }
  }
}