command.create(
  "rtp",
  "I don't know what this prefix should be .",
  "Random teleport troughout the whole map !",
  teleportRandom
);

console.log("===============EnderXking===============");
console.log("      ___                       ___   ");
console.log("     /  /\\          ___        /  /\\  ");
console.log("    /  /::\\        /  /\\      /  /::\\ ");
console.log("   /  /:/\\:\\      /  /:/     /  /:/\\:\\");
console.log("  /  /:/~/:/     /  /:/     /  /:/~/:/");
console.log(" /__/:/ /:/___  /  /::\\    /__/:/ /:/ ");
console.log(" \\  \\:\\/:::::/ /__/:/\\:\\   \\  \\:\\/:/  ");
console.log("  \\  \\::/~~~~  \\__\\/  \\:\\   \\  \\::/   ");
console.log("   \\  \\:\\           \\  \\:\\   \\  \\:\\   ");
console.log("    \\  \\:\\           \\__\\/    \\  \\:\\  ");
console.log("     \\__\\/                     \\__\\/");
console.log("=============RTP BY Ionut.E=============");

//config initialization
var config_File = manager.getFile("RTP", "config.json");
var config = manager.readFile(config_File);

if (config === "") {
  config = {
    radius: {
      _comment:
        "Radius around the center_point at which you can be teleported. Sugested maximum is 29000000 which is 1000000 blocks less then the world border.",
      value: 29000000
    },
    cooldown: {
      _comment: [
        "Player cooldown for this command in miliseconds. Mathematic expresions such as 60*60 are allowed. MUST BE A STRING VALUE",
        "The default value is 24 hours"
      ],
      value: "60*60*24*1000"
    },
    center_point: {
      _comment:
        "The center point from which the player should be teleported away from",
      value: { x: 0, z: 0 }
    }
  };
  manager.writeToFile(config_File, JSON.stringify(config));
} else {
  config = JSON.parse(config);
}
console.log("[RTP] Config handled !");

var timer;

function teleportRandom(sender, args) {
  //global initializaion
  var player = cast.asPlayer(sender);
  const world = server.getWorld("world");

  //has permision ?
  if (
    player.hasPermission("*") ||
    player.hasPermission("rtp.use") ||
    player.hasPermission("rtp.super")
  ) {
    //Config *
    var cooldown = checkPlayerEntry(player, eval(config.cooldown.value));

    if (
      cooldown === false ||
      player.hasPermission("*") ||
      player.hasPermission("rtp.super")
    ) {
      console.log(
        "[RTP] Player " +
          player.name +
          " tries to teleport > Finding chunk ... !"
      );
      // console.log(
      //   "[RTP] ONE OF THEM WAS SUCESGULL > " +
      //     cooldown +
      //     " + " +
      //     player.hasPermission("*") +
      //     " + " +
      //     player.hasPermission("rtp.super")
      // );
      const x =
        Math.floor(Math.random() * config.radius.value) *
          (Math.random() < 0.5 ? -1 : 1) +
        config.center_point.value.x;
      const z =
        Math.floor(Math.random() * config.radius.value) *
          (Math.random() < 0.5 ? -1 : 1) +
        config.center_point.value.z;
      var Location = manager.newLocationWorld(world, x, 60, z);

      //Then check if the block at which I'm trying to teleport is safe
      player.sendMessage(
        "[RTP] \u00a77Teleportation will begin once a \u00a7esafe lcoation\u00a77 has been found ..."
      );
      var unsafeAbove = true;
      var unsafeBelow = true;

      while (unsafeAbove) {
        let block = Location.getBlock().type;

        //We check if blocks beneath are solid and also that is not lava
        if (block == "WATER" || block == "LAVA" || block == "AIR") {
          Location.add(1000, 0, 0);
        } else {
          unsafeBelow = false;
          console.log(
            "[RTP] Player " +
              player.name +
              " teleport chunk found loading chunk ... "
          );
          timer = new Date();
          Location.getChunk().load();
          timer = new Date() - timer;
          console.log(
            "[RTP] Player " +
              player.name +
              " teleport Loading chunk took " +
              TimeCounter(parseInt(timer))
          );
        }

        if (!unsafeBelow) {
          //Safe spot
          player.sendMessage("[RTP] \u00a7aSafe spot found !");
          unsafeAbove = false;
        }
      }

      if (!unsafeAbove && !unsafeBelow) {
        player.sendMessage("[RTP] \u00a77\u00a7oLoading chunk ...");

        //An idea was to tp the player up above the loafing chunk, and after we think its loaded to tp the player below
        //player.teleport(Location.add(0, 5000, 0));
        //Location.add(0, -5000, 0);

        setTimeout(() => {
          while (Location.getBlock().type != "AIR") {
            Location.add(0, 5, 0);
          }
          while (Location.getBlock().type == "AIR") {
            Location.add(0, -1, 0);
          }
          if (player.hasPermission("rtp.super") || player.hasPermission("*")) {
            player.sendMessage("[RTP] \u00a7eThere you go !");
          } else {
            player.sendMessage(
              "[RTP] \u00a7eThere you go ! \u00a77\u00a7o( 24 hours cooldown )"
            );
          }
          Location.add(0.5, 1, 0.5);
          player.teleport(Location);
        }, 20 * 5);
      }
    } else {
      console.log(
        "[RTP] Player " +
          player.name +
          " tried to teleport but has cooldown " +
          cooldown
      );
      player.sendMessage(
        "[RTP] \u00a7cYou can execute thic command again in " + cooldown
      );
    }
  } else {
    console.log(
      "[RTP] Player " + player.name + " tried to teleport without acess !"
    );
    player.sendMessage("\u00A7cYou don't have acess to this command !");
  }
}

