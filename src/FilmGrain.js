/**
 *
 * @filter         Film Grain
 *
 * Original shader by Martins Upitis
 *
 * http://devlog-martinsh.blogspot.fi/2013/05/image-imperfections-and-film-grain-post.html
 *
 * Converted to Phaser/PIXI by Jouni Airaksinen, jouni.airaksinen@sc5.io
 *
 */
/*
 Film Grain post-process shader v1.1
 Martins Upitis (martinsh) devlog-martinsh.blogspot.com
 2013

 --------------------------
 This work is licensed under a Creative Commons Attribution 3.0 Unported License.
 So you are free to share, modify and adapt it for your needs, and even use it for commercial use.
 I would also love to hear about a project you are using it.

 Have fun,
 Martins
 --------------------------

 Perlin noise shader by toneburst:
 http://machinesdontcare.wordpress.com/2009/06/25/3d-perlin-noise-sphere-vertex-shader-sourcecode/
 */

Phaser.Filter.FilmGrain = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.lumAmount = { type: '1f', value: 1.0 };
    this.uniforms.grainSize = { type: '1f', value: 0.1 };
    this.uniforms.grainAmount = { type: '1f', value: 0.05 };
    this.uniforms.colorAmount = { type: '1f', value: 0.0 };

    this.fragmentSrc = [
        "precision mediump float;",
        "uniform float time;",
        "uniform sampler2D uSampler;",
        "uniform vec2 resolution;",
        "uniform float colorAmount;",
        "uniform float grainAmount;",
        "uniform float grainSize;",
        "uniform float lumAmount;",
        "varying vec2 vTextureCoord;",

        "const float permTexUnit = 1.0/256.0;",		// Perm texture texel-size
        "const float permTexUnitHalf = 0.5/256.0;",	// Half perm texture texel-size

        // As time progresses, the random starts to produce artifacts, rotate time in range
        // which is still fine, thus the grain loops every 120 seconds
        "float modTime = time - floor(time * (1.0 / 120.0)) * 120.0;",

        "float width = resolution.x;",
        "float height = resolution.y;",

        "bool colored = colorAmount > 0.0;",
        "float grainsize = 1.5 + grainSize;", //grain particle size (1.5 - 2.5)

        //a random texture generator, but you can also use a pre-computed perturbation texture
        "vec4 rnm(in vec2 tc) {",
        "float noise = sin(dot(tc + vec2(modTime,modTime),vec2(12.9898,78.233))) * 43758.5453;",

        "float noiseR = fract(noise)*2.0-1.0;",
        "float noiseG = fract(noise*1.2154)*2.0-1.0;",
        "float noiseB = fract(noise*1.3453)*2.0-1.0;",
        "float noiseA = fract(noise*1.3647)*2.0-1.0;",

        "return vec4(noiseR,noiseG,noiseB,noiseA);",
        "}",

        "float fade(in float t) {",
        "return t*t*t*(t*(t*6.0-15.0)+10.0);",
        "}",

        // TODO: replace to simplex from SNoise?
        "float pnoise3D(in vec3 p) {",
        "vec3 pi = permTexUnit*floor(p)+permTexUnitHalf;", // Integer part, scaled so +1 moves permTexUnit texel
        // and offset 1/2 texel to sample texel centers
        "vec3 pf = fract(p);",     // Fractional part for interpolation

        // Noise contributions from (x=0, y=0), z=0 and z=1
        "float perm00 = rnm(pi.xy).a;",
        "vec3  grad000 = rnm(vec2(perm00, pi.z)).rgb * 4.0 - 1.0;",
        "float n000 = dot(grad000, pf);",
        "vec3  grad001 = rnm(vec2(perm00, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
        "float n001 = dot(grad001, pf - vec3(0.0, 0.0, 1.0));",

        // Noise contributions from (x=0, y=1), z=0 and z=1
        "float perm01 = rnm(pi.xy + vec2(0.0, permTexUnit)).a ;",
        "vec3  grad010 = rnm(vec2(perm01, pi.z)).rgb * 4.0 - 1.0;",
        "float n010 = dot(grad010, pf - vec3(0.0, 1.0, 0.0));",
        "vec3  grad011 = rnm(vec2(perm01, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
        "float n011 = dot(grad011, pf - vec3(0.0, 1.0, 1.0));",

        // Noise contributions from (x=1, y=0), z=0 and z=1
        "float perm10 = rnm(pi.xy + vec2(permTexUnit, 0.0)).a ;",
        "vec3  grad100 = rnm(vec2(perm10, pi.z)).rgb * 4.0 - 1.0;",
        "float n100 = dot(grad100, pf - vec3(1.0, 0.0, 0.0));",
        "vec3  grad101 = rnm(vec2(perm10, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
        "float n101 = dot(grad101, pf - vec3(1.0, 0.0, 1.0));",

        // Noise contributions from (x=1, y=1), z=0 and z=1
        "float perm11 = rnm(pi.xy + vec2(permTexUnit, permTexUnit)).a ;",
        "vec3  grad110 = rnm(vec2(perm11, pi.z)).rgb * 4.0 - 1.0;",
        "float n110 = dot(grad110, pf - vec3(1.0, 1.0, 0.0));",
        "vec3  grad111 = rnm(vec2(perm11, pi.z + permTexUnit)).rgb * 4.0 - 1.0;",
        "float n111 = dot(grad111, pf - vec3(1.0, 1.0, 1.0));",

        // Blend contributions along x
        "vec4 n_x = mix(vec4(n000, n001, n010, n011), vec4(n100, n101, n110, n111), fade(pf.x));",

        // Blend contributions along y
        "vec2 n_xy = mix(n_x.xy, n_x.zw, fade(pf.y));",

        // Blend contributions along z
        "float n_xyz = mix(n_xy.x, n_xy.y, fade(pf.z));",

        // We're done, return the final noise value.
        "return n_xyz;",
        "}",

        //2d coordinate orientation thing
        "vec2 coordRot(in vec2 tc, in float angle) {",
        "float aspect = width/height;",
        "float rotX = ((tc.x*2.0-1.0)*aspect*cos(angle)) - ((tc.y*2.0-1.0)*sin(angle));",
        "float rotY = ((tc.y*2.0-1.0)*cos(angle)) + ((tc.x*2.0-1.0)*aspect*sin(angle));",
        "rotX = ((rotX/aspect)*0.5+0.5);",
        "rotY = rotY*0.5+0.5;",
        "return vec2(rotX,rotY);",
        "}",

        "float rand() {",
        "return fract(cos(dot(vec2(modTime, modTime), vec2(12.9898, 4.1414))) * 43758.5453);",
        "}",

        // Main filter
        "void main(void) {",

        "vec2 rotCoordsR = coordRot(vTextureCoord, 0.05*rand() + 1.1087);",
        //"vec2 rotCoordsR = vTextureCoord;",
        "vec3 noise = vec3(pnoise3D(vec3(rotCoordsR*vec2(width/grainsize,height/grainsize),0.0)));",

        "if (colored) {",
        "vec2 rotCoordsG = coordRot(vTextureCoord, 0.06*rand() + 1.1087);",
        "vec2 rotCoordsB = coordRot(vTextureCoord, 0.07*rand() + 1.1087);",
        "noise.g = mix(noise.r,pnoise3D(vec3(rotCoordsG*vec2(width/grainsize,height/grainsize),1.0)),colorAmount);",
        "noise.b = mix(noise.r,pnoise3D(vec3(rotCoordsB*vec2(width/grainsize,height/grainsize),2.0)),colorAmount);",
        "}",

        "vec4 color = texture2D(uSampler, vTextureCoord);",
        "vec3 col = color.rgb;",

        //noisiness response curve based on scene luminance
        "vec3 lumcoeff = vec3(0.299,0.587,0.114);",
        "float luminance = mix(0.0,dot(col, lumcoeff),lumAmount);",
        "float lum = smoothstep(0.2,0.0,luminance);",
        "lum += luminance;",

        "noise = mix(noise,vec3(0.0),pow(lum,4.0));",
        "col = col + noise*grainAmount;",

        "gl_FragColor = vec4(col, color.a);",
        "}"
        ];

};

