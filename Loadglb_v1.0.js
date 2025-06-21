const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const fileInput = document.getElementById("glbFileInput");

const createScene = async () => {
    const scene = new BABYLON.Scene(engine);
    // Add a default camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    // Add lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    // XR
    var xr = await scene.createDefaultXRExperienceAsync();

    return scene;
};

// Handle file input change event
fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        // Create a new scene for each file
        const scene = await createScene();
        console.log(file)
        // Load the GLB file
        BABYLON.SceneLoader.ImportMeshAsync("", "", file, scene, null, ".glb").then((result) => {
            // Scale and center the model if needed
            if (result.meshes && result.meshes.length > 0) {
                const rootMesh = result.meshes[0];
                const bounds = rootMesh.getHierarchyBoundingVectors();
                const size = bounds.max.subtract(bounds.min);
                const scale = 5 / Math.max(size.x, size.y, size.z);
                rootMesh.scaling = new BABYLON.Vector3(scale, scale, scale);

                const center = bounds.min.add(size.scale(0.5));
                rootMesh.position = center.negate();
            }
        }).catch((error) => {
            console.error("Error loading GLB file:", error);
        });
    }
});

// Run the engine
engine.runRenderLoop(() => {
    if (engine.scenes.length > 0) {
        engine.scenes[0].render();
    }
});

// Resize the engine on window resize
window.addEventListener("resize", () => {
    engine.resize();
});
