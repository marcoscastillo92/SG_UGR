class Objeto extends THREE.Object3D{
    constructor(gui,titleGui,numObj){
        super();
        this.numObjC = numObj;
        this.createGUI(gui,titleGui,numObj);

        var geoObjeto;

        switch (numObj){
            case 0: geoObjeto = new THREE.BoxGeometry(1,1,1); break;
            case 1: geoObjeto = new THREE.ConeGeometry(1,1,3); break;
            case 2: geoObjeto = new THREE.CylinderGeometry(1,1,3); break;
            case 3: geoObjeto = new THREE.IcosahedronGeometry(1,0); break;
            case 4: geoObjeto = new THREE.TorusGeometry(1,0.4); break;
            case 5: geoObjeto = new THREE.SphereGeometry(1,3,2); break;
        }
         
        var matObjeto = new THREE.MeshNormalMaterial;
        this.objMaterial = matObjeto;

        this.objeto = new THREE.Mesh(geoObjeto,matObjeto);
        this.objeto.flatShading = true;
        this.objeto.needsUpdate = true;
        
        this.eje = new THREE.AxesHelper(3);
        this.eje.add(this.objeto);
        this.add(this.eje);

        switch (numObj){
            case 0: this.eje.position.set(6,0,0); break; //box
            case 1: this.eje.position.set(0,0,6); break; //cone
            case 2: this.eje.position.set(0,6,0); break; //cylinder
            case 3: this.eje.position.set(6,6,0); break; //icosahedron
            case 4: this.eje.position.set(0,6,6); break; //torus
            case 5: this.eje.position.set(0,-6,0); break; //sphere
        }
    }

    createGUI(gui,titleGui,numObj){
        this.guiControls = new function(){
            switch(numObj){
                case 0: //box
                    this.sizeX = 1.0;
                    this.sizeY = 1.0;
                    this.sizeZ = 1.0;
                    break;
                
                case 1: //cone
                    this.coneRadius = 1;
                    this.coneHeight = 1;
                    this.coneRes = 3;
                    break;

                case 2: //cylinder
                    this.cylSupRad = 1;
                    this.cylInfRad = 1;
                    this.cylHeight = 1;
                    this.cylRes = 3;
                    break;

                case 3: //icosaedro
                    this.icoRad = 1;
                    this.icoSubdiv = 0;
                    break;

                case 4: //toro
                    this.toroRadPrin = 1;
                    this.toroRadTubo = 0.2;
                    this.toroRes = 3;
                    this.toroTuboRes = 3;
                    break;

                case 5: //sphere
                    this.spRad = 1;
                    this.spEcuRes = 3;
                    this.spMerRes = 2;
                    break;
            }
            

            this.reset = function(){
                switch(numObj){
                    case 0: //box
                        this.sizeX = 1.0;
                        this.sizeY = 1.0;
                        this.sizeZ = 1.0;
                        break;
                    
                    case 1: //cone
                        this.coneRadius = 1;
                        this.coneHeight = 1;
                        this.coneRes = 3;
                        break;

                    case 2: //cylinder
                        this.cylSupRad = 1;
                        this.cylInfRad = 1;
                        this.cylHeight = 1;
                        this.cylRes = 3;
                        break;

                    case 3: //icosaedro
                        this.icoRad = 1;
                        this.icoSubdiv = 0;
                        break;

                    case 4: //toro
                        this.toroRadPrin = 1;
                        this.toroRadTubo = 0.2;
                        this.toroRes = 3;
                        this.toroTuboRes = 3;
                        break;

                    case 5: //sphere
                        this.spRad = 1;
                        this.spEcuRes = 3;
                        this.spMerRes = 2;
                        break;
                }
            }
        }

        var carpeta = gui.addFolder(titleGui);

        var that = this;
        switch(numObj){
            case 0: //box
                carpeta.add(this.guiControls, 'sizeX', 0.1, 2, 0.1).name('Tamaño en X: ').onChange(function (valor){
                    that.objeto.scale.set(that.guiControls.sizeX,that.guiControls.sizeY,that.guiControls.sizeZ);
                }).listen();
                carpeta.add(this.guiControls, 'sizeY', 0.1, 2, 0.1).name('Tamaño en Y: ').onChange(function (valor){
                    that.objeto.scale.set(that.guiControls.sizeX,valor,that.guiControls.sizeZ);
                }).listen();
                carpeta.add(this.guiControls, 'sizeZ', 0.1, 2, 0.1).name('Tamaño en Z: ').onChange(function (valor){
                    that.objeto.scale.set(that.guiControls.sizeX,that.guiControls.sizeY,valor);
                }).listen();

                carpeta.add(this.guiControls, 'reset').name('Por defecto');
                break;
            
            case 1: //cone
                carpeta.add(this.guiControls, 'coneRadius', 0.1, 2, 0.1).name('Radio: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.ConeGeometry(that.coneRadius,that.coneHeight,that.coneRes);
                }).listen();
                carpeta.add(this.guiControls, 'coneHeight', 0.1, 2, 0.1).name('Altura: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.ConeGeometry(that.coneRadius,that.coneHeight,that.coneRes);
                }).listen();
                carpeta.add(this.guiControls, 'coneRes', 3, 20, 1).name('Resolución: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.ConeGeometry(that.coneRadius,that.coneHeight,that.coneRes);
                }).listen();

                carpeta.add(this.guiControls, 'reset').name('Por defecto');
                break;

            case 2: //cylinder
                carpeta.add(this.guiControls, 'cylSupRad', 0.2, 2, 0.1).name('Radio superior: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.CylinderGeometry(that.cylSupRad,that.cylInfRad,that.cylHeight,this.cylRes);
                }).listen();
                carpeta.add(this.guiControls, 'cylInfRad', 0.2, 2, 0.1).name('Radio inferior: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.CylinderGeometry(that.cylSupRad,that.cylInfRad,that.cylHeight,this.cylRes);
                }).listen();
                carpeta.add(this.guiControls, 'cylHeight', 0.1, 2, 0.1).name('Altura: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.CylinderGeometry(that.cylSupRad,that.cylInfRad,that.cylHeight,this.cylRes);
                }).listen();
                carpeta.add(this.guiControls, 'cylRes', 3, 20, 1).name('Resolución: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.CylinderGeometry(that.cylSupRad,that.cylInfRad,that.cylHeight,this.cylRes);
                }).listen();

                carpeta.add(this.guiControls, 'reset').name('Por defecto');
                break;

            case 3: //icosaedro
                carpeta.add(this.guiControls, 'icoRad', 0.1, 2, 0.1).name('Radio: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.IcosahedronGeometry(that.icoRad,that.icoSubdiv);
                }).listen();
                carpeta.add(this.guiControls, 'icoSubdiv', 0, 3, 1).name('Resolución: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.IcosahedronGeometry(that.icoRad,that.icoSubdiv);
                }).listen();

                carpeta.add(this.guiControls, 'reset').name('Por defecto');
                break;

            case 4: //toro
                carpeta.add(this.guiControls, 'toroRadPrin', 0.2, 2, 0.1).name('Radio principal: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.TorusGeometry(that.toroRadPrin,that.toroRadTubo,that.toroRes,that.toroTuboRes);
                }).listen();
                carpeta.add(this.guiControls, 'toroRadTubo', 0.2, 1, 0.1).name('Radio tubo: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.TorusGeometry(that.toroRadPrin,that.toroRadTubo,that.toroRes,that.toroTuboRes);
                }).listen();
                carpeta.add(this.guiControls, 'toroRes', 3, 20, 1).name('Resolución toro: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.TorusGeometry(that.toroRadPrin,that.toroRadTubo,that.toroRes,that.toroTuboRes);
                }).listen();
                carpeta.add(this.guiControls, 'toroTuboRes', 3, 20, 1).name('Resolución tubo: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.TorusGeometry(that.toroRadPrin,that.toroRadTubo,that.toroRes,that.toroTuboRes);
                }).listen();

                carpeta.add(this.guiControls, 'reset').name('Por defecto');
                break;

            case 5: //sphere
                carpeta.add(this.guiControls, 'spRad', 0.1, 2, 0.1).name('Radio: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.SphereGeometry(that.spRad,that.spEcuRes,that.spMerRes);
                }).listen();
                carpeta.add(this.guiControls, 'spEcuRes', 3, 20, 1).name('Resolución ecuador: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.SphereGeometry(that.spRad,that.spEcuRes,that.spMerRes);
                }).listen();
                carpeta.add(this.guiControls, 'spMerRes', 2, 10, 1).name('Resolución meridiano: ').onChange(function (valor){
                    that.objeto.geometry = new THREE.SphereGeometry(that.spRad,that.spEcuRes,that.spMerRes);
                }).listen();

                carpeta.add(this.guiControls, 'reset').name('Por defecto');
                break;
        }
    }

    update(){
        switch(this.numObjC){
            case 0: //box
                //this.objeto.scale.set(this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);
                break;
            
            case 1: //cone
                this.coneRadius = this.guiControls.coneRadius;
                this.coneHeight = this.guiControls.coneHeight;
                this.coneRes = this.guiControls.coneRes;            
                break;

            case 2: //cylinder
                this.cylSupRad = this.guiControls.cylSupRad;
                this.cylInfRad = this.guiControls.cylInfRad;
                this.cylHeight = this.guiControls.cylHeight;
                this.cylRes = this.guiControls.cylRes;
                break;

            case 3: //icosaedro
                this.icoRad = this.guiControls.icoRad;
                this.icoSubdiv = this.guiControls.icoSubdiv;
                break;

            case 4: //toro
                this.toroRadPrin = this.guiControls.toroRadPrin;
                this.toroRadTubo = this.guiControls.toroRadTubo;
                this.toroRes = this.guiControls.toroRes;
                this.toroTuboRes = this.guiControls.toroTuboRes;
                break;

            case 5: //sphere
                this.spRad = this.guiControls.spRad;
                this.spEcuRes = this.guiControls.spEcuRes;
                this.spMerRes = this.guiControls.spMerRes;
                break;
        }

        this.objeto.rotation.y+=0.01;
        this.objeto.rotation.z+=0.01;
        this.objeto.rotation.x+=0.01;
    }
}