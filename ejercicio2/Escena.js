class Escena extends THREE.Scene{
    constructor(myCanvas){
        super();
        this.renderizador = this.crearRenderizador(myCanvas);
        this.gui = this.crearGUI();
        
        this.crearLuces();
        this.crearCamara();

        //Crear eje y añadirlo a escena
        this.eje = new THREE.AxesHelper(5);
        this.add(this.eje);

        this.cube = new Objeto(this.gui, 'Controles de cubo: ', 0);
        this.add(this.cube);
        this.cone = new Objeto(this.gui, 'Controles de cono: ', 1);
        this.add(this.cone);
        this.cilinder = new Objeto(this.gui, 'Controles de cilindro: ', 2);
        this.add(this.cilinder);
        this.icosaedro = new Objeto(this.gui, 'Controles de piramide: ', 3);
        this.add(this.icosaedro);
        this.toro = new Objeto(this.gui, 'Controles de rosca: ', 4);
        this.add(this.toro);
        this.sphere = new Objeto(this.gui, 'Controles de esfera: ', 5);
        this.add(this.sphere);
        
    }

    crearCamara(){
        //Definicion de la camara
        this.camara = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,1000);
        //Posicionamiento de la camara (VRP)
        this.camara.position.set(20,10,20);

        //Dirección de la camara (VPN)
        var look = new THREE.Vector3(0,0,0);
        this.camara.lookAt(look);

        //Añadir camara a escena
        this.add(this.camara);

        //Control de camara con movimiento orbital (definido en TrackballControls)
        this.camaraControl = new THREE.TrackballControls(this.camara, this.renderizador.domElement);

        //Configuración de velocidades del TrackballControl
        this.camaraControl.rotateSpeed = 3;
        this.camaraControl.zoomSpeed = -2;
        this.camaraControl.panSpeed = 0.5;

        //Sobre qué debe orbitar
        this.camaraControl.target = look;
    }

    crearGUI(){
        var gui = new dat.GUI();

        this.guiControls = new function() {
            this.intensidadLuz = 0.5;
            this.intensidadLuz2 = 0.5;
            this.ejeOnOff = true;
            this.sombras = true;
        }

        var carpeta = gui.addFolder('Luz y ejes');

        carpeta.add(this.guiControls,'intensidadLuz', 0, 1, 0.1).name('Intensidad de luz: ');
        carpeta.add(this.guiControls,'intensidadLuz2', 0, 1, 0.1).name('Intensidad de luz 2: ');
        carpeta.add(this.guiControls,'ejeOnOff').name('Mostrar ejes: ');
        carpeta.add(this.guiControls,'sombras').name('Sombras: ');
        
        return gui;
    }

    crearLuces(){
        //Definicion y añadido a escena de la luz ambiental (color en zonas no iluminadas)
        var luzAmbiente = new THREE.AmbientLight(0xccddee,0.4);
        this.add(luzAmbiente);

        //Definición, posicionamiento y añadido a escena de la luz principal
        this.luzPos = new THREE.SpotLight(0xffffff,this.guiControls.intensidadLuz);
        this.luzPos.castShadow = true;

        this.luzPos.shadow.mapSize.width = 512;  
        this.luzPos.shadow.mapSize.height = 512;
        this.luzPos.shadow.camera.near = 0.5;       
        this.luzPos.shadow.camera.far = 500;

        this.luzPos.position.set(60,60,40);
        this.add(this.luzPos);

        this.luzPos2 = new THREE.SpotLight(0xffffff,this.guiControls.intensidadLuz);
        this.luzPos2.castShadow = true;

        this.luzPos2.shadow.mapSize.width = 512;  
        this.luzPos2.shadow.mapSize.height = 512;
        this.luzPos2.shadow.camera.near = 0.5;       
        this.luzPos2.shadow.camera.far = 500;

        this.luzPos2.position.set(-120,60,-40);
        this.add(this.luzPos2);
    }

    crearRenderizador(myCanvas){
        var renderizador = new THREE.WebGLRenderer();
        
        renderizador.setClearColor(new THREE.Color(0xEEEEEE),1.0);

        renderizador.setSize(window.innerWidth,window.innerHeight);
        renderizador.shadowMap.enabled = true;
        renderizador.shadowMap.type = THREE.PCFSoftShadowMap;

        $(myCanvas).append(renderizador.domElement);
        
        return renderizador;
    }

    onWindowResize(){
        this.camara.aspect = window.innerWidth/window.innerHeight;
        this.camara.updateProjectionMatrix();

        this.renderizador.setSize(window.innerWidth,window.innerHeight);
    }

    update(){
        requestAnimationFrame(() => this.update())

        this.luzPos.intensity = this.guiControls.intensidadLuz;
        this.luzPos2.intensity = this.guiControls.intensidadLuz2;
        this.eje.visible = this.guiControls.ejeOnOff;
        this.sombras = this.guiControls.sombras;
        this.renderizador.shadowMap.enabled = this.sombras;

        this.camaraControl.update();

        this.cube.update();
        this.cone.update();
        this.cilinder.update();
        this.icosaedro.update();
        this.toro.update();
        this.sphere.update();

        this.renderizador.render(this, this.camara);
    }
}

$(function(){
    var escena = new Escena("#WebGL-output");

    window.addEventListener("resize", () => escena.onWindowResize());

    escena.update();
});