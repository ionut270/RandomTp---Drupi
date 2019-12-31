command.create(
  "rtp",
  "Some prefix",
  "Random teleport troughout the whole map !",
  teleportRandom
);

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
    var cooldown = checkPlayerEntry(player);

    if (
      cooldown === false ||
      player.hasPermission("*") ||
      player.hasPermission("rtp.super")
    ) {
      const x =
        Math.floor(Math.random() * 29000000) * (Math.random() < 0.5 ? -1 : 1);
      const z =
        Math.floor(Math.random() * 29000000) * (Math.random() < 0.5 ? -1 : 1);
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
          Location.getChunk().load();
        }

        if (!unsafeBelow) {
          //Safe spot
          player.sendMessage("[RTP] \u00a7aSafe spot found !");
          unsafeAbove = false;
        }
      }

      if (!unsafeAbove && !unsafeBelow) {
        5;
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
      player.sendMessage(
        "[RTP] \u00a7cYou can execute thic command again in " + cooldown
      );
    }
  } else {
    player.sendMessage("\u00A7cYou don't have acess to this command !");
  }
}

function addPlayerEntry(player) {
  var File = manager.getFile("RTP", "user.json");
  var docs = manager.readFile(File);
  docs[player] = "" + new Date();
  if (docs.length > 0) {
    docs = JSON.parse(docs);
  } else {
    docs = {}
  }
  manager.writeToFile(File, JSON.stringify(docs));
}

function checkPlayerEntry(player) {
  var File = manager.getFile("RTP", "user.json");
  var docs = manager.readFile(File);
  if (docs.length > 0) {
    docs = JSON.parse(docs);
  } else {
    docs = {}
  }
  if (docs[player]) {
    //We have the player entry in !

    var cooldown = new Date(docs[player]);
    cooldown.setDate(cooldown.getDate() + 1);
    if (eval(cooldown - new Date()) < 0) {
      addPlayerEntry(player);
      return false;
    } else {
      return TimeCounter((cooldown - new Date()) / 1000);
    }
  } else {
    addPlayerEntry(player);
    return false;
    //logged to the cooldown
  }
}

function TimeCounter(time) {
  var content = "";
  var tx = time;
  var t = parseInt(tx);
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
  return content;
}
