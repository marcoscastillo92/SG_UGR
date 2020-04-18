class Objeto extends THREE.Object3D{
    constructor(){
        super();
        
        this.curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3( -10, 0, 0 ),
            new THREE.Vector3( -7, 4, 4 ),
            new THREE.Vector3( 0, 2, 0 ),
            new THREE.Vector3( 7, 0, -4 ),
            new THREE.Vector3( 10, 0, 0 ),
            new THREE.Vector3( 7, 4, 4 ),
            new THREE.Vector3( 0, 1, 0 ),
            new THREE.Vector3( -7, -1, -4 ),
            new THREE.Vector3( -10, 0, 0 )
        ])
    
        this.trayectoInicial = new THREE.CatmullRomCurve3([
        new THREE.Vector3( -10, 0, 0 ),
        new THREE.Vector3( -7, 4, 4 ),
        new THREE.Vector3( 0, 2, 0 ),
        new THREE.Vector3( 7, 0, -4 ),
        new THREE.Vector3( 10, 0, 0 ),
        ])
    
        this.trayectoFinal = new THREE.CatmullRomCurve3([
        new THREE.Vector3( 10, 0, 0 ),
        new THREE.Vector3( 7, 4, 4 ),
        new THREE.Vector3( 0, 1, 0 ),
        new THREE.Vector3( -7, -1, -4 ),
        new THREE.Vector3( -10, 0, 0 ),
        ])
        
    
        var points = this.curve.getPoints( 100 );
        var geometry = new THREE.BufferGeometry().setFromPoints( points );
    
        var material = new THREE.LineBasicMaterial( { color : 0xAA0000 } );
    
        // Create the final object to add to the scene
        var curveObject = new THREE.Line( geometry, material );
        this.add (curveObject)
    
        this.object = this.createObject()
        this.add(this.object)
    
        this.tiempo = new THREE.Clock()
    
        var that = this
        this.aux = this.trayectoInicial.getPointAt(0)
        var animacionInicial = new TWEEN.Tween(this.trayectoInicial.getPointAt(0)).to(this.trayectoInicial.getPointAt(1), 4000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .onStart(function(){
            that.tiempo.start()
        })
        .onUpdate(function(){
            var time = that.tiempo.getElapsedTime()
            var looptime = 4000
            var t = (time % looptime) / 4
    
            if( t <= 1 ){
                var posicion = that.trayectoInicial.getPointAt(t)
                that.object.position.copy(posicion)
                var tangente = that.trayectoInicial.getTangentAt(t)
                posicion.add(tangente)
                that.object.lookAt(posicion)
                console.log(that.trayectoInicial.getPointAt(t))
            }
        })
    
        var animacionFinal = new TWEEN.Tween(this.trayectoFinal.getPointAt(0)).to(this.trayectoFinal.getPointAt(1), 8000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onStart(function(){
            that.tiempo.start()
            })
        .onUpdate(function(){
            var time = that.tiempo.getElapsedTime()
            var looptime = 8000
            var t = (time % looptime) / 8
    
            if( t <= 1 ){
            var posicion = that.trayectoFinal.getPointAt(t)
            that.object.position.copy(posicion)
            var tangente = that.trayectoFinal.getTangentAt(t)
            posicion.add(tangente)
            that.object.lookAt(posicion)
            console.log(that.trayectoFinal.getPointAt(t))
            }
        })
        
        animacionInicial.chain(animacionFinal)
        animacionFinal.chain(animacionInicial)
        animacionInicial.start()
    }

    createObject(){
        var geometry = new THREE.ConeGeometry(0.5,2,3)
        geometry.rotateX(Math.PI/2)
        var texture = new THREE.TextureLoader().load('./imgs/textura-ajedrezada.jpg')
        var material = new THREE.MeshBasicMaterial({map: texture})
        var mesh = new THREE.Mesh(geometry, material)
        return mesh
    }

    update(){
        TWEEN.update();
    }
}
