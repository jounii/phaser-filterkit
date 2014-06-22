/**
 *
 * @filter         Vignette
 * @description    Adds a simulated lens edge darkening effect.
 *
 * param size     0 to 1 (0 for center of frame, 1 for edge of frame)
 * param amount   0 to 1 (0 for no effect, 1 for maximum lens darkening)
 *
 * Original shader by Evan Wallace.
 *
 * http://evanw.github.io/glfx.js/
 *
 * https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/vignette.js
 *
 * Converted to Phaser/PIXI by Jouni Airaksinen, jouni.airaksinen@sc5.io
 *
 */
Phaser.Filter.Vignette = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.alpha = { type: '1f', value: 1.0 };
    this.uniforms.size = { type: '1f', value: 0.5 };
    this.uniforms.amount = { type: '1f', value: 0.5 };

    this.fragmentSrc = [

        "precision mediump float;",
        "uniform sampler2D uSampler;",
        "uniform float time;",
        "uniform float alpha;",
        "uniform float size;",
        "uniform float amount;",
        "varying vec2 vTextureCoord;",

        "void main(void) {",

        "vec4 color = texture2D(uSampler, vTextureCoord);",

        "float dist = distance(vTextureCoord, vec2(0.5, 0.5));",

        "color.rgb *= smoothstep(0.8, size * 1.0 * 0.799, dist * (alpha * amount + size));",
        "gl_FragColor = color;",
        "}"
    ];

};

Phaser.Filter.Vignette.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Vignette.prototype.constructor = Phaser.Filter.Vignette;

Object.defineProperty(Phaser.Filter.Vignette.prototype, 'alpha', {

    get: function() {
        return this.uniforms.alpha.value;
    },

    set: function(value) {
        this.uniforms.alpha.value = value;
    }

});

Object.defineProperty(Phaser.Filter.Vignette.prototype, 'size', {

    get: function() {
        return this.uniforms.size.value;
    },

    set: function(value) {
        this.uniforms.size.value = Math.max(0, Math.min(value, 1));
    }

});

Object.defineProperty(Phaser.Filter.Vignette.prototype, 'amount', {

    get: function() {
        return this.uniforms.amount.value;
    },

    set: function(value) {
        this.uniforms.amount.value = Math.max(0, Math.min(value, 1));
    }

});