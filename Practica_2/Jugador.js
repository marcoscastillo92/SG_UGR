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

                    //Animación jugador
                    tiempo = new THREE.Clock()
                    var idleJugador = new TWEEN.Tween(obj).to(obj.position.y+1, 4000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .yoyo()
                    .repeat(Infinity)
                    .onUpdate(function(){
                    });
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
    }

    update(){
        
    }
}
