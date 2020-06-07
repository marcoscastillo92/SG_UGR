class Escena extends THREE.Scene{
    constructor(myCanvas){
        super();
        //Variables
        this.speed = 0.01;

        this.renderizador = this.crearRenderizador(myCanvas);
        // this.eje = new THREE.AxesHelper(5);
        // this.add(this.eje);
        
        //Creación del entorno
        this.crearLuces();
        this.crearCamara();
        this.crearSuelo(this);

        //Crear jugador y añadirlo a escena
        this.jugador = new Jugador(this);
        

        //Instancias para clonar
        this.manzana = new Objetivo(this,false);
        this.cuchillo = new Cuchillo(this,false);
        this.enemigo = new Enemigo(this,false);        

    }

    crearCamara(){
        //Creación de niebla
        //this.fog = new THREE.FogExp2( 0xf0fff0, 0.06 );

        //Definicion de la camara
        this.camara = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,1000);
        //Posicionamiento de la camara (VRP)
        this.camara.position.set(7,5,7);

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

    async crearSuelo(scene){
        var mtlLoader = new THREE.MTLLoader();
        await mtlLoader.load( "models/flatWorld/flatWorld.mtl", async function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/flatWorld/flatWorld.obj", 
               await function ( world ) {
                    // Add the loaded worldect to the scene
                    world.name = "world";
                    world.castShadow = true;
                    world.receiveShadow = true;
                    //world.scale.set(3,3,3);
                    world.position.y -= 14.4;
                    world.position.x = -110;
                    world.position.z = -110;
                    world.rotation.y = 2*Math.PI/1.6;
                    scene.add( world );
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del mundo' );
                },

                // onError callback
                function ( err ) {
                    console.error( 'Error cargando el modelo del mundo: ' + err );
                }
            );
        });
        
    }

    crearLuces(){
        //Definicion y añadido a escena de la luz ambiental (color en zonas no iluminadas)
        var luzAmbiente = new THREE.AmbientLight(0xccddee,1);
        this.add(luzAmbiente);

        //Definición, posicionamiento y añadido a escena de la luz principal
        this.luzPos = new THREE.SpotLight(0xffffff,0.2);
        this.luzPos.castShadow = true;

        this.luzPos.shadow.mapSize.width = 256;  
        this.luzPos.shadow.mapSize.height = 256;
        this.luzPos.shadow.camera.near = 0.5;       
        this.luzPos.shadow.camera.far = 50;

        this.luzPos.position.set(0,60,40);
        this.add(this.luzPos);
    }

    crearRenderizador(myCanvas){
        var renderizador = new THREE.WebGLRenderer({alpha:true});
        
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

        this.camaraControl.update();
        //this.world.rotation.y += 0.01;
        if(this.getObjectByName("world")){
            //this.getObjectByName("world").rotation.z += this.speed;
        }
        this.jugador.update();

        this.renderizador.render(this, this.camara);
    }
}

$(function(){
    var escena = new Escena("#WebGL-output");

    window.addEventListener("resize", () => escena.onWindowResize());

    escena.update();
});