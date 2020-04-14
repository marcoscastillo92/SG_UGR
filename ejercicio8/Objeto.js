class Objeto extends THREE.Object3D{
    constructor(gui,titleGui){
        super();
        this.createGUI(gui,titleGui);

        this.angSaltos = 0;

        var esferaGeom = new THREE.SphereGeometry(1,32,32);
        var esferaGeom2 = new THREE.SphereGeometry(0.5,32,32);

        var material = new THREE.MeshPhongMaterial({color: 0xFF0000});
        var material2 = new THREE.MeshPhongMaterial({color: 0x00FF00});

        var marcas = 12;

        var mergedGeom = new THREE.Geometry();
        this.radio = 4;
        var i = 0;
        do{
          var angulo = i * Math.PI / marcas * 2;
          esferaGeom.translate(Math.cos(angulo) * this.radio, Math.sin(angulo) * this.radio,0);
          THREE.GeometryUtils.merge(mergedGeom, esferaGeom);
          i++;
        }while(i <= marcas)
        this.esfera = new THREE.Mesh(mergedGeom, material);
        this.esfera.rotation.x = - Math.PI / 2;
        this.esfera.position.z = 7.5;
        this.esfera.position.x = -1.8;
        
        this.puntero = new THREE.Mesh(esferaGeom2,material2);
        this.puntero.position.z = Math.cos(0) * (this.radio+1);
        this.puntero.position.x = Math.sin(0) * (this.radio+1)-1;

        this.add(this.esfera); 
        this.add(this.puntero);
    }

    createGUI(gui,titleGui){
        this.guiControls = new function(){
            this.saltos = 1;

            this.reset = function () {
                this.saltos = 1;
            }
        }

        var carpeta = gui.addFolder (titleGui);
        carpeta.add (this.guiControls, 'saltos', -12.0, 12.0, 1.0).name ('Saltos : ').listen();
        
        carpeta.add (this.guiControls, 'reset').name ('[ Reset ]');
    }

    update(){
        this.angSaltos += (this.guiControls.saltos * Math.PI / 12 * 2)/100;
        this.puntero.position.set(Math.cos(this.angSaltos) * this.radio, 0, Math.sin(this.angSaltos) * this.radio);
    }
}
