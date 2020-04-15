class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.createGUI(gui,titleGui);
        this.radio = 1;
        this.height = 10;
        this.a = 0;

        var esferaGeom = new THREE.SphereGeometry(0.5,32,32);
        var cylinderGeom = new THREE.CylinderGeometry(this.radio,this.radio,this.height,32);

        var materialTranslucido = new THREE.MeshNormalMaterial({opacity:0.35,transparent:true})
        var material = new THREE.MeshPhongMaterial( { color: 0x00FF00 } );
        
        this.cilindro = new THREE.Mesh(cylinderGeom,materialTranslucido);
        this.esfera = new THREE.Mesh(esferaGeom,material);

        this.cilindro.position.y = this.height/2;
        this.esfera.position.set(this.radio+0.25,0.25,0);
        
        this.add(this.esfera);
        this.add(this.cilindro);
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.radio = 1.0;

            this.reset = function () {
                this.radio = 1.0;
            }
        }

        var that = this;
        var carpeta = gui.addFolder (titleGui);
        carpeta.add (this.guiControls, 'radio', 1, 10, 0.1).name ('Radio : ').onChange(function(value){
            
            that.cilindro.geometry = new THREE.CylinderGeometry(that.radio,that.radio,that.height,32);
        }).listen();
        
        carpeta.add (this.guiControls, 'reset').name ('[ Reset ]');
    }

    update(){
        this.radio = this.guiControls.radio;
        this.a += 0.032;
        this.esfera.position.set(this.radio*Math.cos(this.a),this.height/2*Math.cos(this.a)+this.height/2,this.radio*Math.sin(this.a))
    }
}
