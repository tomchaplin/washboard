# washboard

Washboard is a tool for visualising 6-packs of persistence diagrams (introduced in [[1]](#1)) and relations between points therein.
Each point in each diagram corresponds to a (birth, death) cell pairings.
When hovering over a point in one diagram, washboard highlights all other points whose pairings have some cell in common.

* Persistence diagrams are displayed using [Chart.js](https://www.chartjs.org/).
* Washboard is built from Vanilla JavaScript and bundled with [Vite](https://vitejs.dev/) down to a single HTML file.
* Data is provided to the frontend as a `data.json` file.
This file contains all of the diagrams as well as relations between points - this should be precomputed by you!

Washboard is in very early development so documentation and helper scripts are not yet available.
If you would like to know how to use it in your project please get in touch or make an issue!

## References

<a id="1">[1]</a> di Montesano, Sebastiano Cultrera, et al.
"Persistent Homology of Chromatic Alpha Complexes."
arXiv preprint [arXiv:2212.03128](https://arxiv.org/abs/2212.03128) (2022).
