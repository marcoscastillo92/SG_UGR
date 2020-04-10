class Objeto extends THREE.Object3D{
    constructor(gui,titleGui, escena){
        super();
        this.createGUI(gui,titleGui);

        this.model;
        var that = this;
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../models/porsche911/911.mtl',function(materials) {
            materials.preload();
            var loader = new THREE.OBJLoader();
            loader.setMaterials(materials);
            loader.load('../models/porsche911/Porsche_911_GT2.obj', 
                function(object){
                    object.castShadow = true; 
                    object.receiveShadow = true;
                    that.model = object;
                    escena.add(that.model);
                }, 
                function (xhr){
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                }, 
                function (error){
                    console.log('Error cargando el archivo .obj');
                });
        });
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.animacion = false;
        }

        var that = this;
        gui.add(this.guiControls, 'animacion').name('Animación: ').onChange(function (valor){
            that.animacion = valor;
        }).listen();
    }

    update(){
        if(this.animacion){
            this.model.rotation.y+=0.01;
        }
        
    }
}
