class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.createGUI(gui,titleGui);
        this.aux = 5;

        var esferaGeom = new THREE.SphereGeometry(0.5,32,32);
        var material = new THREE.MeshPhongMaterial( { color: 0x00FF00 } );
        
        this.path = new THREE.Path();
        this.path.absellipse(0,10,20,10,0,2*Math.PI,true); 
        this.camino = new THREE.BufferGeometry().setFromPoints(this.path.getPoints());
        this.linea = new THREE.Line(this.camino,material);

        this.movil = new THREE.Mesh(esferaGeom,material);

        this.createTween(this.movil.position);

        this.add(this.movil);
        this.add(this.linea);
    }

    createTween(obj){
        var that = this;
        this.tween = new TWEEN.Tween(obj)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .yoyo( true ) 
          .repeat( Infinity )
          .onUpdate(function() { 

          });
          var points = this.path.getPoints();
          console.log(points);
          var count = points.lenght;

            
          this.tween.to({x: points[this.aux].x, y: points[this.aux].y},3000);
           

          this.tween.start();

          
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
        TWEEN.update();
        this.aux +=1;
    }
}
