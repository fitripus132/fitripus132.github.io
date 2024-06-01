class WAGame extends Phaser.Scene {
    constructor() {
        super('WAGame')
    }
    create() {
        if(gameInfo.type == 'development') console.log('WAGame created successfully')
        this.cameras.main.fadeIn(250, 0, 0, 0)
        isLoaded.wa = true
        this.add.image(0, 0, 'WATexture', 'bg.png').setOrigin(0,0)
        this.add.rectangle(0, 0, gameInfo.size.w, gameInfo.size.h).setStrokeStyle(1, 0x000000).setOrigin(0)
        this.add.image(gameInfo.center.x, 38.7, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_instruction.png')
        this.rewardBased = 'Percent'
        gameInfo.numQuest = gameJson.answers.length
        this.isCorrectFirst = true
        //group: menu button & reset button
        this.menuNResetButton = new MenuNResetButton(this)
        //level bar
        var levelBar = new LevelBar(this, 1200, 35)
        //quest image
        this.add.image(gameInfo.center.x, 202, 'gamePack', 'g' + (gameInfo.game+1) + 'lv' + (gameInfo.level+1) + '_quest.png')
        //option
        this.optGroup = this.add.group()
        this.childrenOpt = this.optGroup.getChildren()
        //---CONTOH Jawaban JSON    --set & answer dimulai dari 1, bukan 0
        // QA3-2-3v1 sampai QA3-2-3v5
        // ALHAMDU lillah
        // "set" : [1, 2, 3, 7, 8],
        // "answers" : [1, 1, 1, 1, 3]
        //------
        // QA3-2-3v1 sampai QA3-2-3v5
        // ALHAMDU lillah
        // "set" : [1, 5, 6, 15, 22, 23],
        // "answers" : [2, 1, 2, 2, 1, 4]
        //------lanjutkan contoh

        // alhamdu : [1, 1, 1, 1, 2, 3, 1, 3, 3, 1, 5]


        //--------------------------------UPDATE--------------------------------UPDATE JSON
        //string prefix & title option
        var string = new WAString(this)
        
        //------------------WAOption(scene, index, numButton)
        this.jenisKata = new WAOption(this, 0, 3)
        this.jenisIsim = new WAOption(this, 1, 2)
        this.jumlahBilangan = new WAOption(this, 2, 3)
        this.keadaanHurufAkhir = new WAOption(this, 3, 4)
        this.jenisFiil = new WAOption(this, 4, 3)
        this.harakatAkhir = new WAOption(this, 5, 2)
        this.caraIrob = new WAOption(this, 6, 3)
        this.tandaIrob = new WAOption(this, 7, 6)
        this.keberadaanAsalnya = new WAOption(this, 8, 2)
        this.jenisIsimMusytaq = new WAOption(this, 9, 5)
        this.jenisIsimFail = new WAOption(this, 10, 3)
        this.fiilDariJumlahHuruf = new WAOption(this, 11, 2)
        this.jenisIsimMabni = new WAOption(this, 12, 10)
        this.tandaBinaIsim = new WAOption(this, 13, 4)
        this.tandaBinaFiil = new WAOption(this, 14, 3)
        this.tandaBinaFiilAmr = new WAOption(this, 15, 2)
        this.tertentuAtauTidak = new WAOption(this, 16, 2)
        this.jenisIsimMarifah = new WAOption(this, 17, 7)
        this.tandaBacaU = new WAOption(this, 18, 2)
        this.tandaBacaA = new WAOption(this, 19, 2)
        this.tandaBacaM = new WAOption(this, 20, 2)
        this.failSubyek = new WAOption(this, 21, 5)
        this.dhomir = new WAOption(this, 22, 14)
        this.jumlahHuruf = new WAOption(this, 23, 2)
        this.hurufTambahan = new WAOption(this, 24, 2)
        this.keberadaanObjek = new WAOption(this, 25, 2)
        
        //WAOptionGroup
        this.WAOptionGroup = this.add.group()
        this.WAOptionGroup = [this.jenisKata, this.jenisIsim, this.jumlahBilangan, this.keadaanHurufAkhir, this.jenisFiil, this.harakatAkhir, this.caraIrob, this.tandaIrob, this.keberadaanAsalnya, this.jenisIsimMusytaq, this.jenisIsimFail, this.fiilDariJumlahHuruf, this.jenisIsimMabni, this.tandaBinaIsim, this.tandaBinaFiil, this.tandaBinaFiilAmr, this.tertentuAtauTidak, this.jenisIsimMarifah, this.tandaBacaU, this.tandaBacaA, this.tandaBacaM, this.failSubyek, this.dhomir, this.jumlahHuruf, this.hurufTambahan, this.keberadaanObjek]

        //quest progress
        this.progressBar = new WAProgressBar(this)
        
        //pop
        this.dialogMenu = new DialogMenu(this)
        this.resetMenu = new ResetMenu(this)
        this.rewardMenu = new RewardMenu(this)
    }
    enabledOtherButton(_status){
        containerButtonSetEnabled(this.menuNResetButton, _status)
        groupButtonSetEnabled(this.optGroup, _status)
    }
    check(obj) {
        // console.log(obj)
        // console.log(this.optGroup)
        if (obj.value+1 == gameJson.answers[gameInfo.currentQuest]) {
            //console.log('benar')
            if (this.isCorrectFirst) {
                gameInfo.score++
            }
            obj.onTrue()
            this.sound.play('true')
            //next
            gameInfo.currentQuest++  
            if(gameInfo.currentQuest < gameInfo.numQuest) this.time.delayedCall(750, fadeOut, [this, obj.parentContainer, 500], this)
            this.time.delayedCall(1500, this.next, [obj], this)
        } else {
            //console.log('salah')
            this.isCorrectFirst = false
            obj.onFalse()
            this.sound.play('false')
        }
    }

    next(obj) {
        //console.log('next')
        //console.log('score = ' + gameInfo.score)
        this.isCorrectFirst = true
        var idxNextOpt = gameJson.set[gameInfo.currentQuest]-1
        if (gameInfo.currentQuest < gameInfo.numQuest) {
            this.scene.scene.progressBar.updateStatus()
            fadeIn(this.scene.scene, this.scene.scene.WAOptionGroup[idxNextOpt], 500)
        } else {
            this.scene.scene.rewardMenu.starWithPercent(gameInfo.score, gameInfo.numQuest, 50, 75)
            this.scene.scene.rewardMenu.show()
        }
    }
}

class WAString {
    constructor(scene) {
        scene.prefix = [
                                    //index = nomor option - 1 (dimulai dari 0)
            'JenisKata',            //index = 1 - 1
            'JenisIsim',            //index = 2 - 1
            'JumlahBilangan',       //index = 3 - 1
            'KeadaanHurufAkhir',    //index = 4 - 1
            'JenisFiil',            //index = 5 - 1
            'HarakatAkhir',         //index = 6 - 1
            'CaraIrob',             //index = 7 - 1
            'TandaIrob',            //index = 8 - 1
            'KeberadaanAsalnya',    //index = 9 - 1
            'JenisIsimMusytaq',     //index = 10 - 1
            'JenisIsimFail',        //index = 11 - 1
            'FiilDariJumlahHuruf',  //index = 12 - 1
            'JenisIsimMabni',       //index = 13 - 1
            'TandaBinaIsim',        //index = 14 - 1
            'TandaBinaFiil',        //index = 15 - 1
            'TandaBinaFiilAmr',     //index = 16 - 1
            'TertentuAtauTidak',    //index = 17 - 1
            'JenisIsimMarifah',     //index = 18 - 1
            'TandaBacaU',           //index = 19 - 1
            'TandaBacaA',           //index = 20 - 1
            'TandaBacaM',           //index = 21 - 1
            'FailSubyek',           //index = 22 - 1
            'Dhomir',               //index = 23 - 1
            'JumlahHuruf',          //index = 24 - 1
            'HurufTambahan',        //index = 25 - 1
            'KeberadaanObjek'       //index = 26 - 1
            ]
        scene.titleOpt = [
            'Jenis Kata:',              //index = 1 - 1
            'Jenis Isim:',              //index = 2 - 1
            'Jumlah Bilangan:',         //index = 3 - 1
            'Keadaan Huruf Akhir:',     //index = 4 - 1
            "Jenis Fi'il:",              //index = 5 - 1
            'Berubah/Tetap Harakat Akhir:', //index = 6 - 1
            "Cara I'rob:",              //index = 7 - 1
            "Tanda I'rob:",             //index = 8 - 1
            'Ada/Tidak Ada Asalnya:',   //index = 9 - 1
            'Jenis Isim Musytaq:',      //index = 10 - 1
            "Jenis Isim Fa'il:",        //index = 11 - 1
            "Fi'il dari Jumlah Huruf:", //index = 12 - 1
            'Jenis Isim Mabni:',        //index = 13 - 1
            'Tanda Bina:',              //index = 14 - 1
            'Tanda Bina:',              //index = 15 - 1
            'Tanda Bina:',              //index = 16 - 1
            'Tertentu/Tidak Tertentu:', //index = 17 - 1
            "Jenis Isim Ma'rifah:",     //index = 18 - 1
            'Tanda Baca:',              //index = 19 - 1
            'Tanda Baca:',              //index = 20 - 1
            'Tanda Baca:',              //index = 21 - 1
            "Fa'il (Subyek):",          //index = 22 - 1
            'Dhomir:',                  //index = 23 - 1
            'Jumlah Huruf:',            //index = 24 - 1
            'Huruf Tambahan:',          //index = 25 - 1
            'Ada/Tidak Adanya Objek:'   //index = 26 - 1
            ]
    }
}

class WAProgressBar extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0)
        if(gameInfo.type == 'development') console.log('WAProgressBar created successfully')
        var offsetX = 69
        this.numSignGroup = scene.add.group()
        for (var i = 0; i < gameInfo.numQuest; i++) {
            if (i < gameInfo.numQuest-1) {
                scene.add.image(6 + gameInfo.center.x + (i*offsetX) - (offsetX * ((gameJson.answers.length-1)/2)), 610, 'WATexture', 'line.png').setOrigin(0,0)
            }
            var numSign = scene.add.image(gameInfo.center.x + (i*offsetX) - (offsetX * ((gameJson.answers.length-1)/2)), 613, 'WATexture', 'num_symbol_'+ formatWithZero(i+1,4) + '.png')
            this.add(numSign)
            this.numSignGroup.add(numSign)
        }
        this.children = this.numSignGroup.getChildren()
        scene.add.existing(this)
        this.updateStatus()
    }
    updateStatus() {
        this.children[gameInfo.currentQuest].setTexture('WATexture', 'num_symbol_'+ formatWithZero(gameInfo.currentQuest+16,4) + '.png')
    }
    
}

