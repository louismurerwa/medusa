import boxen from "boxen"
import chalk from "chalk"
import * as fs from "fs"
import _ from "lodash"
import { EOL } from "os"
import { resolve } from "path"
import pluralize from "pluralize"
import { spinner } from "../index.js"
import { cloneTemplateDirectory } from "../utils/clone-template.js"
import log from "../utils/logger.js"

export async function createNewModule(
  moduleName: string,
  { path }: { path: string }
): Promise<void> {
  const moduleTemplateVars: Record<string, string> = {
    moduleName: moduleName,
    moduleNameCamelCase: _.camelCase(moduleName),
    moduleNamePascalCase: _.startCase(_.camelCase(moduleName)).replace(
      / /g,
      ""
    ),
    moduleNameSnakeCase: _.snakeCase(moduleName),
    moduleNameKebabCase: _.kebabCase(moduleName),
    moduleNameUpperCase: moduleName.toUpperCase(),
    moduleNameTitleCase: _.startCase(_.camelCase(moduleName)),
    moduleNameLowerCase: moduleName.toLowerCase().replace(/ /g, ""),
    moduleNameConstantCase: _.upperCase(moduleName).replace(/ /g, "_"),
    timestamp: Date.now() + "",
  }

  for (const key in moduleTemplateVars) {
    moduleTemplateVars[key.replace("moduleName", "moduleNamePlural")] =
      pluralize(moduleTemplateVars[key])
  }

  log(`Creating new module ${moduleName}`)

  const folderName = moduleTemplateVars.moduleNameKebabCase
  const modulePath = resolve(path, folderName)

  log(`The module will be created in ${modulePath}`)

  if (fs.existsSync(modulePath)) {
    log(`The directory ${folderName} already exists`, "error")
    log(`Please try again with another name`, "error")
    return
  }

  spinner.succeed(`Created module directory ${folderName}`)

  await fs.promises.mkdir(modulePath)
  await cloneTemplateDirectory(
    "./src/templates/module_base",
    modulePath,
    moduleTemplateVars
  )

  log(
    boxen(
      chalk.green(
        `You can change to the module directory with ${chalk.bold.green(
          `cd ${folderName}`
        )}.${EOL}${EOL}
        Please, look through the files that have been generated to validate that everything is correct.
        `
      ),
      {
        titleAlignment: "center",
        textAlignment: "center",
        padding: 1,
        margin: 1,
        float: "center",
      }
    )
  )
}
