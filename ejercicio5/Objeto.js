class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.alpha = 0;
        this.createGUI(gui,titleGui);

        this.createTaza();
        this.createSoporte();
        this.createTuerca();

        this.add(this.taza);
        this.add(this.soporte);
        this.add(this.tuerca);
    }

    createTaza(){
        var material = new THREE.MeshPhongMaterial();
        var cilindroGeo = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        var torusGeo = new THREE.TorusGeometry( 10, 3, 16, 100 );

        var cilindroMesh = new THREE.Mesh(cilindroGeo, material);
        var cilindroMeshResta = new THREE.Mesh(cilindroGeo, material);
        cilindroMeshResta.scale.set(0.8,1,0.8);
        cilindroMeshResta.position.y = 4;
        var torusMesh = new THREE.Mesh(torusGeo, material);
        torusMesh.scale.set(0.5,0.5,0.5);
        torusMesh.position.set(3,3,0);
        
        var geo0 = new ThreeBSP(cilindroMeshResta);
        var geo1 = new ThreeBSP(cilindroMesh);
        var geo2 = new ThreeBSP(torusMesh);

        var geoF = geo1.subtract(geo0);
        var geoT = geo2.subtract(geo0);
        var geoU = geoF.union(geoT);
        this.taza = geoU.toMesh(material);

        this.taza.position.set(4,0,0);
        this.taza.scale.set(0.1,0.1,0.1);
    }

    createSoporte(){
        var material = new THREE.MeshPhongMaterial();
        var holeGeo = new THREE.CylinderGeometry( 1, 1, 20, 32 );
        var boxGeo = new THREE.BoxGeometry( 2, 2, 1 );

        var bigBoxMesh = new THREE.Mesh(boxGeo, material);
        var boxSubMesh = new THREE.Mesh(boxGeo, material);
        var holeMesh = new THREE.Mesh(holeGeo, material);
        var holeMeshHoriz = new THREE.Mesh(holeGeo, material);

        holeMeshHoriz.rotation.z += Math.PI/2;
        holeMeshHoriz.scale.set(0.2,0.2,0.2);
        holeMeshHoriz.position.set(-1,-0.5,0);
        holeMesh.scale.set(0.2,0.2,0.2);
        holeMesh.position.set(0.5,2,0);
        boxSubMesh.position.set(0.2,-0.2,0);
        
        var geo0 = new ThreeBSP(boxSubMesh);
        var geo05 = new ThreeBSP(holeMeshHoriz);
        var geo1 = new ThreeBSP(bigBoxMesh);
        var geo2 = new ThreeBSP(holeMesh);

        var geoF = geo1.subtract(geo0);
        var geoG = geoF.subtract(geo05);
        var geoU = geoG.subtract(geo2);
        this.soporte = geoU.toMesh(material);
        this.soporte.position.set(1,0,0);
    }

    createTuerca(){
        var material = new THREE.MeshPhongMaterial();
        var cylinderGeo = new THREE.CylinderGeometry( 1.2, 1.2, 20, 32 );
        var boxGeo = new THREE.BoxGeometry( 2, 1, 1.1 );

        var boxMesh1 = new THREE.Mesh(boxGeo, material);
        var boxMesh2 = new THREE.Mesh(boxGeo, material);
        var boxMesh3 = new THREE.Mesh(boxGeo, material);
        var cuerpo = new THREE.Mesh(cylinderGeo, material);
        var cuerpo2 = new THREE.Mesh(cylinderGeo, material);
        var holeMesh = new THREE.Mesh(cylinderGeo, material);

        boxMesh2.rotation.y += Math.PI/3;
        boxMesh3.rotation.y += 2*Math.PI/3;

        cuerpo2.scale.set(0.87,1,0.87);
        holeMesh.scale.set(0.5,1,0.5);
        
        var geo00 = new ThreeBSP(boxMesh1);
        var geo01 = new ThreeBSP(boxMesh2);
        var geo02 = new ThreeBSP(boxMesh3);
        var geo1 = new ThreeBSP(cuerpo);
        var geo2 = new ThreeBSP(holeMesh);
        var geo3 = new ThreeBSP(cuerpo2);

        var geoF = geo00.union(geo01);
        var geoR = geoF.union(geo02);
        var geoD = geo1.subtract(geo3);
        var geoS = geoD.intersect(geoR); 
        var geoT = geoR.subtract(geoS);
        var geoU = geoT.subtract(geo2);
        this.tuerca = geoU.toMesh(material); 

        this.tuerca.position.set(-3,0,0);
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
            this.tuerca.rotation.y+=0.01;
            this.tuerca.rotation.z+=0.01;
            this.tuerca.rotation.x+=0.01;

            this.taza.rotation.y+=0.01;
            this.taza.rotation.z+=0.01;
            this.taza.rotation.x+=0.01;

            this.soporte.rotation.y+=0.01;
            this.soporte.rotation.z+=0.01;
            this.soporte.rotation.x+=0.01;
        }
        
    }
}
