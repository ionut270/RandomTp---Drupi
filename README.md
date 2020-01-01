
<img src="https://github.com/ionut270/RandomTp---Drupi/blob/master/random.png?raw=true" width="100" title="hover text">


# RandomTp (Drupi)

A simple Drupi random teleport plugin

## Introduction :

Have you ever gotten so bored on minecraft you could watch you'r diamonds being trown in lava ?
Well freet no more !
With random tp you could get to the schetchiest locations on the map.
- Up on a mountain
- In a mountain
- In an ocean
- In a desert biome
- In you'r house
- Near the world border
- etc

*Everything is posible with randomTP

## Config : 

A config file with the default values will be created at the plugin initialization.

```
{
  "radius": {
    "_comment": "Radius around the center_point at which you can be teleported. Sugested maximum is 29000000 which is 1000000 blocks less then the world border.",
    "value": 29000000
  },
  "cooldown": {
    "_comment": [
      "Player cooldown for this command in miliseconds. Mathematic expresions such as 60*60 are allowed. MUST BE A STRING VALUE",
      "The default value is 24 hours"
    ],
    "value": "60*60*24*1000"
  },
  "center_point": {
    "_comment": "The center point from which the player should be teleported away from",
    "value": { "x": 0, "z": 0 }
  }
}
```

The config is under the form of a .[json](https://www.json.org/json-en.html) file.
Why json and not yml ? 
- The plugin has been written in JavaScript, and working with a json in JS is much easier.

### Note : In case the center point + the radius value exceeds the world border coordinate, there is a chance that the plugin would attempt to send the player outside the world border, failing, and thus adding a cooldown for his use unecesarry.

## Console output : 
- A feature that alows an administrator to see in the console of the server how long it took for a player to load the chunk and teleport to the random position
- Console output now shows atempts to use the command
showing one of the following mesages : 
```
[RTP] Player "player.name" tried to teleport but has cooldown "cooldown"
[RTP] Player "player.name" tried to teleport without acess !
[RTP] Player "player.name" tries to teleport > Finding chunk ... !
```

## Permisions :

- rtp.use // acess to "/rtp" command
- rtp.super // acess to "/rtp" command without restrictions

## Requirements :

Drupi : https://www.spigotmc.org/resources/drupi.65706/

( [Drupi](https://www.spigotmc.org/resources/drupi.65706/) is a plugin that allows anyone to customize their Minecraft server using simple scripts written in JavaScript. The possibilities for what you can do with Drupi are near limitless )

Once you have Drupi in you'r server's plugin folder, it's config folder will be created.
Paste the .js file inside Drupi/scripts/modules then run /drupi reload on the server.

## Enjoy !
