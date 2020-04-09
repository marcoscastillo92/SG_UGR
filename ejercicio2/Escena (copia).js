class Escena extends THREE.Scene{
    constructor(myCanvas){
        super();
        this.renderer = this.createRenderer(myCanvas);
        this.gui = this.createGUI();

        this.createLights();
        this.createCamera();

        this.eje = new THREE.AxesHelper(5);
        this.add(this.eje);

        /* this.cube = new Objeto(this.gui, 'Controles de cubo: ', 0);
        this.add(this.cube); */
        /* this.cone = new Objeto(this.gui, 'Controles de cono: ', 1);
        this.add(this.cone);
        this.cilinder = new Objeto(this.gui, 'Controles de cilindro: ', 2);
        this.add(this.cilinder);
        this.icosaedro = new Objeto(this.gui, 'Controles de piramide: ', 3);
        this.add(this.icosaedro);
        this.toro = new Objeto(this.gui, 'Controles de rosca: ', 4);
        this.add(this.toro);
        this.sphere = new Objeto(this.gui, 'Controles de esfera: ', 5);
        this.add(this.sphere);

        this.cube.position.set(2,0,0);
        this.cone.position.set(-2,0,0);
        this.cilinder.position.set(0,2,0);
        this.icosaedro.position.set(2,2,0);
        this.toro.position.set(-2,2,0); */
        
    }

    createCamera(){
        this.camera = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,1000);
        this.camera.position.set(20,10,20);

        var look = new THREE.Vector3(0,0,0);
        this.camera.lookAt(look);

        this.add(this.camera);

        this.cameraControl = new THREE.TrackballControls(this.camera, this.renderer.domElement);

        this.cameraControl.rotateSpeed = 3;
        this.cameraControl.zoomSpeed = -2;
        this.cameraControl.panSpeed = 0.5;

        this.cameraControl.target = look;
    }

    createGUI(){
        var gui = new dat.GUI();

        this.guiControls = new function(){
            this.sombras = true;
            this.lightIntensity = 0.5;
        }

        var folder = gui.addFolder('Luz ');
        folder.add(this.guiControls,'sobras').name('Sombras: ');
        folder.add(this.guiControls,'lightIntensity',0,1,0.1).name('Intensidad de luz: ');

        return gui;
    }

    createLights(){
        var ambientLight = new THREE.AmbientLight(0xccddee,0.4);
        this.add(ambientLight);

        this.spotLight = new THREE.SpotLight(0xffffff,this.guiControls.lightIntensity);
        
        this.spotLight.position.set(60,60,40);
        this.add(this.spotLight);
    }

    createRenderer(myCanvas){
        var renderer = new THREE.WebGLRenderer();

        renderer.setClearColor(new THREE.Color(0xeeeeee),1.0);

        renderer.setSize(window.innerWidth, window.innerHeight);
        
        $(myCanvas).append(renderer.domElement);
        
        return renderer;
    }

    onWindowResize(){
        this.camera.aspect = window.innerWidth/window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth,window.innerHeight);
    }

    update(){
        requestAnimationFrame(() => this.update())

        this.spotLight.lightIntensity = this.guiControls.lightIntensity;
        this.spotLight.flatShading = this.guiControls.sombras;
        
        this.cameraControl.update();

        //this.cube.update();
        /* this.cilinder.update();
        this.cone.update();
        this.toro.update();
        this.icosaedro.update();
        this.sphere.update(); */

        this.renderer.render(this, this.camera);
    }
}

$(function(){
    var escena = new Escena("#WebGL-output");

    window.addEventListener("resize", () => escena.onWindowResize());

    escena.update();
});