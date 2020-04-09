class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.alpha = 0;
        this.createGUI(gui,titleGui);

        var heartShape = new THREE.Shape();
        heartShape.moveTo(25,25 );
        heartShape.bezierCurveTo(25,25,20, 0, 0, 0 );
        heartShape.bezierCurveTo(-30,0,-30,35,-30,35 );
        heartShape.bezierCurveTo(-30,55,-10,77,25,95 );
        heartShape.bezierCurveTo(60,77,80,55,80,35 );
        heartShape.bezierCurveTo(80,35,80,0,50,0 );
        heartShape.bezierCurveTo(35,0,25,25,25,25 );

        var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

        var geometry = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );

        this.meshHeart = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
        this.meshHeart.scale.set(0.01,0.01,0.01);
        this.meshHeart.position.set(3,0,0);

        this.add(this.meshHeart);
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
            this.meshHeart.rotation.y+=0.01;
            //this.meshHeart.rotation.z+=0.01;
        }
        
    }
}
