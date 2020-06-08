class Escena extends Physijs.Scene{
    constructor(myCanvas){
        //Inicialización de variables de motor de físicas
        Physijs.scripts.worker = './libs/physijs_worker.js';
        Physijs.scripts.ammo = './libs/ammo.js';

        super();
        //Variables
        this.speed = 1; //fast...slow [0.1 ... n]
        this.mundoCargado = false;
        document.onkeydown = handleKeyDown;

        //Gravedad
        this.setGravity(new THREE.Vector3(0,-10,0));

        this.renderizador = this.crearRenderizador(myCanvas);
        // this.eje = new THREE.AxesHelper(5);
        // this.add(this.eje);
        
        //Creación del entorno
        this.crearLuces();
        this.crearCamara();
        this.crearSuelo(this);

        //Crear jugador y añadirlo a escena
        this.crearJugador(this);

        //Instancias para clonar
        this.manzana = new Objetivo(this,false);
        this.cuchillo = new Cuchillo(this,false);
        this.enemigo = new Enemigo(this,false);        

    }

    crearCamara(){
        //Creación de niebla
        //this.fog = new THREE.FogExp2( 0xf0fff0, 0.003 );
        this.fog = new THREE.Fog( 0xF0F0F0, 10, 300 );

        //Definicion de la camara
        this.camara = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,1000);
        //Posicionamiento de la camara (VRP)
        this.camara.position.set(15,10,15);

        //Dirección de la camara (VPN)
        var look = new THREE.Vector3(0,0,0);
        this.camara.lookAt(look);

        //Añadir camara a escena
        this.add(this.camara);
        
        //Añadir cielo de fondo
        var loaderBackground = new THREE.TextureLoader();
        var backTexture = loaderBackground.load('./textures/sky_1.jpg');
        this.background = backTexture;

        //Control de camara con movimiento orbital (definido en TrackballControls)
        this.camaraControl = new THREE.TrackballControls(this.camara, this.renderizador.domElement);

        //Configuración de velocidades del TrackballControl
        this.camaraControl.rotateSpeed = 3;
        this.camaraControl.zoomSpeed = -2;
        this.camaraControl.panSpeed = 0.5;

        //Sobre qué debe orbitar
        this.camaraControl.target = look;
    }

    crearSuelo(scene){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/flatWorld/flatWorld.mtl", function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/flatWorld/flatWorld.obj", 
               function ( world ) {
                    // Add the loaded worldect to the scene
                    world.name = "world";
                    world.castShadow = true;
                    world.receiveShadow = true;
                    //world.scale.set(3,3,3);
                    world.position.y -= 2;
                    world.position.x = -110;
                    world.position.z = -110;
                    world.scale.set(1,1,4);
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

        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3( -400, -2, -400 ),
            new THREE.Vector3( -91, -2, -91 )
        ]);

        this.tiempo = new THREE.Clock();
        var that = this;
        this.animacionMundo = new TWEEN.Tween(this.path.getPointAt(0)).to(this.path.getPointAt(1), 4000*this.speed)
        .easing(TWEEN.Easing.Quadratic.In)
        .repeat(Infinity)
        .onStart(function(){
            that.tiempo.start();
        })
        .onUpdate(function(){
            var time = that.tiempo.getElapsedTime();
            var looptime = 4000*that.speed;
            var t = (time % looptime) / (4*that.speed);
            if( t <= 1 ){
                var posicion = that.path.getPointAt(t);
                that.getObjectByName("world").position.copy(posicion);
            }else{
                that.getObjectByName("world").position.copy(that.path.getPointAt(0));
                that.tiempo.start();
            }
        });
        
    }

    crearJugador(scene){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/aguacate/aguacate.mtl", function( materials ) {
            materials.preload();
            materials.name = "materialJugador";

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/aguacate/aguacate.obj", 
                function ( obj ) {
                    // Add the loaded object to the scene
                    obj.name = "jugador";
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    //obj.position.set(10,-0.1,10);
                    //obj.scale.set(2.5,2.5,2.5);
                    obj.rotation.y = 2*Math.PI/1.6;
                    scene.add( obj ); 
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del jugador' );
                },

                // onError callback
                function ( err ) {
                    console.error( 'Error cargando el modelo del jugador: ' + err );
                }
            );
        });
        var that = this;
        setTimeout(function(){
            //Animación jugador
        this.pathIdleJugador = new THREE.Vector3( that.getObjectByName("jugador").position.x, 0.1, that.getObjectByName("jugador").position.z );
        /* this.tiempoJugador = new THREE.Clock(); */
        this.animacionJugador = new TWEEN.Tween(that.getObjectByName("jugador").position).to(this.pathIdleJugador, 250*that.speed)
        .easing(TWEEN.Easing.Quadratic.In)
        .repeat(Infinity)
        .yoyo(true)
        .onStart(function(){
            /* that.tiempoJugador.start(); */
        })
        .onUpdate(function(){
            /* var time = that.tiempoJugador.getElapsedTime();
            var looptime = 1000;
            var t = (time % looptime) / 1;
            if( t <= 1 ){
                var posicion = that.pathIdleJugador.getPointAt(t);
                that.getObjectByName("jugador").position.copy(posicion);
            }else{
                that.getObjectByName("jugador").position.copy(that.pathIdleJugador.getPointAt(0));
                that.tiempoJugador.start();
            }  */
        }).start();

        var matFisico = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x888888, opacity:0, transparent: true}));
        that.colliderJugador = new Physijs.BoxMesh(new THREE.BoxGeometry(1,4,1), matFisico);
        that.colliderJugador.name = "colliderJugador";
        that.colliderJugador.position.set(10,0,10);
        that.colliderJugador.scale.set(2.5,2.5,2.5);
        that.colliderJugador.add(that.getObjectByName("jugador"));
        //Gestión de colisiones con el objeto jugador
        that.colliderJugador.addEventListener('collision', function(objeto){
            if(objeto.name == "Objetivo"){
                //Sumar puntos
                objeto.delete();
            }else if(objeto.name == "Cuchillo" || objeto.name == "Enemigo"){
                //Mensaje de GAME OVER
                this.delete();
            }
        });
        that.colliderJugador.addEventListener('keydown', handleKeyDown);
        scene.add(that.colliderJugador);
        }, 1000);
        
    }

    crearBarrera(){

    }

    handleKeyDown(keyEvent){
        switch( keyEvent.keyCode ) {
            case 37:
            // Left
                if(this.getObjectByName("colliderJugador").estado == "CENTRO"){

                }else if(this.getObjectByName("colliderJugador").estado == "DERECHA"){
                    
                }else{

                }
            break;
            case 39:
            // Right
                if(this.getObjectByName("colliderJugador").estado == "CENTRO"){

                }else if(this.getObjectByName("colliderJugador").estado == "IZQUIERDA"){
                    
                }else{
                    
                }
            break;
            case 38:
            // Up
            if(this.getObjectByName("colliderJugador").saltando == false){
                //puede saltar
            }else{
                //no salta
            }
            break;
            case 40:
            // Down
                
            break;
        }
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
        requestAnimationFrame(() => this.update());

        this.camaraControl.update();
        if(this.getObjectByName("world")){
            if(!this.mundoCargado){
                this.animacionMundo.start();
                this.mundoCargado = true;
            }
        }

        if(this.getObjectByName("jugador")){

           /*  var matFisico = Physijs.createMaterial(this.getObjectByName("materialJugador"));
           that.jugadorFisico = new Physijs.BoxMesh(this.getObjectByName("jugador").geometry, matFisico);
           */
        }
        this.simulate();
        TWEEN.update();

        this.renderizador.render(this, this.camara);
    }
}

$(function(){
    var escena = new Escena("#WebGL-output");

    window.addEventListener("resize", () => escena.onWindowResize());

    escena.update();
});