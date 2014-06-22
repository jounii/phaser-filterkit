phaser-filterkit
================

Assorted kit of PhaserJS WebGL Filters.

Filters
=======

Vignette
--------

Original shader by Evan Wallace.

http://evanw.github.io/glfx.js/
https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/vignette.js

FilmGrain
---------

Original shader by Martins Upitis.

http://devlog-martinsh.blogspot.fi/2013/05/image-imperfections-and-film-grain-post.html

Notes: The shader parameters were published and the texture randomness had some issues
with Phaser time uniform (seconds) over time. Shader modified so that it basically loops
every 120 seconds and the texture rotation is randomized to certain angle range.
