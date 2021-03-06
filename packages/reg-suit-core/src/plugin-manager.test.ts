import * as path from "path";
import test from "ava";
import { PluginManager, PluginMetadata } from "./plugin-manager";
import { RegLogger } from "reg-suit-util";

function createPluginManager(pluginConfig: any) {
  const logger = new RegLogger();
  logger.setLevel("silent");
  const pm = new PluginManager(logger, false, {
    core: {
      actualDir: "",
      workingDir: path.join(__dirname, ".."),
    },
    plugins: pluginConfig,
  }, { actualDir: "", base: "", diffDir: "", expectedDir: "" });
  return pm;
}

test("should throws error when attempting to load non installed plugin", t => {
  const pm = createPluginManager({ "non-existing-plugin": { } });
  t.throws(() => pm.loadPlugins());
});

test("should return pluginHolders", t => {
  const pm = createPluginManager({ "./lib/testing/dummy-plugin": { } });
  pm.loadPlugins();
  t.is(pm._pluginHolders.length, 1);
  t.is(pm._pluginHolders[0].moduleId, "./lib/testing/dummy-plugin");
});

test("resolve locally installed module", t => {
  const pm = createPluginManager({ });
  const p = pm._resolve("reg-suit-util", path.resolve(__dirname, ".."));
  t.truthy(p.endsWith("reg-suit-util/lib/index.js"));
});

test("resolve relative path", t => {
  const pm = createPluginManager({ });
  const p = pm._resolve("../lib/testing/dummy-plugin", __dirname);
  t.is(p, path.resolve(__dirname, "testing/dummy-plugin.js"));
});
