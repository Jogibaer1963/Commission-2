  var minVersion = '4.2.1',
      fs = Npm.require('fs'),
      path = Npm.require('path'),
      npmPath = ['.npm', 'package', 'node_modules', 'highcharts'],
      configFile = path.resolve('./client/config.highcharts.json'),
      where = 'client',
      config = false;

  // Get user options:
  try {
    config = JSON.parse(fs.readFileSync(configFile));
  } catch (err) {
    console.log('Config file: config.highcharts.json doesn\'t exist or is not a proper JSON. Proceeding with the default options.\n', err);
  }

  // Build up options:
  var adapter = config && config.adapter ? config.adapter : 'default',
      base = config && config.base ? config.base : 'highcharts.js',
      modules = config && config.modules ? config.modules : [],
      releaseVersion = config && config.version ? config.version : minVersion,
      modulesLength = modules.length,
      dependency = {},
      files = [],
      i;

  // Hook to highcharts NPM package:
  Npm.depends({
    highcharts: releaseVersion
  });

  // Add modules:
  for (i = 0; i < modulesLength; i++) {
    files.push(npmPath.concat([modules[i]]).join(path.sep));
  }

  Package.describe({
    name: 'highcharts-container',
    version: '1.0.0',
    summary: 'Container for Highcharts build.'
  });

  Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.export('Highcharts');

    // Add config file to force Meteor watch for changes:
    api.addFiles(configFile, where, {isAsset: true});

    // jQuery dependency or Standalone Adapter:
    if (adapter === 'jquery') {
      api.use(adapter);
    } else if (adapter !== 'default') {
      api.addFiles(npmPath.concat(['adapters', adapter]).join(path.sep), where);
    }

    // Add core:
    api.addFiles([
      'meteor-prefix.js',
      npmPath.concat([base]).join(path.sep),
      'meteor-postfix.js'
    ], where);

    // Add modules:
    api.addFiles(files, where);
  });