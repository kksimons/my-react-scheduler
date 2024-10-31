import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { type Container, type ISourceOptions, MoveDirection, OutMode } from "@tsparticles/engine";
import Button from "@mui/material/Button";

const ClassesPage = () => {
  const [init, setInit] = useState(false);
  const [zoomEffect, setZoomEffect] = useState(false);

  // Initialize particles once for performance
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles Loaded:", container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: { value: "#0d47a1" }, // Dark blue background for contrast
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: { value: "#ffffff" },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: MoveDirection.none,
          enable: true,
          outModes: { default: OutMode.out },
          random: false,
          speed: zoomEffect ? 10 : 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [zoomEffect]
  );

  const handleZoomEffect = () => {
    setZoomEffect(true);
    setTimeout(() => setZoomEffect(false), 1000);
  };

  if (!init) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading particles...</div>;
  }

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%", backgroundColor: "#0d47a1" }}>
      <Particles
        id="tsparticles"
        options={options}
        particlesLoaded={particlesLoaded}
        style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 1 }}
      />
      <Button
        variant="contained"
        onClick={handleZoomEffect}
        style={{
          position: "relative",
          zIndex: 2,
          margin: "20px",
          backgroundColor: "#ffffff",
          color: "#0d47a1",
        }}
      >
        Zoom In
      </Button>
    </div>
  );
};

export default ClassesPage;
