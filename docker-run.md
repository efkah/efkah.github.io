# docker-run

As a last step to docker for dummies, one could check out what the docker -compose file does. There are similarities to the run command

```bash
docker run --rm -it --volume=${PWD}:/src/jekyll -p 4040:4000 --network=bridge jekyll/builder /bin/bash
```

```bash
docker run --rm -it --volume=${PWD}:/srv/jekyll -p 4040:4000 --network=bridge jekyll/jekyll /bin/bash
```

