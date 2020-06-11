class Escena extends Physijs.Scene{
    constructor(myCanvas){
        //Inicialización de variables de motor de físicas
        Physijs.scripts.worker = './libs/physijs_worker.js';
        Physijs.scripts.ammo = './ammo.js';

        super();
        //Variables
        this.speed = 1; //fast...slow [0.1 ... n]
        this.mundoCargado = false;
        this.inicio = true
        this.nuevosObjetos = new Array();
        this.velocidad = new THREE.Vector3(35,0,35);
        this.isPaused = false;
        this.objectPositions = [new THREE.Vector3(-180,3,-180), new THREE.Vector3(-172,3,-180), new THREE.Vector3(-192,3,-180)];
        this.prefabs = ["manzana", "cuchillo", "donut"];
        this.contadorPrefabs = {"manzana": 0, "cuchillo": 0, "donut": 0};
        this.countFrames = 0;
        this.points = 0;
        this.gameOver = false;
        this.everyXFrames = 120;
        this.contadorObstaculosEsquivados = 0;
        this.everyFramesInstance = 20;
        this.everyPointsSpeed = 10;
        this.addSecondsTimer = 7; //Añade 5 segundos por cada manzana recogida
        this.timer = 60 * 45; //60 fps * 45 segundos (fotogramas de tiempo)
        this.primeraMuerte = false;

        //Gravedad
        this.setGravity(new THREE.Vector3(0,-20,0));

        //Materiales
        this.matFisico = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x888888, opacity:0, transparent: true}),0,0);
        this.matFisicoJugador = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x888888, opacity:0, transparent: true}),10000,0);

        //Render
        this.renderizador = this.crearRenderizador(myCanvas);

        //Creación del entorno
        this.crearLuces();
        this.crearCamara();
        this.crearSuelo(this);
        this.crearBarrera();

        //Crear jugador y añadirlo a escena
        this.crearJugador(this);       

    }

    crearCamara(){
        //Creación de niebla
        this.fog = new THREE.FogExp2( 0xf0fff0, 0.003 );
        this.fog = new THREE.Fog( 0xF0F0F0, 10, 300 );

        //Definicion de la camara
        this.camara = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,0.1,1000);
        //Posicionamiento de la camara (VRP)
        this.camara.position.set(22,12,22);

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

    //Crea el suelo de la escena y su animación en bucle infinito
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
        setTimeout(function(){            
            that.animacionMundo = new TWEEN.Tween(that.path.getPointAt(0)).to(that.path.getPointAt(1), 4000*that.speed)
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
                    that.getObjectByName("collider_world").__dirtyPosition = true;
                    var posicion = that.path.getPointAt(t);
                    that.getObjectByName("collider_world").position.copy(posicion);
                }else{
                    that.getObjectByName("collider_world").__dirtyPosition = true;
                    that.getObjectByName("collider_world").position.copy(that.path.getPointAt(0));
                    that.tiempo.start();
                }
            }).start(); 

            that.colliderWorld = new Physijs.BoxMesh(new THREE.BoxGeometry(70,1,400),that.matFisico,0,0);
            that.colliderWorld.name = "collider_world";
            that.colliderWorld.position.set(-110,-2,-110);
            that.colliderWorld.scale.set(1,1,4);
            that.colliderWorld.rotation.y=2*Math.PI/1.6;
            that.colliderWorld.add(that.getObjectByName("world"));
            scene.add(that.colliderWorld);
        }, 1000);
        
    }

    //Creación del modelo del jugador y su collider
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
                    obj.scale.set(1,1.3,1);
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
        //Función que añade el collider al jugador
        setTimeout(function(){
            that.colliderJugador = new Physijs.BoxMesh(new THREE.BoxGeometry(1.5,4,1),that.matFisicoJugador,1000);
            that.colliderJugador.name = "collider_jugador";
            that.colliderJugador.position.set(10,2,10);
            that.colliderJugador.scale.set(2.5,2,2.5);
            that.colliderJugador.rotation.y = 2*Math.PI/1.6;
            that.colliderJugador.add(that.getObjectByName("jugador"));
            //Gestión de colisiones con el objeto jugador
            that.colliderJugador.addEventListener('collision', function(objeto){
                console.log("COLISION JUGADOR: "+objeto.name)
                var item = objeto.name.split("_");
                if(item[1] == "manzana"){
                    //Sumar puntos
                    that.points += 5;
                    that.timer += 60 * that.addSecondsTimer; //añade 3 segundos
                    //Aumento de dificultad relativa a los puntos
                    if(that.points % that.everyPointsSpeed == 0){
                        that.velocidad.x += 5;
                        that.velocidad.z += 5;
                        if(that.points % that.everyFramesInstance && that.everyXFrames >= 60){
                            that.everyXFrames -= 10;
                        }
                    }
                    document.getElementById("marcador").innerHTML = "Puntuación: "+that.points;
                    that.remove(that.getObjectByName(objeto.name));
                }else if(item[1] != "world"){
                    if(that.primeraMuerte){
                        that.gameOver = true;
                        that.remove(that.getObjectByName("collider_jugador"));
                    }else{
                        that.remove(that.getObjectByName(objeto.name));
                        that.primeraMuerte = true;
                        that.avisoSegundaOportunidad();
                    }
                }
            });
            that.colliderJugador.localizacion = "CENTRO";
            that.colliderJugador.puedeSaltar = true;
            scene.add(that.colliderJugador);
            
            that.animacionesSalto();
        }, 1000);
    }

    //Animaciones IDLE y de salto del jugador (una de subida y otra de bajada)
    animacionesSalto(){
        var that = this;

        //Animación IDLE jugador
        this.pathIdleJugador = new THREE.Vector3( this.getObjectByName("jugador").position.x, 0.1, this.getObjectByName("jugador").position.z );
        this.animacionJugador = new TWEEN.Tween(this.getObjectByName("jugador").position).to(this.pathIdleJugador, 250*this.speed)
        .easing(TWEEN.Easing.Quadratic.In)
        .repeat(Infinity)
        .yoyo(true)
        .start();

        //Animación salto primera parte jugador
        this.pathSaltoJugadorUp = new THREE.Vector3( this.getObjectByName("collider_jugador").position.x, 10, this.getObjectByName("collider_jugador").position.z );
        this.animacionSalto = new TWEEN.Tween(this.getObjectByName("collider_jugador").position).to(this.pathSaltoJugadorUp, 500*this.speed)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(function(){
            that.colliderJugador.__dirtyPosition = true;
        });

        //Animación salto segunda parte jugador
        this.pathSaltoJugadorDown = new THREE.Vector3( this.getObjectByName("collider_jugador").position.x, 2.1, this.getObjectByName("collider_jugador").position.z );
        this.animacionSaltoDown = new TWEEN.Tween(this.getObjectByName("collider_jugador").position).to(this.pathSaltoJugadorDown, 500*this.speed)
        .easing(TWEEN.Easing.Quadratic.In)
        .onComplete(function(){
            that.colliderJugador.__dirtyPosition = true;
            that.colliderJugador.puedeSaltar = true;
        });

        this.animacionSalto.chain(this.animacionSaltoDown);
    }

    //Lógica de movimiento del jugador
    moverJugador(event) {
        var keyCode = event.which;
        // W (Salto)
        if (keyCode == 87 || keyCode == 38) {
            if(this.colliderJugador.puedeSaltar){
                this.colliderJugador.puedeSaltar = false;
                var that = this;
                this.animacionesSalto();
                this.animacionSalto.start().onComplete(function(){that.animacionSaltoDown.start();});
            }
            // S (SIN FUNCIONALIDAD AUN)
        } else if (keyCode == 83 || keyCode == 40) {
            // A (Izquierda)
        } else if (keyCode == 65 || keyCode == 37) {
            if(this.colliderJugador.localizacion == "CENTRO" && this.colliderJugador.puedeSaltar){
                this.colliderJugador.localizacion = "IZQUIERDA";
                this.colliderJugador.setLinearVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.setAngularVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.__dirtyPosition = true;
                this.colliderJugador.position.set(5,2.4,15);
            }else if(this.colliderJugador.localizacion == "DERECHA" && this.colliderJugador.puedeSaltar){
                this.colliderJugador.localizacion = "CENTRO";
                this.colliderJugador.setLinearVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.setAngularVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.__dirtyPosition = true;
                this.colliderJugador.position.set(10,2.4,10);
            }
            // D (Derecha)
        } else if (keyCode == 68 || keyCode == 39) {
            if(this.colliderJugador.localizacion == "CENTRO" && this.colliderJugador.puedeSaltar){
                this.colliderJugador.localizacion = "DERECHA";
                this.colliderJugador.setLinearVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.setAngularVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.__dirtyPosition = true;
                this.colliderJugador.position.set(15,2.4,5);
                
            }else if(this.colliderJugador.localizacion == "IZQUIERDA" && this.colliderJugador.puedeSaltar){
                this.colliderJugador.localizacion = "CENTRO";
                this.colliderJugador.setLinearVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.setAngularVelocity(new THREE.Vector3(0,0,0));
                this.colliderJugador.__dirtyPosition = true;
                this.colliderJugador.position.set(10,2.4,10);
            }
            // SPACE (DEBUG STOP GAME)
        } else if (keyCode == 32) {
            this.isPaused = !this.isPaused;
        }
    };
    
    //Generador común de prefabs de forma parametrizada
    instanciarPrefab(scene,prefab,cuenta,posicion){
        var that = this;
        var nombre = prefab+"_"+cuenta;
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load( "models/"+prefab+"/"+prefab+".mtl", function( materials ) {
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setMaterials( materials );
            loader.load("models/"+prefab+"/"+prefab+".obj", 
                function ( obj ) {
                    // Add the loaded object to the scene
                    obj.name = nombre;
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    if(prefab == "cuchillo"){
                        obj.scale.set(0.4,0.2,0.4);
                        obj.rotation.set(3.2,1,0);
                        obj.position.set(0,2.6,0);
                    }else if(prefab == "manzana"){
                        obj.scale.set(0.3,0.15,0.3);
                        obj.rotation.y = 1.6;
                        obj.position.y = 0.3;
                    }else if(prefab == "donut"){
                        obj.scale.set(18,18,18);
                    }
                    scene.add( obj );
                },

                // onProgress callback
                function ( xhr ) {
                    console.log( (xhr.loaded / xhr.total * 100) + '% cargado del '+prefab );
                },

                // onError callback
                function ( err ) {
                    console.error( 'Error cargando el modelo del '+prefab+': ' + err );
                }
            );
        });

         var that = this;
         //Función que utiliza variables declaradas dinámicamente para asignar un collider a cada objeto creado.
        setTimeout(function(){
            var masa = 0.1;
            that['collider_'+nombre] = new Physijs.BoxMesh(new THREE.BoxGeometry(1,0.5,1), that.matFisico, masa);
            that['collider_'+nombre].name = "collider_"+nombre;
            that['collider_'+nombre].position.x = posicion.x;
            that['collider_'+nombre].position.y = posicion.y;
            that['collider_'+nombre].position.z = posicion.z;
            if(prefab == "cuchillo"){
                that['collider_'+nombre].scale.set(5,15,5);
            }else if(prefab == "manzana"){
                that['collider_'+nombre].scale.set(5,10,5);
            }else if(prefab == "donut"){
                that['collider_'+nombre].scale.set(2.5,2.5,2.5);
            }
            that['collider_'+nombre].add(that.getObjectByName(nombre));
            that['collider_'+nombre].__dirtyPosition = true;
            that.nuevosObjetos.push(that['collider_'+nombre]);
            scene.add(that['collider_'+nombre]);
        }, 1000); 

    }

    //Crea la barrera que elimina los objetos que pasan al jugador
    crearBarrera(){
        var matFisicoBarrera = Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0x888888, opacity: 0.2, transparent: true}));
        this.colliderBarrera = new Physijs.BoxMesh(new THREE.BoxGeometry(2,4,0.2), matFisicoBarrera,0,.1);
        this.colliderBarrera.name = "collider_barrera";
        this.colliderBarrera.position.set(50,2,50);
        this.colliderBarrera.rotation.y = 0.77;
        this.colliderBarrera.scale.set(20,20,20);
        //Gestión de colisiones con el objeto jugador
        var that = this;
        this.colliderBarrera.addEventListener('collision', function(objeto){
            that.contadorObstaculosEsquivados++;
            that.getObjectByName(objeto.name).setAngularVelocity(new THREE.Vector3(1,0,1));
            that.getObjectByName(objeto.name).setLinearVelocity(new THREE.Vector3(100,0,100));
            that.remove(that.getObjectByName(objeto.name));
        });
        this.add(this.colliderBarrera);
    }

    //Obtiene posiciones y prefabs aleatorios [0..2]
    instanciadorAleatorio(){
        var posicion = this.objectPositions[Math.round(Math.random()*2)];
        var prefab = this.prefabs[Math.round(Math.random()*2)];
        this.instanciarPrefab(this,prefab,++this.contadorPrefabs[prefab],posicion);
    }

    //Crea la iluminación de la escena
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

    //Render de la escena
    crearRenderizador(myCanvas){
        var renderizador = new THREE.WebGLRenderer({alpha:true});
        
        renderizador.setClearColor(new THREE.Color(0xEEEEEE),1.0);

        renderizador.setSize(window.innerWidth,window.innerHeight);
        renderizador.shadowMap.enabled = true;
        renderizador.shadowMap.type = THREE.PCFSoftShadowMap;

        $(myCanvas).append(renderizador.domElement);
        
        return renderizador;
    }

    //Controla el evento de cambio de tamaño de la ventana
    onWindowResize(){
        this.camara.aspect = window.innerWidth/window.innerHeight;
        this.camara.updateProjectionMatrix();

        this.renderizador.setSize(window.innerWidth,window.innerHeight);
    }

    //Fn que da movimiento a los objetos nuevos añadidos a escena y los elimina del array para no aplicarles más veces la velocidad
    iniciarMovimiento(){
        if(this.nuevosObjetos.length > 0){
            var that = this;
            this.nuevosObjetos.forEach(function(element,index, object){
                element.setCcdMotionThreshold(1);
                element.setCcdSweptSphereRadius(0.2);
                element.setLinearVelocity(that.velocidad);
                object.splice(index,1);
            });
        }
        
    }

    avisoSegundaOportunidad(){
        document.getElementById("vidas").innerHTML = "Vidas: 0";
        document.getElementById("vidas").style.color = "red";
    }

    //Muestra el resumen de puntuación y pausa las físicas y animaciones
    showResume(){
        document.getElementById("obstaculos").innerHTML = this.contadorObstaculosEsquivados;
        document.getElementById("puntuacion").innerHTML = this.points;
        document.getElementById("resumen").style.display = "block";
        if(this.timer == 0){
            document.getElementById("warningTiempo").style.display = "inline";
        }
        this.isPaused = true;
    }

    update(){
        requestAnimationFrame(() => this.update());
        this.iniciarMovimiento();

        this.camaraControl.update();
        this.renderizador.render(this, this.camara);
        //Si la partida ha acabado
        if(this.gameOver || this.timer == 0){
            if(this.primeraMuerte){
                this.showResume();
            }
        }
        //Si el juego está pausado no se actualiza la simulación de física ni las animaciones
        if(!this.isPaused){
            TWEEN.update();
            this.simulate();
            this.countFrames++;
            this.timer--;
            var tiempoRestante = parseInt(this.timer/60)
            document.getElementById("tiempo").innerHTML = "Tiempo: " +tiempoRestante;
            if(tiempoRestante < 20){
                document.getElementById("tiempo").style.color = "red";
            }else{
                document.getElementById("tiempo").style.color = "black";
            }
            //Llama al instanciador aleatorio cada X frames (120 frames +- 2 segundos)
            if(this.countFrames % this.everyXFrames == 0){
                this.countFrames = 1; //Para que no desborde
                this.instanciadorAleatorio();
            }
        }
    }
}

$(function(){
    this.escena = new Escena("#WebGL-output");

    window.addEventListener("resize", () => this.escena.onWindowResize());

    document.onkeydown = handleKeyDown;

    this.escena.update();
});

function handleKeyDown(keyEvent){
    this.escena.moverJugador(keyEvent);
} 
