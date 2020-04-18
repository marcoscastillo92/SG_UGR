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
        var material = new THREE.MeshNormalMaterial();
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
        var material = new THREE.MeshNormalMaterial();
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
        var material = new THREE.MeshNormalMaterial();

        var points = [new THREE.Vector2(0,-5), new THREE.Vector2(15,-5), new THREE.Vector2(15,5), new THREE.Vector2(0,5)];
        var shapeGeometry = new THREE.LatheGeometry(points, 6, 0, 2*Math.PI);
        var latheObject = new THREE.Mesh(shapeGeometry,material);

        var pointsInt = [new THREE.Vector2(0,0),new THREE.Vector2(7,0),
            new THREE.Vector2(7,1),new THREE.Vector2(6,1),
            new THREE.Vector2(6,2),new THREE.Vector2(7,2),
            new THREE.Vector2(7,3),new THREE.Vector2(6,3),
            new THREE.Vector2(6,4),new THREE.Vector2(7,4),
            new THREE.Vector2(7,5),new THREE.Vector2(6,5),
            new THREE.Vector2(6,6),new THREE.Vector2(7,6),
            new THREE.Vector2(7,7),new THREE.Vector2(6,7),
            new THREE.Vector2(6,8),new THREE.Vector2(7,8),
            new THREE.Vector2(7,9),new THREE.Vector2(6,9),
            new THREE.Vector2(6,10),new THREE.Vector2(7,10),
            new THREE.Vector2(7,11),new THREE.Vector2(6,11),
            new THREE.Vector2(6,12),new THREE.Vector2(7,12),
            new THREE.Vector2(7,13),new THREE.Vector2(8,13)
        ];

        var shapeGeometry = new THREE.LatheGeometry(pointsInt, 24, 0, 2*Math.PI);
        var interior = new THREE.Mesh(shapeGeometry,material);
        interior.position.y = -6

        var esferaGeometry = new THREE.SphereGeometry(15.5,24,24);
        var esfera = new THREE.Mesh(esferaGeometry,material);

        var base = new ThreeBSP(latheObject);
        var esferaBSP = new ThreeBSP(esfera);
        var interiorBSP = new ThreeBSP(interior);

        var corners = base.intersect(esferaBSP).subtract(interiorBSP);
        this.tuerca = corners.toMesh();
        this.tuerca.scale.set(0.1,0.1,0.1);
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
