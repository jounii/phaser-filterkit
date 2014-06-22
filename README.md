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

SNoise
------

Original shader by Ian McEwan, Ashima Arts.

https://github.com/ashima/webgl-noise

Not sure if this is useful. Possibly with some tweaks and parameterization
could make it more useful. But use this as base for other filters.


License
=======

As code is mostly based on existing shaders so their licensing carries over:

-------
This work is licensed under a Creative Commons Attribution 3.0 Unported License.
So you are free to share, modify and adapt it for your needs, and even use it for commercial use.
I would also love to hear about a project you are using it.

-------
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.