import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import Button from "@mui/material/Button";

// cribbed from: https://codepen.io/matteobruni/pen/ZEWbYzj

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
        color: { value: "#000000" }, // black is better I think
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 160, //this might be too much
          density: {
            enable: true,
            area: 800,
          },
        },
        color: {
          value: "#ff0000",
          animation: {
            enable: true,
            speed: 20,
            sync: true,
          },
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.5,
        },
        size: {
          value: 4,
          random: true,
          animation: {
            enable: false,
          },
        },
        links: {
          enable: true,
          distance: 100,
          color: "#ffffff", // White lines connecting particles
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: zoomEffect ? 10 : 6, // Speed up on zoom effect
          direction: "none",
          outModes: { default: "out" },
          random: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
          onClick: {
            enable: true,
            mode: "push",
          },
        },
        modes: {
          repulse: { distance: 200 },
          push: { quantity: 4 },
        },
      },
      detectRetina: true,
    }),
    [zoomEffect]
  );

  // TODO: Change button and what it does
  const handleZoomEffect = () => {
    setZoomEffect(true);
    setTimeout(() => setZoomEffect(false), 1000); 
  };

  if (!init) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading particles...</div>;
  }

  return (
    <div style={{ position: "relative", height: "100%", width: "100%", backgroundColor: "#000000" }}>
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
          color: "#000000",
        }}
      >
        Zoom In
      </Button>
    </div>
  );
};

export default ClassesPage;
