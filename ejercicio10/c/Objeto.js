class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.createGUI(gui,titleGui);
        this.radioSup = 1;
        this.radioInf = 1;
        this.height = 10;
        this.a = 0;
        this.dif = 0;

        var esferaGeom = new THREE.SphereGeometry(0.5,32,32);
        var cylinderGeom = new THREE.CylinderGeometry(this.radioSup,this.radioInf,this.height,32);

        var materialTranslucido = new THREE.MeshNormalMaterial({opacity:0.35,transparent:true})
        var material = new THREE.MeshPhongMaterial( { color: 0x00FF00 } );
        
        this.cilindro = new THREE.Mesh(cylinderGeom,materialTranslucido);
        this.esfera = new THREE.Mesh(esferaGeom,material);

        this.cilindro.position.y = this.height/2;
        this.esfera.position.set(this.radioInf+0.25,0.25,0);

        this.posicion = { x: this.esfera.position.x, y: this.esfera.position.y}
        this.tween = new TWEEN.Tween(this.posicion);
        this.tween.to({x:this.dif},4000);
        this.tween.start();

        this.add(this.esfera);
        this.add(this.cilindro);
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.radioSup = 1.0;
            this.radioInf = 1.0;

            this.reset = function () {
                this.radioSup = 1.0;
                this.radioInf = 1.0;
            }
        }

        var that = this;
        var carpeta = gui.addFolder (titleGui);
        carpeta.add (this.guiControls, 'radioSup', 1, 10, 0.1).name ('Radio Superior: ').onChange(function(value){
            that.dif = that.radioInf - that.radioSup;
            that.cilindro.geometry = new THREE.CylinderGeometry(that.radioSup,that.radioInf,that.height,32);
        }).listen();
        carpeta.add (this.guiControls, 'radioInf', 1, 10, 0.1).name ('Radio Inferior: ').onChange(function(value){
            that.dif = that.radioInf - that.radioSup;
            that.cilindro.geometry = new THREE.CylinderGeometry(that.radioSup,that.radioInf,that.height,32);
        }).listen();
        
        carpeta.add (this.guiControls, 'reset').name ('[ Reset ]');
    }

    update(){
        this.radioSup = this.guiControls.radioSup;
        this.radioInf = this.guiControls.radioInf;
        this.a += 0.032;
        TWEEN.update();

        //this.cilindro.geometry.vertices[10].x;
        this.esfera.position.set(this.radioInf*Math.cos(this.a)+this.posicion.x,this.height/2*Math.cos(this.a)+this.height/2,this.radioInf*Math.sin(this.a)+this.posicion.x)
    }
}
