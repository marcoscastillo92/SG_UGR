class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.alpha = 0;
        this.createGUI(gui,titleGui);

        this.createHeart();
        this.createClover();
        this.createDiamond();
        this.createSpade();
        this.createCloverExtruded();
        this.createHeartExtruded()

        this.eje = new THREE.AxesHelper(0.001);
        this.eje.position.set(2,1,0);

        this.eje.add(this.ejeCorazon);
        this.eje.add(this.ejeTrebol);
        this.eje.add(this.ejeRombo);
        this.eje.add(this.ejePica);

        this.ejeExtruded = new THREE.AxesHelper(0.001);
        this.ejeExtruded.add(this.cloverExtruded);
        this.ejeExtruded.add(this.heartExtruded);

        this.add(this.ejeExtruded);
        this.add(this.eje);
    }

    createDiamond(){
        var diamondShape = new THREE.Shape();
       
        diamondShape.moveTo(10,0 );
        diamondShape.lineTo(5,5);
        diamondShape.lineTo(10,10);
        diamondShape.lineTo(15,5);
        diamondShape.lineTo(10,0);

        var extrudeSettings = { amount: 2, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 0.2 };

        var geometry = new THREE.ExtrudeBufferGeometry( diamondShape, extrudeSettings );
        var material = new THREE.MeshPhongMaterial({color: 0xFF0000});

        this.meshDiamond = new THREE.Mesh( geometry, material );
        this.meshDiamond.scale.set(0.1,0.1,0.1);
        geometry.center();

        this.ejeRombo = new THREE.AxesHelper(0.001);
        this.ejeRombo.add(this.meshDiamond);
        this.ejeRombo.position.set(-1,1,0);
    }

    createClover(){
        var cloverShape = new THREE.Shape();
       
        cloverShape.moveTo(17,0 );
        cloverShape.bezierCurveTo(17,0, 17.7,4, 17,5 );
        cloverShape.bezierCurveTo(17,5, 11,1, 10,7 );
        cloverShape.bezierCurveTo(10,7, 10.5,14, 15,8.5 );
        cloverShape.bezierCurveTo(15,8.5, 12,13.5, 17.5,15 );
        //MITAD 2
        cloverShape.bezierCurveTo(17.5,15, 22,13.5, 19,8.5 );
        cloverShape.bezierCurveTo(19,8.5, 23.5,14, 24,7 );
        cloverShape.bezierCurveTo(24,7, 23,1, 18,5 );
        cloverShape.bezierCurveTo(18,5, 17,4, 17.5,0 );

        var extrudeSettings = { amount: 2, bevelEnabled: true, bevelSegments: 0, steps: 2, bevelSize: 1, bevelThickness: 1 };

        var geometry = new THREE.ExtrudeBufferGeometry( cloverShape, extrudeSettings );
        var material = new THREE.MeshPhongMaterial({color: 0x0000FF});

        this.meshClover = new THREE.Mesh( geometry, material );
        this.meshClover.scale.set(0.09,0.09,0.09);
        geometry.center();

        this.ejeTrebol = new THREE.AxesHelper(0.001);
        this.ejeTrebol.add(this.meshClover);
        this.ejeTrebol.position.set(-1,-1,0);
    }

    createHeart(){
        var heartShape = new THREE.Shape();
        heartShape.moveTo(25,25 );
        heartShape.bezierCurveTo(25,25, 20,0, 0,0 );
        heartShape.bezierCurveTo(-30,0, -30,35, -30,35 );
        heartShape.bezierCurveTo(-30,55, -10,77, 25,95 );
        heartShape.bezierCurveTo(60,77, 80,55, 80,35 );
        heartShape.bezierCurveTo(80,35, 80,0, 50,0 );
        heartShape.bezierCurveTo(35,0, 25,25, 25,25 );

        var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        var geometry = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );
        var material = new THREE.MeshPhongMaterial({color: 0xFF0000});

        this.meshHeart = new THREE.Mesh( geometry, material );
        this.meshHeart.scale.set(0.015,0.015,0.015);
        this.meshHeart.rotation.set(3.1456,0,0,0);
        geometry.center();

        this.ejeCorazon = new THREE.AxesHelper(0.001);
        this.ejeCorazon.add(this.meshHeart);
        this.ejeCorazon.position.set(1,-1,0);
    }

    createSpade(){
        var spadeShape = new THREE.Shape();
        spadeShape.moveTo(22,-10 );
        spadeShape.bezierCurveTo(22,-10 ,25,10, 25,25);
        spadeShape.bezierCurveTo(25,25, 20,0, 0,0 );
        spadeShape.bezierCurveTo(-30,0, -30,35, -30,35 );
        spadeShape.bezierCurveTo(-30,55, -10,77, 25,95 );
        spadeShape.bezierCurveTo(60,77, 80,55, 80,35 );
        spadeShape.bezierCurveTo(80,35, 80,0, 50,0 );
        spadeShape.bezierCurveTo(35,0, 26,26, 26,26 );
        spadeShape.bezierCurveTo(26,26, 26,15, 28,-10);

        var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        var geometry = new THREE.ExtrudeBufferGeometry( spadeShape, extrudeSettings );
        var material = new THREE.MeshPhongMaterial({color: 0x0000FF});

        this.meshSpade = new THREE.Mesh( geometry, material );
        this.meshSpade.scale.set(0.015,0.015,0.015);
        geometry.center();

        this.ejePica = new THREE.AxesHelper(0.001);
        this.ejePica.add(this.meshSpade);
        this.ejePica.position.set(1,1,0);
    }

    createCloverExtruded(){
        var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( - 50, - 60, 0 ),
            new THREE.Vector3( - 25, -30, -10 ),
            new THREE.Vector3( 0, 0, 10 ),
            new THREE.Vector3( 25, 30, -10 ),
            new THREE.Vector3( 50, 60, 0 )
        ] );

        var cloverShape = new THREE.Shape();
       
        cloverShape.moveTo(17,0 );
        cloverShape.bezierCurveTo(17,0, 17.7,4, 17,5 );
        cloverShape.bezierCurveTo(17,5, 11,1, 10,7 );
        cloverShape.bezierCurveTo(10,7, 10.5,14, 15,8.5 );
        cloverShape.bezierCurveTo(15,8.5, 12,13.5, 17.5,15 );
        //MITAD 2
        cloverShape.bezierCurveTo(17.5,15, 22,13.5, 19,8.5 );
        cloverShape.bezierCurveTo(19,8.5, 23.5,14, 24,7 );
        cloverShape.bezierCurveTo(24,7, 23,1, 18,5 );
        cloverShape.bezierCurveTo(18,5, 17,4, 17.5,0 );

        var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1, extrudePath: curve };

        var geometry = new THREE.ExtrudeBufferGeometry( cloverShape, extrudeSettings );
        var material = new THREE.MeshPhongMaterial({color: 0x00FF00});

        this.cloverExtruded = new THREE.Mesh( geometry, material );
        this.cloverExtruded.scale.set(0.03,0.03,0.03);
        this.cloverExtruded.position.set(-1,0.5,0);
        this.cloverExtruded.rotation.z+=0.7;
        geometry.center();
    }

    createHeartExtruded(){
        var curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( - 50, - 200, 0 ),
            new THREE.Vector3( - 25, -100, -10 ),
            new THREE.Vector3( 0, 0, 10 ),
            new THREE.Vector3( 25, 100, -10 ),
            new THREE.Vector3( 50, 200, 0 )
        ] );

        var heartShape = new THREE.Shape();
        heartShape.moveTo(25,25 );
        heartShape.bezierCurveTo(25,25, 20,0, 0,0 );
        heartShape.bezierCurveTo(-30,0, -30,35, -30,35 );
        heartShape.bezierCurveTo(-30,55, -10,77, 25,95 );
        heartShape.bezierCurveTo(60,77, 80,55, 80,35 );
        heartShape.bezierCurveTo(80,35, 80,0, 50,0 );
        heartShape.bezierCurveTo(35,0, 25,25, 25,25 );

        var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1, extrudePath: curve };

        var geometry = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );
        var material = new THREE.MeshPhongMaterial({color: 0x00FF00});

        this.heartExtruded = new THREE.Mesh( geometry, material );
        this.heartExtruded.scale.set(0.005,0.01,0.005);
        this.heartExtruded.position.set(5,0.5,0);
        this.heartExtruded.rotation.z+=0.25;
        geometry.center();
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
            this.eje.rotation.z += 0.01;
            this.ejeCorazon.rotation.z-=0.01;
            this.ejeTrebol.rotation.z-=0.01;
            this.ejeRombo.rotation.z-=0.01;
            this.ejePica.rotation.z-=0.01;
            this.ejeExtruded.rotation.x += 0.01;

            this.meshHeart.rotation.y-=0.02;
            this.meshClover.rotation.y+=0.02;
            this.meshDiamond.rotation.y+=0.02;
            this.meshSpade.rotation.y+=0.02;
            
            this.heartExtruded.rotation.y+=0.02;
            this.cloverExtruded.rotation.y+=0.02;
        }
        
    }
}
