Based on the images and the previously retrieved script content, the animation you're referring to is created by the code within the https://gsap.com/tf-assets/index-f64982e6.js file.

Specifically, the code uses GSAP to animate various SVG elements. The init() method within the d class (which likely stands for "Flower" or a similar component) identifies several key SVG parts:

.svg-hero-flair--path
.svg-hero-flair--star
.svg-hero-flair--circle (multiple circles)
.svg-hero-flair--anchor
.svg-hero-flair--anchor-path
.svg-hero-flair--anchor-rect path (multiple rectangles)
The setElements() method then initializes the visibility and scale of these elements. The rest of the script (beyond the first 5000 characters I provided) would contain the actual GSAP timelines and tweens that define the specific motion, morphing, and other animation effects seen in the flower. It also registers GSAP plugins like MorphSVGPlugin, which is crucial for path and shape morphing, likely used for the "flower" or path elements.