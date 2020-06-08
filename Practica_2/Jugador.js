class Jugador extends THREE.Object3D{
    constructor(scene){
        super();

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/aguacate/aguacate.mtl", function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/aguacate/aguacate.obj", 
                function ( obj ) {
                    // Add the loaded object to the scene
                    obj.name = "jugador";
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.position.set(5,-0.5,5);
                    obj.rotation.y = 2*Math.PI/1.6;
                    scene.add( obj );

                    /* //Animación jugador
                    this.pathIdleJugador = new THREE.CatmullRomCurve3([
                        new THREE.Vector3( 0, this.position.y, 0 ),
                        new THREE.Vector3( 0, this.position.y+1, 0 )
                    ]);
                    this.tiempo = new THREE.Clock();
                    var that = this;
                    this.animacionJugador = new TWEEN.Tween(this.pathIdleJugador.getPointAt(0)).to(this.pathIdleJugador.getPointAt(1), 4000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .repeat(Infinity)
                    .onStart(function(){
                        that.tiempo.start();
                    })
                    .onUpdate(function(){
                        var time = that.tiempo.getElapsedTime();
                        var looptime = 4000;
                        var t = (time % looptime) / 4;
                        if( t <= 1 ){
                            var posicion = that.pathIdleJugador.getPointAt(t);
                            that.position.copy(posicion);
                        }else{
                            that.position.copy(that.pathIdleJugador.getPointAt(0));
                            that.tiempo.start();
                        }
                    }); */
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del jugador' );
                },

                // onError callback
                function ( err ) {
                    console.error( 'Error cargando el modelo del jugador: ' + err );
                }
            );
        });
        return this;
    }

    update(){
        if(this.getObjectByName("jugador")){
            console.log("EMPIEZA")
        }
    }
}
