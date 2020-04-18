class Objeto extends THREE.Object3D{
    constructor(gui,titleGui,cam){
        super();
        this.createGUI(gui,titleGui);
        this.camara = cam;
        var esferaGeom = new THREE.SphereGeometry(1,32,32);

        var texturaTierra = new THREE.TextureLoader().load( './imgs/tierra.jpg' );
        var materialTierra = new THREE.MeshBasicMaterial( { map: texturaTierra } );
        var texturaLuna = new THREE.TextureLoader().load( './imgs/cara.jpg' );
        var materialLuna = new THREE.MeshBasicMaterial( { map: texturaLuna } );
        
        this.tierra = new THREE.Mesh(esferaGeom,materialTierra);
        this.luna1 = new THREE.Mesh(esferaGeom,materialLuna);
        this.luna2 = new THREE.Mesh(esferaGeom,materialLuna);
        this.luna3 = new THREE.Mesh(esferaGeom,materialLuna);

        this.eje1 = new THREE.AxesHelper();
        this.eje1.add(this.luna1);
        this.eje2 = new THREE.AxesHelper();
        this.eje2.add(this.luna2);
        this.eje3 = new THREE.AxesHelper();
        this.eje3.add(this.luna3);

        this.eje1.position.set(6,0,0);
        this.eje2.position.set(12,0,0);
        this.eje3.position.set(18,0,0);
        this.luna1.rotation.y = 4.5*Math.PI/3;
        this.luna1.rotation.z = 0.9;
        this.luna2.rotation.y = 1.6*Math.PI;

        this.add(this.tierra);
        this.add(this.eje1);
        this.add(this.eje2);
        this.add(this.eje3);

    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.animacion = false;

            this.reset = function () {
                this.animacion = false;
            }
        }

        var that = this;
        var carpeta = gui.addFolder (titleGui);
        carpeta.add (this.guiControls, 'animacion').name ('Animación : ').onChange(function(value){
            that.animacion = value;
        }).listen();
        
        carpeta.add (this.guiControls, 'reset').name ('[ Reset ]');
    }

    update(){
        if(this.animacion){
            this.rotation.y += 0.01;
            this.eje1.lookAt(this.tierra.position);
            this.eje2.lookAt(this.camara.position);
            this.eje3.rotation.y += 0.01;
        }
    }
}
