# sequelize-stream [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Build Status][circleci-image]][circleci-url]

Create a stream of [Sequelize](http://sequelizejs.com) create, update, and destroy events. This is useful if you want to build a real-time stream of events in your database.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [Install](#install)
- [Usage](#usage)
- [Methods](#methods)
- [Events](#events)
- [Note About Bulk Destroy](#note-about-bulk-destroy)
- [Tests](#tests)
- [Developing](#developing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Install

```sh
npm i -S sequelize-stream
```


## Usage

```js
// setup sequelize
import Sequelize from 'sequelize'
const sequelize = new Seqeulize({ dialect: 'sqlite' })
const Cat = sequelize.define('cat', {
  name: Sequelize.STRING
  , spots: Sequelize.INTEGER
})
sequelize.sync({force: true})

// install sequelizeStream
import sequelizeStream from 'sequelize-stream'
const stream = sequelizeStream(seqeulize)

// when the stream receives data, log
stream.on('data', ({instance, event}) => console.log(event, instance.toJSON()))

// examples
Cat.bulkCreate([{name: 'fluffy'}, {name: 'spot'}])
// => 'create', {name: 'fluffy', id: 1}
// => 'create', {name: 'spot', id: 2}
const sparky = Cat.create({name: 'sparky'})
// => 'create', {name: 'sparky', id: 3}
sparky.update({spots: 2})
// => 'update', {name: 'sparky', spots: 2, id: 3}
Cat.update({spots: 1}, {where: {name: 'sparky'}})
// => 'update', {name: 'sparky', spots: 1, id: 3}
sparky.destroy()
// => 'destroy', {name: 'sparky', spots: 1, id: 3}

// NOTE: bulk destroy doesn't work due to Sequelize limitations.
```

## Methods
### sequelizeStream `(<Sequelize instance> sequelize)` => `<stream.Readable instance>`
Pass a sequelize instance (`new Sequelize()`), and get back a standard node.js object readable stream. Subscribe to get events on all models as they go through your sequelize instance.

## Events
### data `(<Object> {<String> event, <Sequelize instance> instance})`
The stream will emit objects with keys of `event` and `instance`.

```js
const onData = ({event, instance} => {
  console.log(`${instance.$modelOptions.name.singluar} had a ${event} event`)
  // might log something like 'cat had a create event'
})
```


## Note About Bulk Destroy
`Model.destroy({where})` doesn't work because there's no good way to get affected instances and be sure they were actually deleted. Regular destroy does work though (`instance.destroy()`).

## Tests
Tests are in [AVA](https://github.com/avajs/ava).

* `npm test` will run the tests
* `npm run tdd` will run the tests on every file change.

## Developing
To publish, run `npm run release -- [{patch,minor,major}]`

_NOTE: you might need to `sudo ln -s /usr/local/bin/node /usr/bin/node` to ensure node is in your path for the git hooks to work_

### Requirements
* **npm > 2.0.0** So that passing args to a npm script will work. `npm i -g npm`
* **git > 1.8.3** So that `git push --follow-tags` will work. `brew install git`

## License

Artistic 2.0 © [Joey Baker](https://byjoeybaker.com) and contributors. A copy of the license can be found in the file `LICENSE`.


[npm-url]: https://www.npmjs.com/package/seqeulize-stream
[npm-image]: https://badge.fury.io/js/sequelize-stream.svg
[circleci-url]: https://circleci.com/gh/joeybaker/sequelize-stream
[circleci-image]: https://circleci.com/gh/joeybaker/sequelize-stream/tree/master.svg?style=svg
[daviddm-url]: https://david-dm.org/joeybaker/sequelize-stream.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/joeybaker/sequelize-stream

