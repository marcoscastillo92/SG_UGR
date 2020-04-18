class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();

        this.createGUI(gui,titleGui);

        var geoObjeto = new THREE.BoxGeometry(2,2,2);
        var matObjeto = new THREE.MeshPhongMaterial({color: 0xFFF700});
        
        var objeto = new THREE.Mesh(geoObjeto,matObjeto);
        objeto.castShadow = true;
        
        this.add(objeto);

        objeto.position.y = 1;
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.sizeX = 1.0;
            this.sizeY = 1.0;
            this.sizeZ = 1.0;

            this.posX = 0.0;
            this.posY = 0.0;
            this.posZ = 0.0;

            this.rotX = 0.0;
            this.rotY = 0.0;
            this.rotZ = 0.0;

            this.reset = function(){
                this.sizeX = 1;
                this.sizeY = 1;
                this.sizeZ = 1;

                this.posX = 0;
                this.posY = 0;
                this.posZ = 0;
                
                this.rotX = 0.0;
                this.rotY = 0.0;
                this.rotZ = 0.0;
            }
        }

        var carpeta = gui.addFolder(titleGui);

        carpeta.add(this.guiControls, 'sizeX', 0.1, 10, 0.1).name('Tamaño en X: ').listen();
        carpeta.add(this.guiControls, 'sizeY', 0.1, 10, 0.1).name('Tamaño en Y: ').listen();
        carpeta.add(this.guiControls, 'sizeZ', 0.1, 10, 0.1).name('Tamaño en Z: ').listen();

        carpeta.add(this.guiControls, 'rotX', 0.0, Math.PI/2, 0.1).name('Rotación en X: ').listen();
        carpeta.add(this.guiControls, 'rotY', 0.0, Math.PI/2, 0.1).name('Rotación en Y: ').listen();
        carpeta.add(this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.1).name('Rotación en Z: ').listen();

        carpeta.add(this.guiControls, 'posX', -20.0, 20, 0.1).name('Posición en X: ').listen();
        carpeta.add(this.guiControls, 'posY', 0.0, 10, 0.1).name('Posición en Y: ').listen();
        carpeta.add(this.guiControls, 'posZ', -20.0, 20, 0.1).name('Posición en Z: ').listen();

        carpeta.add(this.guiControls, 'reset').name('Por defecto');
    }

    update(){
        this.position.set(this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
        this.rotation.set(this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
        this.scale.set(this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
    }
}