Phaser.Filter.FilmGrain.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.FilmGrain.prototype.constructor = Phaser.Filter.FilmGrain;

Phaser.Filter.FilmGrain.prototype.init = function (width, height) {
    this.setResolution(width || this.game.width, height || this.game.height);
};

Object.defineProperty(Phaser.Filter.FilmGrain.prototype, 'color', {

    get: function() {
        return this.uniforms.colorAmount.value;
    },

    set: function(value) {
        this.uniforms.colorAmount.value = Math.max(0, Math.min(value, 1));
    }

});
Object.defineProperty(Phaser.Filter.FilmGrain.prototype, 'luminance', {

    get: function() {
        return this.uniforms.lumAmount.value;
    },

    set: function(value) {
        this.uniforms.lumAmount.value = value;
    }

});
Object.defineProperty(Phaser.Filter.FilmGrain.prototype, 'size', {

    get: function() {
        return this.uniforms.grainSize.value;
    },

    set: function(value) {
        this.uniforms.grainSize.value = Math.max(0, Math.min(value, 1));
    }

});
Object.defineProperty(Phaser.Filter.FilmGrain.prototype, 'amount', {

    get: function() {
        return this.uniforms.grainAmount.value;
    },

    set: function(value) {
        this.uniforms.grainAmount.value = Math.max(0, Math.min(value, 1));
    }

});