#!/usr/bin/env node
const fs = require('fs')
const { lstat } = fs.promises
const chalk = require('chalk')
const path = require('path')

const targetDir = process.argv[2] || process.cwd()

fs.readdir(targetDir, async (err, filenames) => {
  if (err) console.log(err);

  const getStat = filenames.map(filename => {
    return lstat(path.join(targetDir, filename))
  })
  const allStats = await Promise.all(getStat)

  for (let stats of allStats) {
    const index = allStats.indexOf(stats)

    if (stats.isFile()) {
      console.log(
          chalk.cyan(filenames[index])
      )
    }
    else {
      console.log(
          chalk.bold.magenta(filenames[index])
      )
    }
  }

  // Obsolete approach
  // const allStats = Array(filenames.length).fill(null)
  //
  // for (let filename of filenames) {
  //   const index = filenames.indexOf(filename)
    // fs.lstat(filename, (error, stats) => {
    //   if (err) console.log(err);
    //   // console.log(filename, stats.isFile());
    //   allStats[index] = stats
    //
    //   const ready = allStats.every((stat) => {
    //     return stat
    //   })
    //
    //   if (ready) {
    //     allStats.forEach((stat, index) => {
    //       console.log(filenames[index], stat.isFile());
    //     })
    //   }
    // })
  // }
})
