---
layout: post
title:  "Using the ngrok-docker-container"
date:  2019-08-15
desc: "Easy Tutorial of how to use the NGROK Docker"
keywords: "Docker, ngrok, Tutorial, Easy"
categories: [web]
tags: [knowledge-base,infrastructure]
icon: fa-code
---

> More Text will follow

1. Create an own default network (which is recommanded anyway)

   ```bash
   docker network create fk-default
   ```

2. Start whatever Docker you like, as you always did

3. Connect the docker-image to the network

   ```bash
   docker network connect fk-default <container-name/id>
   ```

4. Open the Port for the network (the 4000 is an example)

   ```bash
   docker port <container-name/id> 4000
   ```

5. Start ngrok-docker. 4040 is ngroks most precious port.

   ```bash
   docker run --rm -d --name www_ngrok -p 4040:4040 -it --net fk-default wernight/ngrok ngrok http <container-name/id>:4000
   ```

6. And your done! Inspect your app at [localhost](http://localhost:4040/inspect/http) and get your urls (inspect the public_url property, or just open in a browser):

   ```bash
   curl http://localhost:4040/api/tunnels
   ```

   
