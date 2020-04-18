class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.createGUI(gui,titleGui);
        this.radio = 0;

        this.createSpline();
        this.crearBola();
        this.crearCilindro();

        var that = this;
        var animacionInicial = new TWEEN.Tween(this.spline.getPointAt(0)).to(this.spline.getPointAt(1), 4000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .repeat(Infinity)
        .onUpdate(function(){
            var time = Date.now()
            var looptime = 4000
            var t = (time % looptime) / looptime

            var posicion = that.spline.getPointAt(t)
            that.bola.position.copy(posicion)
            var tangente = that.spline.getTangentAt(t)
            posicion.add(tangente)
            that.bola.lookAt(posicion)
        })

        animacionInicial.start();

        this.add(this.bola);
        this.add(this.cilindro);
    }

    createGUI(gui,titleGui){
        this.guiControls = new function() {
            this.radio = 0
        }

        var that = this;
        var carpeta = gui.addFolder (titleGui);
        carpeta.add (this.guiControls, 'radio',0,21,0.1).name("Radio: ").onChange(function(value){
            that.radio = value;
            that.updateSpline(that.radio)
            that.cilindro.scale.set(1 + (that.radio*0.2), 1, 1)
        }).listen();
    }

    createSpline(){
        this.curve = new THREE.EllipseCurve(
          0,  0,            // ax, aY
          5, 5,           // xRadius, yRadius
          0,  2 * Math.PI,  // aStartAngle, aEndAngle
          false,            // aClockwise
          0                 // aRotation
        );
        this.curvePoints = this.curve.getPoints( 50 );
    
        var i = 0;
        this.vector3CurvePoints = [];
        for(i=0;i<this.curvePoints.length;i++){
          var vector = new THREE.Vector3(this.curvePoints[i].x,2 , this.curvePoints[i].y);
          this.vector3CurvePoints.push (vector);
        }
    
        this.spline = new THREE.CatmullRomCurve3(this.vector3CurvePoints);
    }

    updateSpline(radio){
        this.curve = new THREE.EllipseCurve(
          0,  0,            // ax, aY
          5 + radio, 5,           // xRadius, yRadius
          0,  2 * Math.PI,  // aStartAngle, aEndAngle
          false,            // aClockwise
          0                 // aRotation
        );
        this.curvePoints = this.curve.getPoints( 50 );
    
        var i = 0;
        this.vector3CurvePoints = [];
        for(i=0;i<this.curvePoints.length;i++){
          var vector = new THREE.Vector3(this.curvePoints[i].x,2 , this.curvePoints[i].y);
          this.vector3CurvePoints.push (vector);
        }
    
        this.spline = new THREE.CatmullRomCurve3(this.vector3CurvePoints);
    }

    crearCilindro(){
        var geometry = new THREE.CylinderGeometry(5,5,10,24);
        var material =  new THREE.MeshNormalMaterial({opacity: 0.35, transparent: true });
        this.cilindro = new THREE.Mesh(geometry, material);
    }

    crearBola(){
        var geometry = new THREE.SphereGeometry(2,24,24);
        var material = new THREE.MeshNormalMaterial();
        this.bola = new THREE.Mesh(geometry, material);
    }

    update(){
        TWEEN.update();
        this.radio = this.guiControls.radio;
    }
}
