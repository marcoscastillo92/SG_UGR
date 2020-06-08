class Enemigo extends THREE.Object3D{
    constructor(scene,visible){
        super();

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/donut/donut.mtl", function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/donut/donut.obj", 
                function ( obj ) {
                    // Add the loaded object to the scene
                    obj.name = "enemigo";
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.scale.set(5,5,5);
                    obj.position.y += 6;
                    obj.visible = visible;
                    scene.add( obj );
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del enemigo' );
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
    }
}