class WAOption extends Phaser.GameObjects.Container {
    constructor(scene, index, numBtn) {
        super(scene, 0, 0)
        this.index = index
        this.numBtn = numBtn
        if(gameInfo.type == 'development') console.log(scene.prefix[index] + ' created successfully')
        this.alpha = (index == 0) ? 1 : 0
        //title
        this.add(scene.add.bitmapText(gameInfo.center.x, 289, "arial", scene.titleOpt[index], 20).setTint(0x000000).setOrigin(0.5,0.5))
        //option button
        var offset = {x:223, y:108}
        this.buttonGroup = scene.add.group()
        var counter = {x:0, y:0,}
        var composition = [
            {n: [1,0], spawn: {x:gameInfo.center.x, y:428}},
            {n: [2,0], spawn: {x:gameInfo.center.x, y:428}},
            {n: [3,0], spawn: {x:gameInfo.center.x, y:428}},
            {n: [4,0], spawn: {x:gameInfo.center.x, y:428}},
            {n: [3,2], spawn: {x:gameInfo.center.x, y:374}},
            {n: [3,3], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,3], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4], spawn: {x:gameInfo.center.x, y:374}},

            {n: [4,4,1], spawn: {x:gameInfo.center.x, y:374}},  //edit?
            {n: [4,4,2], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,3], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,1], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,2], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,3], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,1], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,2], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,3], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4,1], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4,2], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4,3], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4,4], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4,4,1], spawn: {x:gameInfo.center.x, y:374}},
            {n: [4,4,4,4,4,4,2], spawn: {x:gameInfo.center.x, y:374}}
        ]
        for(var i = 0;i < numBtn; i++){
            var btn = new WAButton(scene,
                composition[numBtn-1].spawn.x - (offset.x * counter.x) + (offset.x * ((composition[numBtn-1].n[counter.y]-1)/2)),
                composition[numBtn-1].spawn.y + (offset.y * counter.y),
                i, this.index, scene.prefix[this.index], this.buttonGroup)
            this.add(btn)
            this.buttonGroup.add(btn)
            counter.x++
            if(counter.x == composition[numBtn-1].n[counter.y]) {
                counter.x = 0
                counter.y++
            }
        }
        scene.add.existing(this)
    }
}