function addPlayerEntry(player) {
  var File = manager.getFile("RTP", "user.json");
  var docs = manager.readFile(File);

  if (docs.length > 0) {
    docs = JSON.parse(docs);
  } else {
    docs = {};
  }

  docs[player] = "" + new Date();

  // console.log("ADDING PLAYER ENTRY !!! > " + JSON.stringify(docs));
  manager.writeToFile(File, JSON.stringify(docs));
}

function checkPlayerEntry(player, cfg_cooldown) {
  // console.log("[RTP] Looking up for player entry !");
  var File = manager.getFile("RTP", "user.json");
  var docs = manager.readFile(File);
  if (docs.length > 0) {
    docs = JSON.parse(docs);
  } else {
    docs = {};
  }
  if (docs[player]) {
    // console.log("[RTP] Player entry found !");
    //We have the player entry in !

    var cooldown = new Date(docs[player]);
    // console.log(
    //   "[RTP] > Calculating cooldown value > " +
    //     eval(cooldown.getTime()) +
    //     " + < CFG DATA >" +
    //     cfg_cooldown
    // );
    cooldown = eval(cooldown.getTime()) + cfg_cooldown;
    //console.log("[RTP] > COOLDOWN RES === " + cooldown);
    cooldown = new Date(cooldown);

    if (eval(cooldown - new Date()) < 0) {
      //console.log("[RTP] > No cooldown left > " + cooldown);
      addPlayerEntry(player);
      return false;
    } else {
      // console.log(
      //   "[RTP] COOLDOWN ! > " + cooldown + " < - NEW DATE > " + new Date()
      // );
      return TimeCounter((cooldown - new Date()) / 1000);
    }
  } else {
    //console.log("[RTP] > No player entry !");
    addPlayerEntry(player);
    return false;
    //logged to the cooldown
  }
}

function TimeCounter(time) {
  //console.log("[RTP] > TRANSLATING COOLDOWN > " + time);
  var content = "";
  var t = parseInt(time);
  var days = parseInt(t / 86400);
  t = t - days * 86400;
  var hours = parseInt(t / 3600);
  t = t - hours * 3600;
  var minutes = parseInt(t / 60);
  t = t - minutes * 60;
  if (days) content += days + " days";
  if (hours || days) {
    if (days) content += ", ";
    content += hours + " hours, ";
  }
  content += minutes + " minutes and " + t + " seconds.";
  //console.log("[RTP] COOLDOWN LEFGT RESULT  > " + content);
  return content;
}
