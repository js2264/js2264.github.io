- To build website: Github Actions do it automatically. 

- To serve site locally: 

```r
blogdown::build_site()
```

- For art gallery, simply put png files in `content/arts/` and run `blogdown::serve_site()`. Files can be compressed by running: 

```sh
find content/arts/voronoi/ -name '*.png' -exec pngquant --speed 4 --nofs --ext .png --force 256 {} \;
```
