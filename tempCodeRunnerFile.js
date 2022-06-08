  loader.load('/models/port/port.glb', function (gltf) {
    
    mesh = gltf.scene.children[1];
    scene.add(mesh);
    
    model = gltf.scene;

    model.position.set( 2, -1, 26 );
    model.rotation.set(0, 0, 0);
    model.scale.set( 0.02, 0.02, 0.02 );
    modelY = model.position.y
    scene.add( model );
    animate();

  }, function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  }, undefined, function (e) {
    console.error(e);
  });