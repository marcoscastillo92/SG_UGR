class Objetivo extends THREE.Object3D{
    constructor(scene,visible){
        super();

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/manzana/manzana.mtl", function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/manzana/manzana.obj", 
                function ( obj ) {
                    // Add the loaded object to the scene
                    obj.name = "objetivo";
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.scale.set(0.2,0.2,0.2);
                    obj.position.y += 4;
                    obj.visible = visible;
                    scene.add( obj );
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del objetivo' );
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
