#!/usr/bin/env node
const path = require("path");

const { getArgumentsObject } = require("./arguments");
const {
  getDependencyTreeObjectFromFile
} = require("../lib/log-treatment-service");
const {
  filterDependencyTree,
  getModulesLevelInfo
} = require("../lib/dependency-tree-service");
const { logger } = require("../lib/logger");
const {
  printModuleList,
  printSummary,
  saveOutputToFile,
  printModulesLevelInfo
} = require("./cli-helper");

function main() {
  const args = getArgumentsObject();
  logger.level = args.debug ? "debug" : "info";
  logger.debug("args", args);

  const pathToOutputFile = args.outputFile
    ? args.outputFile
    : `${path.basename(args.logFilePath)}_output.info`;
  logger.info(
    `Treating maven-dependency tree log info from ${args.logFilePath}`
  );

  const dependencyTreeObject = getDependencyTreeObjectFromFile(
    args.logFilePath
  );
  const dependencyTreeObjectFiltered = filterDependencyTree(
    dependencyTreeObject,
    args.filter,
    args.exclude
  );

  args.printModuleList && printModuleList(dependencyTreeObjectFiltered);
  args.artifacts &&
    args.artifacts.length &&
    printModulesLevelInfo(
      getModulesLevelInfo(dependencyTreeObjectFiltered, args.artifacts)
    );

  printSummary(
    dependencyTreeObjectFiltered,
    dependencyTreeObject,
    args.filter,
    args.exclude
  );

  saveOutputToFile(
    dependencyTreeObjectFiltered,
    pathToOutputFile,
    args.skipOutput
  );
}

if (require.main === module) {
  main();
}
module.exports = { main };
