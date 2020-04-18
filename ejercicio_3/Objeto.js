class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();

        this.createGUI(gui,titleGui);

        this.pts = [];
        this.path = new THREE.Path();

        this.path.moveTo(0,5);
        this.path.quadraticCurveTo(1,4.5,0.5,3);
        this.path.quadraticCurveTo(0,2,1.5,0);
        this.path.lineTo(0,0);

        this.pts = this.path.getPoints();
        var lineGeo = new THREE.BufferGeometry().setFromPoints(this.pts);
        var geoObjeto = new THREE.LatheGeometry(this.pts, 10);
        
        var matObjeto = new THREE.MeshNormalMaterial();

        this.linea = new THREE.Line(lineGeo,matObjeto);
        this.linea.position.set(-5,0,3);

        this.objeto = new THREE.Mesh(geoObjeto,matObjeto);
        this.objeto.castShadow = true;
        this.objetoCompleto = new THREE.Mesh(geoObjeto,matObjeto);
        this.objetoCompleto.castShadow = true;
        this.objetoCompleto.position.set(5,0,-3);
        
        this.add(this.objetoCompleto);
        this.add(this.objeto);
        this.add(this.linea);
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.points = 10.0;
            this.segments = 10.0;
            this.phiStart = 1.0;
            this.phiEnd = 1.0;

            this.reset = function(){
                this.points = 10.0;
                this.segments = 10.0;
                this.phiStart = 1.0;
                this.phiEnd = 1.0;
            }
        }

        var carpeta = gui.addFolder(titleGui);

        var that = this;
        carpeta.add(this.guiControls, 'points', 1, 20, 1).name('Puntos: ').onChange(function (valor){
            that.objeto.geometry = new THREE.LatheGeometry(that.pts, that.points, that.phiStart, that.phiEnd);
            that.objetoCompleto.geometry = new THREE.LatheGeometry(that.pts, that.points, 0, 2*Math.PI);   
        }).listen();
        carpeta.add(this.guiControls, 'segments', 1, 20, 1).name('Segmentos: ').onChange(function (valor){
            that.objeto.geometry = new THREE.LatheGeometry(that.pts, that.segments, that.phiStart, that.phiEnd);
            that.objetoCompleto.geometry = new THREE.LatheGeometry(that.pts, that.points, 0, 2*Math.PI);
        }).listen();
        carpeta.add(this.guiControls, 'phiStart', 0.0, 2*Math.PI, 0.1).name('PhiStart: ').onChange(function (valor){
            that.objeto.geometry = new THREE.LatheGeometry(that.pts, that.segments, that.phiStart, that.phiEnd);
        }).listen();
        carpeta.add(this.guiControls, 'phiEnd', 0.0, 2*Math.PI, 0.1).name('PhiEnd: ').onChange(function (valor){
            that.objeto.geometry = new THREE.LatheGeometry(that.pts, that.segments, that.phiStart, that.phiEnd);
        }).listen();

        carpeta.add(this.guiControls, 'reset').name('Por defecto');
    }

    update(){
        this.points=this.guiControls.points;
        this.segments=this.guiControls.segments;
        this.phiStart=this.guiControls.phiStart;
        this.phiEnd = this.guiControls.phiEnd;
        
    }
}