//button
class WAButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value, index, prefix, parentBtn) {
        super(scene, x, y)
        if(gameInfo.type == 'development') console.log('WAButton created successfully')
        this.scene = scene
        this.value = value
        this.index = index
        this.prefix = prefix
        var width = 203
        var height = 94
        this.setSize(width, height)
        this.optBg = scene.add.rexRoundRectangle(0, 0, width, height, 20, '0xffffff').setStrokeStyle(2, '0xFF9900', 1)
        this.add(this.optBg)
        this.arabicImg = scene.add.image(0, 0, 'WATexture', prefix + '_' + formatWithZero(value+1,4) + '.png')
        this.add(this.arabicImg)
        //extra symbol
        if(prefix == 'TandaBinaFiilAmr' && value == 1) this.add(scene.add.image(-15, 0, 'WATexture' ,'extra_symbol_0001.png'));
        else if(prefix == 'TandaBacaU' && value == 1) this.add(scene.add.image(15, 0, 'WATexture' ,'extra_symbol_0002.png'));
        else if(prefix == 'TandaBacaA' && value == 1) this.add(scene.add.image(15, 0, 'WATexture' ,'extra_symbol_0001.png'));
        else if(prefix == 'TandaBacaM' && value == 1) this.add(scene.add.image(15, 0, 'WATexture' ,'extra_symbol_0001.png'));
        //sign
        this.sign = scene.add.image(99, -41, 'WATexture', 'wa_sign_0001.png')
        this.add(this.sign)
        //setting button
        this.button = scene.plugins.get('rexbuttonplugin').add(this,{enable: true, mode:0, clickInterval: 400})
        this.button.on('click', function (button, gameObject, pointer, event) {
            popButton(gameObject,{x:1.05,y:1.1})
            //gameObject yang ditekan saja yang berubah warna
            for (var i = 0;i < parentBtn.getLength(); i++) {
                var children = parentBtn.getChildren()
                children[i].init()
            }
            gameObject.pop()
            gameObject.scene.check(gameObject)
        })
        this.init()
        scene.optGroup.add(this)
    }
    init() {
        this.optBg.setFillStyle('0xffffff', 1)
        this.arabicImg.setTint('0x000000')
        this.sign.visible = false
    }
    pop() {
        this.optBg.setFillStyle('0xFF9900', 1)
        this.arabicImg.setTint('0xffffff')
    }
    onTrue() {
        this.sign.visible = true
        this.sign.setTexture('WATexture', 'wa_sign_0002.png')
    }
    onFalse() {
        this.sign.visible = true
        this.scene.time.delayedCall(750, this.init, [], this)
    }
}

