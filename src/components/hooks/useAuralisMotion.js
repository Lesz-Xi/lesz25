import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useAuralisMotion(scopeRef) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return undefined;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cleanup = [];

      if (!reduced) {
        gsap.fromTo(
          "[data-auralis-rule]",
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              once: true,
            },
          }
        );

        gsap.utils.toArray("[data-auralis-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28, filter: "blur(8px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.05,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });

        const mantraWords = root.querySelectorAll("[data-mantra-word]");
        if (mantraWords.length) {
          if (reduced) {
            gsap.set(mantraWords, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          } else {
            const portraitTrigger = root.querySelector("[data-portrait-stand]") ?? mantraWords[0].closest(".portrait-mantra");

            gsap.set(mantraWords, { autoAlpha: 0, y: 52, filter: "blur(12px)" });
            gsap.set(mantraWords[0], { x: 20 });
            if (mantraWords.length > 1) gsap.set(mantraWords[1], { x: -20 });
            if (mantraWords.length > 2) gsap.set(mantraWords[2], { x: 16 });

            const wordTL = gsap.timeline({
              scrollTrigger: {
                trigger: portraitTrigger,
                start: "top 76%",
                end: "top 34%",
                scrub: 1.35,
                invalidateOnRefresh: true,
              },
            });

            [].forEach.call(mantraWords, (word, i) => {
              const label = i === 0 ? "start" : `>${0.08}`;
              wordTL.to(
                word,
                {
                  autoAlpha: 1,
                  y: 0,
                  x: 0,
                  filter: "blur(0px)",
                  duration: 0.32,
                  ease: "power2.out",
                },
                label
              );
            });
          }
        }

        gsap.utils.toArray("[data-auralis-card-group]").forEach((group) => {
          const cards = group.querySelectorAll("[data-auralis-card], [data-auralis-step]");
          if (!cards.length) return;

          gsap.set(cards, {
            y: 48,
            scale: 0.975,
            opacity: 0,
            rotateX: 2,
            transformPerspective: 900,
            transformOrigin: "center bottom",
          });

          gsap.timeline({
            scrollTrigger: {
              trigger: group,
              start: "top 94%",
              end: "top 42%",
              scrub: 1.25,
            },
          }).to(cards, {
            y: 0,
            scale: 1,
            opacity: 1,
            rotateX: 0,
            ease: "none",
            stagger: { each: 0.11, from: "start" },
          });
        });

        const roleEye = root.querySelector("[data-role-eye]");
        if (roleEye) {
          const eyeLines = roleEye.querySelectorAll(".role-eye-line");
          const cornea = roleEye.querySelector(".role-eye-cornea");
          const iris = roleEye.querySelector(".role-eye-iris");
          const irisMarks = roleEye.querySelectorAll(".role-eye-iris-mark");
          const highlight = roleEye.querySelector(".role-eye-highlight");
          const pupil = roleEye.querySelector(".role-eye-pupil");
          const nodes = roleEye.querySelectorAll("[data-role-eye-node]");
          const isDesktopEye = window.matchMedia("(min-width: 981px)").matches;

          if (isDesktopEye) {
            gsap.set(eyeLines, {
              autoAlpha: 0,
              scaleX: 0.62,
              transformOrigin: "center",
            });
            gsap.set([cornea, iris, highlight], { strokeDashoffset: 1 });
            gsap.set(irisMarks, { strokeDashoffset: 1 });
            gsap.set(cornea, { scale: 0.94, transformOrigin: "center" });
            gsap.set(iris, { rotate: -28, scale: 0.88, transformOrigin: "center" });
            gsap.set(pupil, { autoAlpha: 0, scale: 0.58, transformOrigin: "center" });
            gsap.set(nodes, { autoAlpha: 0, y: 28, filter: "blur(10px)" });

            const roleRevealDuration = 0.72;
            const roleHoldDuration = 0.92;
            const roleFinalHoldDuration = 1.35;
            const holdState = { value: 0 };

            const eyeTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: roleEye,
                start: "top top",
                end: "+=3800",
                scrub: 1.45,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            eyeTimeline
              .to(eyeLines, {
                autoAlpha: 1,
                scaleX: 1,
                duration: 0.62,
                ease: "none",
              })
              .to(cornea, {
                strokeDashoffset: 0,
                scale: 1,
                duration: 0.48,
                ease: "none",
              }, "<0.22")
              .to(iris, {
                strokeDashoffset: 0,
                rotate: 0,
                scale: 1,
                duration: 0.58,
                ease: "none",
              }, "<0.22")
              .to(irisMarks, {
                strokeDashoffset: 0,
                duration: 0.34,
                stagger: 0.06,
                ease: "none",
              }, "<0.28")
              .to(pupil, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.3,
                ease: "none",
              }, "<0.1")
              .to(highlight, {
                strokeDashoffset: 0,
                duration: 0.24,
                ease: "none",
              }, "<0.06");

            [].forEach.call(nodes, (node, index) => {
              const isLeft = node.classList.contains("role-eye-node--left");
              const isRight = node.classList.contains("role-eye-node--right");
              const startX = isLeft ? -32 : isRight ? 32 : 0;
              const startY = index === 1 ? -22 : 18;

              gsap.set(node, { x: startX, y: startY });

              eyeTimeline.to(node, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                filter: "blur(0px)",
                duration: roleRevealDuration,
                ease: "none",
              });

              eyeTimeline.to(holdState, {
                value: index + 1,
                duration: index < nodes.length - 1 ? roleHoldDuration : roleFinalHoldDuration,
                ease: "none",
              });
            });

            eyeTimeline.to(nodes, {
              opacity: 1,
              duration: 0.18,
              ease: "none",
            });
          }
        }

        const archiveRecords = root.querySelector("[data-archive-records]");
        if (archiveRecords) {
          const recordNodes = gsap.utils.toArray("[data-archive-record]", archiveRecords);
          const isDesktopArchive = window.matchMedia("(min-width: 981px)").matches;

          if (isDesktopArchive && recordNodes.length > 1) {
            let activeRecordIndex = 0;

            const setInactiveRecord = (record, direction = 1) => {
              gsap.set(record, {
                autoAlpha: 0,
                xPercent: direction >= 0 ? 16 : -16,
                scale: 0.995,
                filter: "none",
                pointerEvents: "none",
              });
            };

            const showArchiveRecord = (nextIndex, direction = 1) => {
              if (nextIndex === activeRecordIndex) return;

              gsap.killTweensOf(recordNodes);

              recordNodes.forEach((record, index) => {
                if (index === nextIndex) return;

                gsap.to(record, {
                  autoAlpha: 0,
                  xPercent: index < nextIndex ? -16 : 16,
                  scale: 0.995,
                  filter: "none",
                  pointerEvents: "none",
                  duration: 0.24,
                  ease: "power1.out",
                  overwrite: true,
                });
              });

              gsap.set(recordNodes[nextIndex], {
                autoAlpha: 1,
                xPercent: direction >= 0 ? 14 : -14,
                scale: 0.995,
                filter: "none",
                pointerEvents: "auto",
              });

              gsap.to(recordNodes[nextIndex], {
                xPercent: 0,
                scale: 1,
                duration: 0.42,
                ease: "power2.out",
                overwrite: true,
              });

              activeRecordIndex = nextIndex;
            };

            recordNodes.forEach((record) => setInactiveRecord(record));
            gsap.set(recordNodes[0], {
              autoAlpha: 1,
              xPercent: 0,
              scale: 1,
              filter: "none",
              pointerEvents: "auto",
            });

            ScrollTrigger.create({
              trigger: archiveRecords,
              start: "top top",
              end: () => `+=${Math.max(1280, (recordNodes.length - 1) * 520)}`,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const nextIndex = Math.min(
                  recordNodes.length - 1,
                  Math.max(0, Math.round(self.progress * (recordNodes.length - 1)))
                );

                showArchiveRecord(nextIndex, self.direction);
              },
            });
          }
        }

        gsap.utils.toArray("[data-auralis-image]").forEach((image) => {
          if (image.closest("[data-portrait-stand], [data-archive-records], [data-image-monograph-card]")) return;

          gsap.fromTo(
            image,
            { y: -10 },
            {
              y: 16,
              ease: "none",
              scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        });

        gsap.utils.toArray("[data-image-monograph-card]").forEach((card) => {
          gsap.set(card, {
            autoAlpha: 0,
            y: 42,
            scale: 0.982,
            filter: "blur(4px)",
            transformPerspective: 1200,
            transformOrigin: "center bottom",
          });

          const imageTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 50%",
              scrub: 1.85,
              invalidateOnRefresh: true,
            },
          });

          imageTimeline.to(card, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
          });
        });

        gsap.utils.toArray("[data-portrait-stand]").forEach((card) => {
          const image = card.querySelector("img");

          gsap.set(card, {
            autoAlpha: 0,
            y: 92,
            z: -120,
            rotateX: 13,
            scale: 0.94,
            filter: "blur(10px)",
            transformPerspective: 1200,
            transformOrigin: "center bottom",
          });

          if (image) {
            gsap.set(image, {
              y: 42,
              scale: 1.08,
              filter: "grayscale(0.42) contrast(0.96) brightness(0.88)",
            });
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 42%",
              scrub: 1.05,
              invalidateOnRefresh: true,
            },
          });

          timeline.to(card, {
            autoAlpha: 1,
            y: -24,
            z: 0,
            rotateX: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
          });

          if (image) {
            timeline.to(
              image,
              {
                y: 0,
                scale: 1,
                filter: "grayscale(0.28) contrast(1.04) brightness(1)",
                ease: "none",
              },
              0
            );
          }
        });

        const progress = root.querySelector("[data-auralis-spine-progress]");
        const timeline = root.querySelector("[data-auralis-timeline]");
        if (progress && timeline) {
          gsap.to(progress, {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 68%",
              end: "bottom 72%",
              scrub: 1.2,
            },
          });
        }

        gsap.utils.toArray("[data-auralis-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 70%",
            end: "bottom 60%",
            onToggle: (self) => step.classList.toggle("active", self.isActive),
          });
        });

      }

      root.querySelectorAll("[data-hero-particle-title]").forEach((stage) => {
        const canvas = stage.querySelector("canvas");
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const text = stage.getAttribute("data-particle-text") ?? "Hi,";
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pointer = { x: -10000, y: -10000, active: false };
        let particles = [];
        let frame = 0;
        let resizeTimer = 0;
        let settleTimer = 0;
        let resizeObserver = null;

        const colorFor = (particle, glow) => {
          if (particle.variant === "snow") return `rgba(255, 253, 247, ${0.88 + glow * 0.12})`;
          if (particle.tone > 0.82) return `rgba(245, 242, 235, ${0.78 + glow * 0.18})`;
          if (particle.tone > 0.56) return `rgba(199, 181, 128, ${0.62 + glow * 0.24})`;
          if (particle.tone > 0.24) return `rgba(154, 135, 104, ${0.58 + glow * 0.22})`;
          return `rgba(82, 76, 66, ${0.5 + glow * 0.28})`;
        };

        const draw = (time = 0) => {
          const width = canvas.width / dpr;
          const height = canvas.height / dpr;
          const tick = time * 0.001;

          context.clearRect(0, 0, width, height);

          const radius = Math.min(150, Math.max(92, width * 0.34));
          const radiusSq = radius * radius;

          particles.forEach((particle) => {
            if (!reduced) {
              if (pointer.active) {
                const dx = particle.x - pointer.x;
                const dy = particle.y - pointer.y;
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq < radiusSq && distanceSq > 0.5) {
                  const distance = Math.sqrt(distanceSq);
                  const force = (1 - distance / radius) * 2.4;
                  particle.vx += (dx / distance) * force;
                  particle.vy += (dy / distance) * force;
                }
              }

              particle.vx += (particle.homeX - particle.x) * 0.058;
              particle.vy += (particle.homeY - particle.y) * 0.058;
              particle.vx *= 0.82;
              particle.vy *= 0.82;
              particle.x += particle.vx;
              particle.y += particle.vy;
            } else {
              particle.x = particle.homeX;
              particle.y = particle.homeY;
            }

            const drift = Math.hypot(particle.x - particle.homeX, particle.y - particle.homeY);
            const glow = Math.min(1, drift / 32);
            const breath = reduced ? 0 : Math.sin(tick * 0.82 + particle.phase) * 0.16;

            context.fillStyle = colorFor(particle, glow);
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius + breath + glow * 0.42, 0, Math.PI * 2);
            context.fill();
          });

          if (!reduced) frame = requestAnimationFrame(draw);
        };

        const rasterize = () => {
          const rect = stage.getBoundingClientRect();
          const width = Math.max(2, Math.floor(rect.width));
          const height = Math.max(2, Math.floor(rect.height));

          if (width < 24 || height < 24) {
            window.clearTimeout(settleTimer);
            settleTimer = window.setTimeout(start, 140);
            return;
          }

          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          context.setTransform(dpr, 0, 0, dpr, 0, 0);

          const offscreen = document.createElement("canvas");
          offscreen.width = width;
          offscreen.height = height;
          const offscreenContext = offscreen.getContext("2d");
          if (!offscreenContext) return;

          const size = Math.min(width * 0.64, height * 0.88);
          offscreenContext.fillStyle = "#000";
          offscreenContext.textAlign = "center";
          offscreenContext.textBaseline = "middle";
          offscreenContext.font = `${size}px "DotGothic16", "Zen Kaku Gothic New", monospace`;
          offscreenContext.fillText(text, width * 0.5, height * 0.52);

          const image = offscreenContext.getImageData(0, 0, width, height).data;
          const step = Math.max(4, Math.round(size / 22));
          const nextParticles = [];
          const isSnowParticle = (homeX) => text === "Hi," && homeX >= width * 0.405 && homeX <= width * 0.57;
          const addParticle = (homeX, homeY, radiusScale = 1, variant = "earth") => {
            const jitter = step * 0.18;
            nextParticles.push({
              homeX: homeX + (Math.random() - 0.5) * jitter,
              homeY: homeY + (Math.random() - 0.5) * jitter,
              x: width * 0.5 + (Math.random() - 0.5) * width * 0.34,
              y: height * 0.5 + (Math.random() - 0.5) * height * 0.5,
              vx: 0,
              vy: 0,
              radius: Math.max(1.45, step * (0.18 + Math.random() * 0.16) * radiusScale),
              tone: Math.random(),
              variant,
              phase: Math.random() * Math.PI * 2,
            });
          };

          if (text === "Hi,") {
            const gridStep = Math.max(7, Math.round(size / 17.5));
            const glyphHeight = gridStep * 12;
            const glyphWidth = gridStep * 20;
            const startX = width * 0.5 - glyphWidth * 0.5;
            const startY = height * 0.5 - glyphHeight * 0.48;
            const addGridParticle = (gridX, gridY, variant = "earth") => {
              addParticle(startX + gridX * gridStep, startY + gridY * gridStep, 1.18, variant);
            };

            for (let row = 0; row <= 9; row += 1) {
              [0, 1, 6, 7].forEach((column) => addGridParticle(column, row));
            }

            [2, 3, 4, 5].forEach((column) => addGridParticle(column, 5));

            [11, 12, 11, 12].forEach((column, index) => addGridParticle(column, index < 2 ? 0 : 1, "snow"));
            [12, 13].forEach((column) => addGridParticle(column, 4, "snow"));
            for (let row = 3; row <= 8; row += 1) {
              addGridParticle(13, row, "snow");
            }
            [10, 11, 12, 13, 14, 15].forEach((column) => addGridParticle(column, 9, "snow"));
            [10, 15].forEach((column) => addGridParticle(column, 8, "snow"));

            [18, 19].forEach((column) => addGridParticle(column, 7));
            [18, 19].forEach((column) => addGridParticle(column, 8));
            [18, 19].forEach((column) => addGridParticle(column, 9));
            [17, 18].forEach((column) => addGridParticle(column, 10));
            addGridParticle(17, 11);
          } else {
            for (let y = 0; y < height; y += step) {
              for (let x = 0; x < width; x += step) {
                const alphaIndex = (y * width + x) * 4 + 3;
                if (image[alphaIndex] > 120) {
                  addParticle(x, y, 1, isSnowParticle(x) ? "snow" : "earth");
                }
              }
            }
          }

          particles = nextParticles;
          stage.classList.add("is-particle-ready");

          if (!reduced) {
            gsap.to(particles, {
              x: (_index, particle) => particle.homeX,
              y: (_index, particle) => particle.homeY,
              duration: 1.25,
              ease: "expo.out",
              stagger: { each: 0.001, from: "random" },
            });
          } else {
            particles.forEach((particle) => {
              particle.x = particle.homeX;
              particle.y = particle.homeY;
            });
          }

          cancelAnimationFrame(frame);
          draw();
        };

        const start = () => {
          rasterize();
          if (!reduced) {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(draw);
          }
        };

        const onPointerMove = (event) => {
          const rect = stage.getBoundingClientRect();
          pointer.x = event.clientX - rect.left;
          pointer.y = event.clientY - rect.top;
          pointer.active = true;
          stage.classList.add("is-hovering");
        };

        const onPointerLeave = () => {
          pointer.active = false;
          stage.classList.remove("is-hovering");
        };

        const onResize = () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(start, 160);
        };

        const startAfterLayoutSettles = () => {
          start();
          window.clearTimeout(settleTimer);
          settleTimer = window.setTimeout(start, 420);
        };

        stage.addEventListener("pointermove", onPointerMove);
        stage.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("resize", onResize);
        window.addEventListener("pageshow", onResize);

        if ("ResizeObserver" in window) {
          resizeObserver = new ResizeObserver(onResize);
          resizeObserver.observe(stage);
        }

        if (document.fonts?.load) {
          document.fonts.load('48px "DotGothic16"').then(startAfterLayoutSettles).catch(startAfterLayoutSettles);
        } else {
          startAfterLayoutSettles();
        }

        cleanup.push(() => {
          stage.removeEventListener("pointermove", onPointerMove);
          stage.removeEventListener("pointerleave", onPointerLeave);
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pageshow", onResize);
          if (resizeObserver) resizeObserver.disconnect();
          window.clearTimeout(resizeTimer);
          window.clearTimeout(settleTimer);
          cancelAnimationFrame(frame);
        });
      });

      root.querySelectorAll("[data-auralis-card], [data-auralis-step]").forEach((card) => {
        if (card.hasAttribute("data-portrait-stand")) return;

        const onPointerMove = (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          const isStep = card.hasAttribute("data-auralis-step");

          card.classList.add("is-hovering");
          card.style.setProperty("--card-x", `${px * 100}%`);
          card.style.setProperty("--card-y", `${py * 100}%`);

          if (reduced) return;

          gsap.to(card, {
            x: isStep ? 0 : (px - 0.5) * 3,
            y: isStep ? -3 : -7,
            scale: isStep ? 1 : 1.01,
            rotateX: isStep ? 0 : (0.5 - py) * 2.2,
            rotateY: isStep ? 0 : (px - 0.5) * -2.6,
            transformPerspective: 900,
            duration: 0.62,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onPointerLeave = () => {
          card.classList.remove("is-hovering");

          if (reduced) return;

          gsap.to(card, {
            x: 0,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            duration: 0.58,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("pointermove", onPointerMove);
        card.addEventListener("pointerleave", onPointerLeave);
        cleanup.push(() => {
          card.removeEventListener("pointermove", onPointerMove);
          card.removeEventListener("pointerleave", onPointerLeave);
        });
      });

      return () => cleanup.forEach((fn) => fn());
    },
    { scope: scopeRef }
  );
}
