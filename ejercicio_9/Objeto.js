class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.createGUI(gui,titleGui);

        this.incrementoSup = 0;
        this.positivo = true;
        this.incrementoInf = 0;
        this.positivoInf = true;
        this.altura = 5.0;
        this.anchura = 0.5;

        var material1 = new THREE.MeshPhongMaterial({color: 0xFF0000});
        var geom = new THREE.BoxGeometry (this.anchura,this.altura,this.anchura);
        geom.translate(0,-this.altura/2,0);
        this.cajaSup = new THREE.Mesh (geom, material1);
        this.cajaSup.scale.y = this.guiControls.escalaSup;

        var geom2 = new THREE.BoxGeometry(0.4,this.altura,0.25);
        geom2.translate(0,-this.altura/2,0);
        var material2 = new THREE.MeshPhongMaterial({color: 0x00FF00});
        this.cajaInf =  new THREE.Mesh (geom2, material2);
        this.cajaInf.position.y = -this.altura*this.guiControls.escalaSup;
        this.cajaInf.rotation.z = this.guiControls.rotacionInf;
        this.cajaInf.scale.y = this.guiControls.escalaInf;
        this.cajaInf.position.z = 0.375;

        this.rotation.z = this.guiControls.rotacionSup;
        this.add (this.cajaSup);
        this.add (this.cajaInf);
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.escalaSup = 1.0;
            this.rotacionSup = 0.0;
            this.escalaInf = 1.0;
            this.rotacionInf = 0.0;
            this.posicionInf = 0.0;
            this.animacionSup = false;
            this.velAnimSup = 0.0;
            this.animacionInf = false;
            this.velAnimInf = 0.0;

            this.reset = function () {
                this.escalaSup = 1.0;
                this.rotacionSup = 0.0;
                this.escalaInf = 1.0;
                this.rotacionInf = 0.0;
                this.posicionInf = 0.0;
                this.animacionSup = false;
                this.velAnimSup = 0.0;
                this.animacionInf = false;
                this.velAnimInf = 0.0;
            }
        }

        var that = this;
        var carpeta = gui.addFolder (titleGui);
        carpeta.add (this.guiControls, 'escalaSup', 1.0, 2.0, 0.1).name ('Escala superior : ').listen();
        carpeta.add (this.guiControls, 'rotacionSup', -0.5, 0.5, 0.1).name ('Rotacion superior : ').listen();
        carpeta.add (this.guiControls, 'escalaInf', 1.0, 2.0, 0.1).name ('Escala inferior : ').listen();
        carpeta.add (this.guiControls, 'rotacionInf', -0.5, 0.5, 0.1).name ('Rotación inferior : ').listen();
        carpeta.add(this.guiControls, 'posicionInf', 0, 1, 0.1).name('Posición %: ').listen();

        var animCarp = gui.addFolder ("Animación");
        animCarp.add(this.guiControls, 'animacionSup').name('Animación 1: ').onChange(function (valor){
            that.animacionSup = valor;
        }).listen();
        animCarp.add(this.guiControls, 'velAnimSup', 0, 1, 0.1).name('Velocidad 1: ').listen();
        animCarp.add(this.guiControls, 'animacionInf').name('Animación 2: ').onChange(function (valor){
            that.animacionInf = valor;
        }).listen();
        animCarp.add(this.guiControls, 'velAnimInf', 0, 1, 0.1).name('Velocidad 2: ').listen();
        
        carpeta.add (this.guiControls, 'reset').name ('[ Reset ]');
    }

    update(){
        this.cajaSup.scale.y = this.guiControls.escalaSup;

        this.cajaInf.position.y = -(this.altura*this.guiControls.escalaSup)+(this.guiControls.posicionInf*this.altura/3)+this.altura/4;
        this.cajaInf.rotation.z = this.guiControls.rotacionInf;
        this.cajaInf.scale.y = this.guiControls.escalaInf;

        this.rotation.z = this.guiControls.rotacionSup;

        if(this.animacionSup){
            if(this.guiControls.rotacionSup >= 0.5){
                this.positivo = false;
                this.incrementoSup = -this.guiControls.velAnimSup;
            }else if(this.guiControls.rotacionSup == 0 && !this.positivo){
                this.incrementoSup = -this.guiControls.velAnimSup;
            }else if(this.guiControls.rotacionSup == 0 && this.positivo){
                this.incrementoSup = this.guiControls.velAnimSup;
            }else if(this.guiControls.rotacionSup <= -0.5){
                this.positivo = true;
                this.incrementoSup = this.guiControls.velAnimSup;
            }
            this.guiControls.rotacionSup += (this.incrementoSup/50);
        }
        if(this.animacionInf){
            if(this.guiControls.rotacionInf >= 0.5){
                this.positivoInf = false;
                this.incrementoInf = -this.guiControls.velAnimInf;
            }else if(this.guiControls.rotacionInf == 0 && !this.positivo){
                this.incrementoInf = -this.guiControls.velAnimInf;
            }else if(this.guiControls.rotacionInf == 0 && this.positivo){
                this.incrementoInf = this.guiControls.velAnimInf;
            }else if(this.guiControls.rotacionInf <= -0.5){
                this.positivoInf = true;
                this.incrementoInf = this.guiControls.velAnimInf;
            }
            this.guiControls.rotacionInf += (this.incrementoInf/50);
        }
    }
}
