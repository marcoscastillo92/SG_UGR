class Cuchillo extends THREE.Object3D{
    constructor(scene,visible){
        super();

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/cuchillo/cuchillo.mtl", function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/cuchillo/cuchillo.obj", 
                function ( obj ) {
                    // Add the loaded object to the scene
                    obj.name = "cuchillo";
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.scale.set(0.4,0.4,0.4);
                    obj.position.y += 8;
                    obj.visible = visible;
                    scene.add( obj );
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del cuchillo' );
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